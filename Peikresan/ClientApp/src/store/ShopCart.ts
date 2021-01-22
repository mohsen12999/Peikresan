import axios from "axios";
import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
import { Status } from "../shares/Constants";
import { IAddress, IBankData, IDeliverTime } from "../shares/Interfaces";
import { CacheShopCart, GetShopCartCache } from "../shares/LocalStorage";
import { Cart_URL } from "../shares/URLs";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface IShopCartState {
  shopCart: number[];

  latitude?: number;
  longitude?: number;

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

export const ADD_LOCATION_ON_MAP = "ADD_LOCATION_ON_MAP";

export enum GetLocationToAddressAction {
  GET_ADDRESS_FROM_LOCATION_REQUEST = "GET_ADDRESS_FROM_LOCATION_REQUEST",
  GET_ADDRESS_FROM_LOCATION_SUCCESS = "GET_ADDRESS_FROM_LOCATION_SUCCESS ",
  GET_ADDRESS_FROM_LOCATION_FAILURE = "GET_ADDRESS_FROM_LOCATION_FAILURE ",
}

export const ADD_ADDRESS = "ADD_ADDRESS";

export const ADD_TIME = "ADD_TIME";

export const DELIVER_AT_DOOR = "DELIVER_AT_DOOR";

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
  payload: { productId: number; max: number; count?: number };
}
export interface IAddLocationOnMap {
  type: typeof ADD_LOCATION_ON_MAP;
  payload: { lang: number; lat: number };
}

export interface IGetLocationFromAddress {
  type: GetLocationToAddressAction;
  payload?: { message?: string; data?: any; error?: any };
}

export interface IShopCartAddress {
  type: typeof ADD_ADDRESS;
  payload: { address: IAddress };
}

export interface IShopCartTime {
  type: typeof ADD_TIME;
  payload: { deliverTime: IDeliverTime };
}

export interface IShopCartFeature {
  type: typeof DELIVER_AT_DOOR;
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
  | IAddLocationOnMap
  | IGetLocationFromAddress
  | IShopCartAddress
  | IShopCartTime
  | IShopCartFeature
  | IBank;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  addProduct: (productId: number, max: number, count: number = 1) =>
    ({
      type: ShopCartActions.ADD_PRODUCT,
      payload: { productId, max, count },
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
      type: ADD_ADDRESS,
      payload: { address: address },
    } as IShopCartAddress),

  setShopCartTime: (deliverTime: IDeliverTime) =>
    ({
      type: ADD_TIME,
      payload: { deliverTime: deliverTime },
    } as IShopCartTime),

