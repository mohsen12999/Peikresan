import axios from "axios";
import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
import { Status } from "../shares/Constants";
import { IAddress, IBankData, IDeliverTime } from "../shares/Interfaces";
import { Cart_URL } from "../shares/URLs";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface IShopCartState {
  shopCart: number[];

  address?: IAddress;
  deliverTime?: IDeliverTime;
  deliverAtDoor: boolean;

  status: Status;
  bankData?: IBankData;
}

export enum ShopCartActions {
  ADD_PRODUCT = "ADD_PRODUCT",
  REMOVE_PRODUCT = "REMOVE_PRODUCT",
  DELETE_PRODUCT = "DELETE_PRODUCT",

  RESET_SHOP_CART = "RESET_SHOP_CART",
}

export enum ShopCartAddressActions {
  ADD_ADDRESS = "ADD_ADDRESS",
}

export enum ShopCartTimeActions {
  ADD_TIME = "ADD_TIME",
}

export enum ShopCartFeatureActions {
  DELIVER_AT_DOOR = "DELIVER_AT_DOOR",
}

export enum BankActions {
  SEND_REQUEST = "SEND_REQUEST",
  REQUEST_SUCCESS = "REQUEST_SUCCESS ",
  REQUEST_FAILURE = "REQUEST_FAILURE ",
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface IChangeShopCartItem {
  type: ShopCartActions;
  payload: { productId: number; count?: number };
}

export interface IShopCartAddress {
  type: ShopCartAddressActions;
  payload: { address: IAddress };
}

export interface IShopCartTime {
  type: ShopCartTimeActions;
  payload: { deliverTime: IDeliverTime };
}

export interface IShopCartFeature {
  type: ShopCartFeatureActions;
  payload: { value: boolean };
}

export interface IBank {
  type: BankActions;
  payload?: { error?: any; data?: any; message?: string };
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction =
  | IChangeShopCartItem
  | IShopCartAddress
  | IShopCartTime
  | IShopCartFeature
  | IBank;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  addProduct: (productId: number, count = 1) =>
    ({
      type: ShopCartActions.ADD_PRODUCT,
      payload: { productId, count },
    } as IChangeShopCartItem),
  removeProduct: (productId: number, count = 1) =>
    ({
      type: ShopCartActions.REMOVE_PRODUCT,
      payload: { productId, count },
    } as IChangeShopCartItem),
  deleteProduct: (productId: number) =>
    ({
      type: ShopCartActions.DELETE_PRODUCT,
      payload: { productId },
    } as IChangeShopCartItem),

  resetShopCart: () =>
    ({ type: ShopCartActions.RESET_SHOP_CART } as IChangeShopCartItem),

  setShopCartAddress: (address: IAddress) =>
    ({
      type: ShopCartAddressActions.ADD_ADDRESS,
      payload: { address: address },
    } as IShopCartAddress),

  setShopCartTime: (deliverTime: IDeliverTime) =>
    ({
      type: ShopCartTimeActions.ADD_TIME,
      payload: { deliverTime: deliverTime },
    } as IShopCartTime),

  setDeliverAtDoor: (value: boolean) =>
    ({
      type: ShopCartFeatureActions.DELIVER_AT_DOOR,
      payload: { value: value },
    } as IShopCartFeature),

  sendCart: (
    shopCart: number[],
    address: IAddress,
    deliverTime: IDeliverTime,
    deliverAtDoor: boolean
  ): AppThunkAction<KnownAction> => async (dispatch, getState) => {
    dispatch({ type: BankActions.SEND_REQUEST });
    const response = await axios
      .post(Cart_URL, { shopCart, address, deliverTime, deliverAtDoor })
      .catch((error) => {
        dispatch({
          type: BankActions.REQUEST_FAILURE,
          payload: { message: "axios catch error", error: error },
        });
      });

    if (response && response.data && response.data.success) {
      dispatch({
        type: BankActions.REQUEST_SUCCESS,
        payload: { message: "axios success get data", data: response.data },
      });
    } else {
      dispatch({
        type: BankActions.REQUEST_FAILURE,
        payload: { message: "axios not success", error: response },
      });
    }
  },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<IShopCartState> = (
  state: IShopCartState | undefined,
  incomingAction: Action
): IShopCartState => {
  if (state === undefined) {
    return {
      shopCart: [],
      deliverAtDoor: false,
      status: Status.INIT,
    };
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case ShopCartActions.ADD_PRODUCT:
      const addedShopCart = [...state.shopCart];
      const count = action.payload.count ? action.payload.count : 0;

      if (addedShopCart[action.payload.productId]) {
        addedShopCart[action.payload.productId] += count;
      } else {
        addedShopCart[action.payload.productId] = count;
      }
      // TODO: update local storage shop cart
      return { ...state, shopCart: addedShopCart };

    case ShopCartActions.REMOVE_PRODUCT:
      const removedShopCart = [...state.shopCart];
      if (removedShopCart[action.payload.productId]) {
        removedShopCart[action.payload.productId] -= action.payload.count
          ? action.payload.count
          : 0;
        if (removedShopCart[action.payload.productId] < 0) {
          removedShopCart[action.payload.productId] = 0;
        }
      }
      // TODO: update local storage shop cart
      return { ...state, shopCart: removedShopCart };

    case ShopCartActions.DELETE_PRODUCT:
      const deletedShopCart = [...state.shopCart];
      if (deletedShopCart[action.payload.productId]) {
        deletedShopCart[action.payload.productId] = 0;
      }
      // TODO: update local storage shop cart
      return { ...state, shopCart: deletedShopCart };

    case ShopCartActions.RESET_SHOP_CART:
      // TODO: remove shop cart in local storage
      return { ...state, shopCart: [] };

    case ShopCartAddressActions.ADD_ADDRESS:
      // TODO: add deliver address to local storage
      return { ...state, address: action.payload.address };

    case ShopCartTimeActions.ADD_TIME:
      // TODO: add deliver address to local storage
      return { ...state, deliverTime: action.payload.deliverTime };

    case ShopCartFeatureActions.DELIVER_AT_DOOR:
      // TODO: add deliver address to local storage
      return { ...state, deliverAtDoor: action.payload.value };

    case BankActions.SEND_REQUEST:
      return { ...state, status: Status.LOADING };

    case BankActions.REQUEST_FAILURE:
      return {
        ...state,
        status: Status.FAILED,
        bankData: { success: false, terminalId: "", token: "", url: "" },
      };

    case BankActions.REQUEST_SUCCESS:
      var data = action.payload ? action.payload.data : undefined;
      if (data) {
        return {
          ...state,
          status: Status.SUCCEEDED,
          bankData: {
            success: data.success,
            terminalId: data.terminalId,
            token: data.token,
            url: data.url,
          },
        };
      }
      return {
        ...state,
        status: Status.FAILED,
        bankData: { success: false, terminalId: "", token: "", url: "" },
      };

    default:
      return state;
  }
};
