import { Action, Reducer } from "redux";
import { IAddress, IDeliverTime } from "../shares/Interfaces";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface IShopCartState {
  shopCart: number[];

  address?: IAddress;
  time?: IDeliverTime;
  deliverAtDoor?: boolean;
}

export enum ShopCartActions {
  ADD_PRODUCT = "ADD_PRODUCT",
  REMOVE_PRODUCT = "REMOVE_PRODUCT",
  DELETE_PRODUCT = "DELETE_PRODUCT",
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface IChangeShopCartItem {
  type: ShopCartActions;
  payload: { productId: number; count?: number };
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = IChangeShopCartItem;

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
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<IShopCartState> = (
  state: IShopCartState | undefined,
  incomingAction: Action
): IShopCartState => {
  if (state === undefined) {
    return { shopCart: [] };
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
      return { ...state, shopCart: removedShopCart };

    case ShopCartActions.DELETE_PRODUCT:
      const deletedShopCart = [...state.shopCart];
      if (deletedShopCart[action.payload.productId]) {
        deletedShopCart[action.payload.productId] = 0;
      }
      return { ...state, shopCart: deletedShopCart };

    default:
      return state;
  }
};
