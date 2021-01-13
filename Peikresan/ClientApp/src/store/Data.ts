import axios from "axios";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import {
  IProduct,
  ICategory,
  IBanner,
  ISlider,
  IAddress,
  IUserFactor,
  ISellOptions,
  IDeliverTime,
} from "../shares/Interfaces";
import { DATA_URL } from "../shares/URLs";
import { SaveAddresses, SaveFactors } from "../shares/LocalStorage";
import { Status } from "../shares/Constants";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface IDataState {
  cachedData: boolean;
  status: Status;

  products: IProduct[];
  categories: ICategory[];
  suggestions: number[];
  newest: number[];
  mostSells: number[];
  sliders: ISlider[];
  banners: IBanner[];
  deliverTimes: IDeliverTime[];
  sellOptions?: ISellOptions;

  // TODO: save and load from local storage
  addresses: IAddress[];
  factors: IUserFactor[];
}

export enum DataActions {
  DATA_REQUEST = "DATA_REQUEST",
  DATA_SUCCESS = "DATA_SUCCESS ",
  DATA_FAILURE = "DATA_FAILURE ",

  // ADD_ADDRESS = "ADD_ADDRESS",
  // REMOVE_ADDRESS = "REMOVE_ADDRESS",
  ARCHIVED_FACTOR = "ARCHIVED_FACTOR",
}

export enum AddressActions {
  ADD_ADDRESS = "ADD_ADDRESS",
  REMOVE_ADDRESS = "REMOVE_ADDRESS",
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface IChangeShopCartItem {
  type: DataActions;
  payload?: { message?: string; data?: any; error?: any };
}

export interface IChangeAddress {
  type: AddressActions;
  payload: { address?: IAddress; id?: number };
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = IChangeShopCartItem | IChangeAddress;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  loadData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
    dispatch({ type: DataActions.DATA_REQUEST } as IChangeShopCartItem);
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

  addAddress: (address: IAddress) =>
    ({
      type: AddressActions.ADD_ADDRESS,
      payload: { address: address },
    } as IChangeAddress),

  removedAddress: (id: number) =>
    ({
      type: AddressActions.REMOVE_ADDRESS,
      payload: { id: id },
    } as IChangeAddress),

  archivedFactor: (id: number, shopCart: number, total: number) => ({
    type: DataActions.ARCHIVED_FACTOR,
    payload: { data: { id, shopCart, total } },
  }),
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
      status: Status.INIT,
      products: [],
      categories: [],
      suggestions: [],
      newest: [],
      mostSells: [],
      sliders: [],
      banners: [],
      addresses: [],
      factors: [],
      deliverTimes: [],
    };
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case DataActions.DATA_REQUEST:
      // TODO: Loading Data from cache
      return { ...state, status: Status.LOADING, cachedData: true };

    case DataActions.DATA_SUCCESS:
      // TODO: cache data
      const dataState = { ...state, status: Status.SUCCEEDED };
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
        if (data.deliverTimes) {
          dataState.deliverTimes = data.deliverTimes;
        }
        dataState.sellOptions = {
          deliverAtDoor: data.deliverAtDoor,
          deliverPrice: data.deliverPrice,
          minimumCart: data.minimumCart,
        };
        // dataState.sellOptions. =data.deliverAtDoor;
        dataState.cachedData = false;
      }
      return dataState;

    case DataActions.DATA_FAILURE:
      return { ...state, status: Status.FAILED };

    case AddressActions.ADD_ADDRESS:
      const address = action.payload?.address;
      if (address) {
        if (address.id && state.addresses.find((ad) => ad.id == address.id)) {
          const thisAddress = state.addresses.find(
            (ad) => ad.id == address.id
          ) as IAddress;
          const index = state.addresses.indexOf(thisAddress);
          const changedAddresses = state.addresses;
          changedAddresses[index] = address;
          SaveAddresses(changedAddresses);
          return { ...state, addresses: changedAddresses };
        } else {
          const newId =
            Math.max(...state.addresses.map((ad) => ad.id ?? 0)) + 1;
          const addedAddress = state.addresses;
          addedAddress.push({ ...address, id: newId });
          SaveAddresses(addedAddress);
          return { ...state, addresses: addedAddress };
        }
      }
      return state;

    case AddressActions.REMOVE_ADDRESS:
      const id = action.payload?.id;
      const removedAddress = state.addresses.filter((ad) => ad.id != id);
      SaveAddresses(removedAddress);
      return { ...state, addresses: removedAddress };

    case DataActions.ARCHIVED_FACTOR:
      const newFactors = [...state.factors, action.payload as IUserFactor];
      SaveFactors(newFactors);
      return state;

    default:
      return state;
  }
};
