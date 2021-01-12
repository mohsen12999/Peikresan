import axios from "axios";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { AdminDataModel, AdminDataUrl, LOGIN_URL } from "../shares/URLs";
import {
  IUser,
  IRole,
  IOrder,
  ISellerProduct,
  IProduct,
  ICategory,
  IBanner,
} from "../shares/Interfaces";
import { AddToken, RemoveToken } from "../shares/LocalStorage";
import { Status } from "../shares/Constants";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface IAuthState {
  login: boolean;
  status: Status;

  id?: string;
  username?: string;
  role?: string;
  token?: string;

  // all of a data
  users: IUser[];
  roles: IRole[];
  orders: IOrder[];
  sellerProducts: ISellerProduct[];
  products: IProduct[];
  categories: ICategory[];
  banners: IBanner[];
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

export enum AdminDataActions {
  ADD_CHANGE_REQUEST = "ADD_CHANGE_REQUEST",
  ADD_CHANGE_SUCCESS = "ADD_CHANGE_SUCCESS ",
  ADD_CHANGE_FAILURE = "ADD_CHANGE_FAILURE ",

  REMOVE_REQUEST = "REMOVE_REQUEST",
  REMOVE_SUCCESS = "REMOVE_SUCCESS ",
  REMOVE_FAILURE = "REMOVE_FAILURE ",
}

export const RESET_STATUS = "RESET_STATUS";

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface IAuthActions {
  type: AuthActions;
  payload?: { message?: string; data?: any; error?: any };
}

export interface IAdminDataActions {
  type: AdminDataActions;
  payload?: {
    message?: string;
    model?: AdminDataModel;
    data?: any;
    error?: any;
  };
}

export interface IResetStatus {
  type: typeof RESET_STATUS;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = IAuthActions | IAdminDataActions | IResetStatus;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  tryLogin: (
    username: string,
    password: string
  ): AppThunkAction<KnownAction> => async (dispatch, getState) => {
    dispatch({ type: AuthActions.LOGIN_REQUEST });

    const response = await axios
      .post(LOGIN_URL, { username, password })
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

  addOrChangeElement: (
    url: AdminDataUrl,
    model: AdminDataModel,
    data: FormData
  ): AppThunkAction<KnownAction> => async (dispatch, getState) => {
    dispatch({ type: AdminDataActions.ADD_CHANGE_REQUEST });

    const response = await axios.post(url, data).catch((error) => {
      dispatch({
        type: AdminDataActions.ADD_CHANGE_FAILURE,
        payload: { message: "axios catch error", error: error },
      });
    });

    if (response && response.data && response.data.success) {
      dispatch({
        type: AdminDataActions.ADD_CHANGE_SUCCESS,
        payload: {
          message: "axios success get data",
          data: response.data,
          model: model,
        },
      });
    } else {
      dispatch({
        type: AdminDataActions.ADD_CHANGE_FAILURE,
        payload: { message: "axios not success", error: response },
      });
    }
  },

  removeElement: (
    url: AdminDataUrl,
    model: AdminDataModel,
    id: number | string
  ): AppThunkAction<KnownAction> => async (dispatch, getState) => {
    dispatch({ type: AdminDataActions.REMOVE_REQUEST });

    const response = await axios.post(url, id).catch((error) => {
      dispatch({
        type: AdminDataActions.REMOVE_FAILURE,
        payload: { message: "axios catch error", error: error },
      });
    });

    if (response && response.data && response.data.success) {
      dispatch({
        type: AdminDataActions.REMOVE_SUCCESS,
        payload: {
          message: "axios success get data",
          data: response.data,
          model: model,
        },
      });
    } else {
      dispatch({
        type: AdminDataActions.REMOVE_FAILURE,
        payload: { message: "axios not success", error: response },
      });
    }
  },

  resetStatus: () => ({ type: RESET_STATUS } as IResetStatus),
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<IAuthState> = (
  state: IAuthState | undefined,
  incomingAction: Action
): IAuthState => {
  if (state === undefined) {
    return {
      login: false,
      status: Status.INIT,
      users: [],
      roles: [],
      orders: [],
      sellerProducts: [],
      products: [],
      categories: [],
      banners: [],
    };
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case AuthActions.LOGIN_REQUEST:
      return { ...state, login: false, status: Status.LOADING };

    case AuthActions.LOGIN_SUCCESS:
      const loginState = {
        ...state,
        login: false,
        status: Status.FAILED,
      };

      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.success
      ) {
        const data = action.payload.data;

        AddToken(data.token);

        loginState.status = Status.SUCCEEDED;
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
      return { ...state, login: false, status: Status.FAILED };

    case AuthActions.LOGOUT:
      RemoveToken();
      return { ...state, login: false, status: Status.IDLE };

    case AdminDataActions.ADD_CHANGE_REQUEST:
      return { ...state, status: Status.LOADING };

    case AdminDataActions.ADD_CHANGE_SUCCESS:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.success
      ) {
        const modelName = action.payload.model as AdminDataModel;
        const stateModelData = state[modelName];
        const element = action.payload.data.element;
        const filterData = stateModelData?.filter((m) => m.id == element.id);
        if (filterData) {
          return { ...state, [modelName]: [...filterData, element] };
        }
      }
      // not success
      return { ...state, status: Status.FAILED };

    case AdminDataActions.ADD_CHANGE_FAILURE:
      return { ...state, status: Status.FAILED };

    case AdminDataActions.REMOVE_REQUEST:
      return { ...state, status: Status.LOADING };

    case AdminDataActions.REMOVE_SUCCESS:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.success
      ) {
        const modelName = action.payload.model as AdminDataModel;
        const newData = action.payload.data[modelName];
        return { ...state, [modelName]: [...newData] };
      }
      // not success
      return { ...state, status: Status.FAILED };

    case AdminDataActions.REMOVE_FAILURE:
      return { ...state, status: Status.FAILED };

    case RESET_STATUS:
      return { ...state, status: Status.IDLE };

    default:
      return state;
  }
};
