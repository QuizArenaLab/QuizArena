import { NavigationManifest } from "./NavigationManifest";
import { NavigationTreeNode } from "./NavigationTreeNode";
import { NavigationPermission } from "./NavigationPermissions";
import { ResolvedNavigationGroup } from "./NavigationGroup";

class NavigationRegistryImpl {
  private manifests = new Map<string, NavigationManifest>();

  register(manifest: NavigationManifest): void {
    if (this.manifests.has(manifest.id)) {
      console.warn(
        `[NavigationRegistry] Manifest ${manifest.id} is already registered. Overwriting.`
      );
    }
    this.manifests.set(manifest.id, manifest);
  }

  unregister(id: string): void {
    this.manifests.delete(id);
  }

  find(id: string): NavigationManifest | undefined {
    return this.manifests.get(id);
  }

  findByRoute(route: string): NavigationManifest | undefined {
    return Array.from(this.manifests.values()).find((m) => m.route === route);
  }

  list(): NavigationManifest[] {
    return Array.from(this.manifests.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  validate(manifest: NavigationManifest): boolean {
    if (!manifest.id || !manifest.title || !manifest.route || !manifest.version) {
      return false;
    }
    // Check circular dependencies if a parent is specified
    let current: NavigationManifest | undefined = manifest;
    const visited = new Set<string>();
    while (current?.parent) {
      if (visited.has(current.parent)) return false;
      visited.add(current.parent);
      current = this.find(current.parent);
    }
    return true;
  }

  resolvePermissions(
    userPermissions: NavigationPermission[],
    manifestPermissions?: NavigationPermission[]
  ): boolean {
    if (!manifestPermissions || manifestPermissions.length === 0) return true;
    return manifestPermissions.some((perm) => userPermissions.includes(perm));
  }

  resolveTree(userPermissions: NavigationPermission[]): ResolvedNavigationGroup[] {
    const allManifests = this.list().filter(
      (m) => !m.hidden && this.resolvePermissions(userPermissions, m.permissions)
    );

    // Grouping logic
    const groupsMap = new Map<string, NavigationTreeNode[]>();
    const nodeMap = new Map<string, NavigationTreeNode>();

    // First pass: create nodes
    allManifests.forEach((m) => {
      nodeMap.set(m.id, { manifest: m, children: [] });
    });

    // Second pass: build hierarchy
    nodeMap.forEach((node, id) => {
      if (node.manifest.parent && nodeMap.has(node.manifest.parent)) {
        nodeMap.get(node.manifest.parent)!.children.push(node);
      } else {
        const groupKey = node.manifest.group || "default";
        if (!groupsMap.has(groupKey)) {
          groupsMap.set(groupKey, []);
        }
        groupsMap.get(groupKey)!.push(node);
      }
    });

    // Sort children recursively
    const sortNodes = (nodes: NavigationTreeNode[]) => {
      nodes.sort((a, b) => (a.manifest.order || 0) - (b.manifest.order || 0));
      nodes.forEach((n) => sortNodes(n.children));
    };

    const resolvedGroups: ResolvedNavigationGroup[] = [];
    groupsMap.forEach((nodes, groupId) => {
      sortNodes(nodes);
      resolvedGroups.push({
        id: groupId,
        title: groupId !== "default" ? groupId : undefined,
        nodes,
      });
    });

    return resolvedGroups.sort((a, b) => (a.order || 0) - (b.order || 0)); // Group sorting could be advanced later
  }

  resolveBranch(
    branchId: string,
    userPermissions: NavigationPermission[]
  ): ResolvedNavigationGroup | null {
    const allManifests = this.list().filter(
      (m) => !m.hidden && this.resolvePermissions(userPermissions, m.permissions)
    );

    const nodeMap = new Map<string, NavigationTreeNode>();

    // First pass
    allManifests.forEach((m) => {
      nodeMap.set(m.id, { manifest: m, children: [] });
    });

    // Second pass to build hierarchy
    nodeMap.forEach((node, id) => {
      if (node.manifest.parent && nodeMap.has(node.manifest.parent)) {
        nodeMap.get(node.manifest.parent)!.children.push(node);
      }
    });

    const rootNode = nodeMap.get(branchId);
    if (!rootNode) return null;

    const sortNodes = (nodes: NavigationTreeNode[]) => {
      nodes.sort((a, b) => (a.manifest.order || 0) - (b.manifest.order || 0));
      nodes.forEach((n) => sortNodes(n.children));
    };

    sortNodes(rootNode.children);

    return {
      id: branchId,
      title: rootNode.manifest.title,
      nodes: rootNode.children,
    };
  }
}

export const NavigationRegistry = new NavigationRegistryImpl();
