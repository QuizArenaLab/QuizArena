import { FilterChipModel } from "./SearchTypes";

export type SearchEvent =
  | { type: "SearchFocused" }
  | { type: "SearchBlurred" }
  | { type: "SearchCleared" }
  | { type: "FilterAdded"; payload: FilterChipModel }
  | { type: "FilterRemoved"; payload: string }
  | { type: "FilterPanelOpened" }
  | { type: "FilterPanelClosed" }
  | { type: "SavedFilterSelected"; payload: string };
