// types.ts hoặc định nghĩa trong cùng file
export interface FilterProductState {
  limit: number;
  q?: string;
  order?: string;
  sortBy?: string;
  skip?: number;
}

export type FilterProductAction =
  | { type: typeof TYPE_ACTION.CHANGE_SORT; payload: { order: string; sortBy: string } }
  | { type: typeof TYPE_ACTION.CHANGE_PAGE; payload: number }
  | { type: typeof TYPE_ACTION.CHANGE_QUERY; payload: string }
  | { type: typeof TYPE_ACTION.CHANGE_REMOVE_QUERY }
  | { type: typeof TYPE_ACTION.CHANGE_INITIAL; payload: Partial<FilterProductState> }
  | { type: typeof TYPE_ACTION.CHANGE_RESET; payload: number };

export const initialState: FilterProductState = {
  limit: 12,
  q: "",
  order: "",
  sortBy: "",
  skip: 0,
};

export const TYPE_ACTION = {
  CHANGE_SORT: "CHANGE_SORT",
  CHANGE_PAGE: "CHANGE_PAGE",
  CHANGE_QUERY: "CHANGE_QUERY",
  CHANGE_REMOVE_QUERY: "CHANGE_REMOVE_QUERY",
  CHANGE_INITIAL: "CHANGE_INITIAL",
  CHANGE_RESET: "CHANGE_RESET",
} as const;

export const filterProductReducer = (
  state: FilterProductState,
  action: FilterProductAction
): FilterProductState => {
  switch (action.type) {
    case TYPE_ACTION.CHANGE_SORT: {
      const { order, sortBy } = action.payload;
      return {
        ...state,
        order,
        sortBy,
      };
    }
    case TYPE_ACTION.CHANGE_PAGE:
      return {
        ...state,
        skip: action.payload,
      };
    case TYPE_ACTION.CHANGE_QUERY:
      return {
        ...state,
        q: action.payload,
      };
    case TYPE_ACTION.CHANGE_INITIAL:
      return {
        ...state,
        ...action.payload,
      };
    case TYPE_ACTION.CHANGE_RESET:
      return {
        limit: 12,
        q: "",
        order: "",
        sortBy: "",
        skip: 0,
      };
    default:
      return state;
  }
};
