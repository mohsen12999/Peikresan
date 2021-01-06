import axios from "axios";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { IProduct, ICategory, IBanner, ISlider } from "../shares/Interfaces";
import { DATA_URL } from "../shares/URLs";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface IDataState {
  cachedData: boolean;
  loading: boolean;
  products: IProduct[];
  categories: ICategory[];
  suggestions: number[];
  newest: number[];
  mostSells: number[];
  sliders: ISlider[];
  banners: IBanner[];
}

export enum DataActions {
  DATA_REQUEST = "DATA_REQUEST",
  DATA_SUCCESS = "DATA_SUCCESS ",
  DATA_FAILURE = "DATA_FAILURE ",
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface IChangeShopCartItem {
  type: DataActions;
  payload?: { message?: string; data?: any; error?: any };
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = IChangeShopCartItem;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  loadData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
    dispatch({ type: DataActions.DATA_REQUEST });
    const response = await axios.get(DATA_URL).catch((error) => {
      dispatch({
        type: DataActions.DATA_FAILURE,
        payload: { message: "axios catch error", error: error },
      });
      if (response && response.data && response.data.success) {
        dispatch({
          type: DataActions.DATA_SUCCESS,
          payload: { message: "axios success get data", data: response.data },
        });
      } else {
        dispatch({
          type: DataActions.DATA_FAILURE,
          payload: { message: "axios not success", error: response },
        });
      }
    });
  },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<IDataState> = (
  state: IDataState | undefined,
  incomingAction: Action
): IDataState => {
  if (state === undefined) {
    return {
      cachedData: false,
      loading: false,
      products: [],
      categories: [],
      suggestions: [],
      newest: [],
      mostSells: [],
      sliders: [],
      banners: [],
    };
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case DataActions.DATA_REQUEST:
      // TODO: Loading Data from cache
      return { ...state, loading: true, cachedData: true };
    case DataActions.DATA_SUCCESS:
      // TODO: cache data
      const dataState = { ...state, loading: false };
      if (action.payload && action.payload.data) {
        const data = action.payload.data;
        if (data.products) {
          dataState.products = data.products;
        }
        if (data.categories) {
          dataState.categories = data.categories;
        }
        if (data.suggestions) {
          dataState.suggestions = data.suggestions;
        }
        if (data.newest) {
          dataState.newest = data.newest;
        }
        if (data.mostSells) {
          dataState.mostSells = data.mostSells;
        }
        if (data.sliders) {
          dataState.sliders = data.sliders;
        }
        if (data.banners) {
          dataState.banners = data.banners;
        }
        dataState.cachedData = false;
      }
      return dataState;
    case DataActions.DATA_FAILURE:
      return { ...state, loading: false };

    default:
      return state;
  }
};
