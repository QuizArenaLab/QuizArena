export interface NavigationItemPresentation {
  id: string;
  index: number;
  bookmarked: boolean;
  flagged: boolean;
  answered: boolean;
  current: boolean;
  visited: boolean;
  disabled: boolean;
  readonly: boolean;
  focused: boolean;
  hovered: boolean;
}
