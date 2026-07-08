export class DeploymentPolicy {
  public canDeploy(actorRole: string, competitionStatus: string): boolean {
    return competitionStatus === 'PUBLISHED' && (actorRole === 'SUPER_ADMIN' || actorRole === 'DEPLOYMENT_MANAGER');
  }
}