  setDeliverAtDoor: (value: boolean) =>
    ({
      type: DELIVER_AT_DOOR,
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

  chooseLocationOnMap: (lat: number, lang: number) => ({
    type: ADD_LOCATION_ON_MAP,
    payload: { lat, lang },
  }),

  getAddressFromLocation: (): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    dispatch({
      type: GetLocationToAddressAction.GET_ADDRESS_FROM_LOCATION_REQUEST,
    });

    const latitude = getState().shopCart?.latitude;
    const longitude = getState().shopCart?.longitude;

    if (!latitude || !longitude) {
      dispatch({
        type: GetLocationToAddressAction.GET_ADDRESS_FROM_LOCATION_FAILURE,
        payload: {
          message: "latitude or longitude problem",
          error: { latitude, longitude },
        },
      });
      return false;
    }

    try {
      axios
        .get(
          "https://api.neshan.org/v2/reverse?lat=" +
            latitude +
            "&lng=" +
            longitude,
          {
            headers: {
              "Api-Key": "web.KJN3LZa0jk1B2bGAInWR8snqjPfHMr1JoJTADpxc",
            },
          }
        )
        .then((response) => {
          if (response.data && response.data.status == "OK") {
            dispatch({
              type:
                GetLocationToAddressAction.GET_ADDRESS_FROM_LOCATION_FAILURE,
              payload: {
                message: "get data successfully",
                data: response.data,
              },
            });
            return true;
          } else {
            dispatch({
              type:
                GetLocationToAddressAction.GET_ADDRESS_FROM_LOCATION_FAILURE,
              payload: { message: "status not ok", error: response },
            });
            return false;
          }
        });
    } catch (error) {
      dispatch({
        type: GetLocationToAddressAction.GET_ADDRESS_FROM_LOCATION_FAILURE,
        payload: { message: "axios catch error", error: error },
      });
      return false;
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
    const cachedShopCart = GetShopCartCache();
    if (cachedShopCart) {
      return cachedShopCart;
    }

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
      const max = action.payload.max ? action.payload.max : 0;
      const count = action.payload.count ? action.payload.count : 0;

      if (addedShopCart[action.payload.productId]) {
        addedShopCart[action.payload.productId] += count;
      } else {
        addedShopCart[action.payload.productId] = count;
      }
      if (addedShopCart[action.payload.productId] > max) {
        addedShopCart[action.payload.productId] = max;
      }
      const addedShopCartState = { ...state, shopCart: addedShopCart };
      CacheShopCart(addedShopCartState);
      return addedShopCartState;

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
      const removedShopCartState = { ...state, shopCart: removedShopCart };
      CacheShopCart(removedShopCartState);
      return removedShopCartState;

    case ShopCartActions.DELETE_PRODUCT:
      const deletedShopCart = [...state.shopCart];
      if (deletedShopCart[action.payload.productId]) {
        deletedShopCart[action.payload.productId] = 0;
      }
      const deletedShopCartState = { ...state, shopCart: deletedShopCart };
      CacheShopCart(deletedShopCartState);
      return deletedShopCartState;

    case ShopCartActions.RESET_SHOP_CART:
      const resetShopCartState = { ...state, shopCart: [] };
      CacheShopCart(resetShopCartState);
      return resetShopCartState;

    case ADD_LOCATION_ON_MAP:
      const lang = action.payload.lang;
      const lat = action.payload.lat;
      const addLocationState = { ...state, latitude: lat, longitude: lang };
      CacheShopCart(addLocationState);
      return addLocationState;

    case ADD_ADDRESS:
      const addedAddressState = { ...state, address: action.payload.address };
      CacheShopCart(addedAddressState);
      return addedAddressState;

    case ADD_TIME:
      const addedTimeState = {
        ...state,
        deliverTime: action.payload.deliverTime,
      };
      CacheShopCart(addedTimeState);
      return addedTimeState;

    case DELIVER_AT_DOOR:
      const deliverAtDoorState = {
        ...state,
        deliverAtDoor: action.payload.value,
      };
      CacheShopCart(deliverAtDoorState);
      return deliverAtDoorState;

    case BankActions.SEND_REQUEST:
      return { ...state, status: Status.LOADING };

    case BankActions.REQUEST_FAILURE:
      return {
        ...state,
        status: Status.FAILED,
        bankData: { success: false, terminalId: "", token: "", url: "" },
      };

    case BankActions.REQUEST_SUCCESS:
      const bankReceivedData = action.payload?.data;
      if (bankReceivedData) {
        return {
          ...state,
          status: Status.SUCCEEDED,
          bankData: {
            success: bankReceivedData.success,
            terminalId: bankReceivedData.terminalId,
            token: bankReceivedData.token,
            url: bankReceivedData.url,
          },
        };
      }
      return {
        ...state,
        status: Status.FAILED,
        bankData: { success: false, terminalId: "", token: "", url: "" },
      };

    case GetLocationToAddressAction.GET_ADDRESS_FROM_LOCATION_REQUEST:
      return { ...state, status: Status.LOADING };

    case GetLocationToAddressAction.GET_ADDRESS_FROM_LOCATION_SUCCESS:
      const currentAddress = { ...state.address };
      const addressData = action.payload?.data;
      if (addressData) {
        currentAddress.state = addressData.state;
        currentAddress.state = addressData.state;
        currentAddress.description = addressData.formatted_address;
      }
      return state;

    case GetLocationToAddressAction.GET_ADDRESS_FROM_LOCATION_FAILURE:
      return { ...state, status: Status.FAILED };

    default:
      return state;
  }
};
