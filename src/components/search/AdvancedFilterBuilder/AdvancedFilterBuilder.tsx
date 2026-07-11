import React, { ReactNode } from "react";
import { cn } from "../../../utilities";
import { Button } from "../../primitives/Button";
import { Icon } from "../../../icons";
import { AdvancedFilterGroupModel, AdvancedFilterRule } from "../../../search";

export interface AdvancedFilterBuilderProps {
  rootGroup: AdvancedFilterGroupModel;
  className?: string;
  // Read-only UI props for architecture demonstration
  onAddRule?: (groupId: string) => void;
  onAddGroup?: (groupId: string) => void;
  onRemoveRule?: (ruleId: string) => void;
  onRemoveGroup?: (groupId: string) => void;
  // For rendering custom inputs in the 'value' slot
  renderFieldInput?: (rule: AdvancedFilterRule) => ReactNode;
}

export function AdvancedFilterBuilder({
  rootGroup,
  className,
  onAddRule,
  onAddGroup,
  onRemoveRule,
  onRemoveGroup,
  renderFieldInput,
}: AdvancedFilterBuilderProps) {
  const renderRule = (rule: AdvancedFilterRule) => (
    <div key={rule.id} className="flex items-center gap-2 w-full animate-in fade-in duration-200">
      <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="h-9 px-3 border border-input rounded-md flex items-center bg-background text-sm truncate">
          {rule.field}
        </div>
        <div className="h-9 px-3 border border-input rounded-md flex items-center bg-muted/30 text-sm truncate">
          {rule.operator}
        </div>
        <div className="h-9 rounded-md flex items-center text-sm w-full">
          {renderFieldInput ? (
            renderFieldInput(rule)
          ) : (
            <div className="h-full w-full px-3 border border-input rounded-md flex items-center bg-background truncate">
              {rule.value}
            </div>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => onRemoveRule?.(rule.id)}
        aria-label="Remove rule"
      >
        <Icon name="Trash2" className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderGroup = (group: AdvancedFilterGroupModel, depth: number = 0) => (
    <div
      key={group.id}
      className={cn(
        "flex flex-col gap-3 rounded-md p-3 relative",
        depth > 0 ? "border border-input bg-muted/10 ml-4 mt-2" : "bg-transparent"
      )}
    >
      {/* Group Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 px-2 flex items-center justify-center bg-primary/10 text-primary font-semibold text-xs rounded-sm">
            {group.connector}
          </div>
          {depth > 0 && <span className="text-xs text-muted-foreground font-medium">Group</span>}
        </div>
        {depth > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
            onClick={() => onRemoveGroup?.(group.id)}
          >
            <Icon name="X" className="h-3 w-3 mr-1" />
            Remove Group
          </Button>
        )}
      </div>

      {/* Rules / Nested Groups */}
      <div className="flex flex-col gap-3 pl-2 border-l-2 border-border/50 ml-2">
        {group.rules.map((item) => {
          if ("rules" in item) {
            return renderGroup(item, depth + 1);
          }
          return renderRule(item);
        })}
      </div>

      {/* Group Actions */}
      <div className="flex items-center gap-2 pt-1 pl-4">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => onAddRule?.(group.id)}
        >
          <Icon name="Plus" className="h-3 w-3 mr-1.5" />
          Add Rule
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground"
          onClick={() => onAddGroup?.(group.id)}
        >
          <Icon name="FolderPlus" className="h-3 w-3 mr-1.5" />
          Add Group
        </Button>
      </div>
    </div>
  );

  return (
    <div className={cn("w-full flex flex-col space-y-4", className)}>
      {renderGroup(rootGroup, 0)}
    </div>
  );
}
