import axios from "axios";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { LOGIN_URL } from "../shares/URLs";
import {
  IUser,
  IRole,
  IOrder,
  ISellerProduct,
  IProduct,
  ICategory,
} from "../shares/Interfaces";
import { AddToken, RemoveToken } from "../shares/LocalStorage";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface IAuthState {
  login: boolean;
  loading: boolean;
  init: boolean;

  id?: string;
  username?: string;
  role?: string;
  token?: string;

  users?: IUser[];
  roles?: IRole[];
  orders?: IOrder[];
  sellerProducts?: ISellerProduct[];
  products?: IProduct[]; // all products
  categories?: ICategory[]; // all categories
}

export enum AuthActions {
  LOGIN_REQUEST = "LOGIN_REQUEST",
  LOGIN_SUCCESS = "LOGIN_SUCCESS ",
  LOGIN_FAILURE = "LOGIN_FAILURE ",

  //   ACCESS_REQUEST = "ACCESS_REQUEST",
  //   ACCESS_SUCCESS = "ACCESS_SUCCESS ",
  //   ACCESS_FAILURE = "ACCESS_FAILURE ",

  LOGOUT = "LOGOUT ",
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface IAuthActions {
  type: AuthActions;
  payload?: { message?: string; data?: any; error?: any };
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = IAuthActions;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  login: (
    username: string,
    password: string
  ): AppThunkAction<KnownAction> => async (dispatch, getState) => {
    dispatch({ type: AuthActions.LOGIN_REQUEST });

    const response = await axios
      .post(LOGIN_URL, { username, password })
      .catch((error) => {
        return { ...error, success: false };
      })
      .catch((error) => {
        dispatch({
          type: AuthActions.LOGIN_FAILURE,
          payload: { message: "axios catch error", error: error },
        });
      });

    if (response && response.data && response.data.success) {
      dispatch({
        type: AuthActions.LOGIN_SUCCESS,
        payload: { message: "axios success get data", data: response.data },
      });
    } else {
      dispatch({
        type: AuthActions.LOGIN_FAILURE,
        payload: { message: "axios not success", error: response },
      });
    }
  },
  logout: () => ({ type: AuthActions.LOGOUT } as IAuthActions),
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<IAuthState> = (
  state: IAuthState | undefined,
  incomingAction: Action
): IAuthState => {
  if (state === undefined) {
    return { login: false, loading: false, init: true };
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case AuthActions.LOGIN_REQUEST:
      return { login: false, loading: true, init: false };

    case AuthActions.LOGIN_SUCCESS:
      const loginState = {
        ...state,
        login: false,
        loading: false,
      };

      if (action.payload && action.payload.data) {
        const data = action.payload.data;
        AddToken(data.token);

        loginState.login = true;
        loginState.username = data.username;
        loginState.id = data.id;
        loginState.role = data.role;

        if (data.users) {
          loginState.users = data.users;
        }
        if (data.roles) {
          loginState.roles = data.roles;
        }
        if (data.orders) {
          loginState.orders = data.orders;
        }
        if (data.sellerProducts) {
          loginState.sellerProducts = data.sellerProducts;
        }
        if (data.products) {
          loginState.products = data.products;
        }
        if (data.categories) {
          loginState.categories = data.categories;
        }
      }
      return loginState;

    case AuthActions.LOGIN_FAILURE:
      return { login: false, loading: false, init: false };

    case AuthActions.LOGOUT:
      RemoveToken();
      return { login: false, loading: false, init: false };

    default:
      return state;
  }
};
