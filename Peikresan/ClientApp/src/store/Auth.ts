import axios, { AxiosRequestConfig } from "axios";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { ACCESS_URL, AdminDataUrl, LOGIN_URL, OrderUrl } from "../shares/URLs";
import {
  IUser,
  IRole,
  IOrder,
  ISellerProduct,
  IProduct,
  ICategory,
  IBanner,
  ISubOrder,
  IAdminFactor,
  ISlider,
} from "../shares/Interfaces";
import { AddToken, GetToken, RemoveToken } from "../shares/LocalStorage";
import { AdminDataModel, Status } from "../shares/Constants";
import { AdminPath } from "../shares/URLs";
import { useHistory } from "react-router-dom";
import { message } from "antd";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface IAuthState {
  login: boolean;
  status: Status;
  message: string;

  id: string;
  username: string;
  role: string;
  token: string;

  // all of a data
  users: IUser[];
  roles: IRole[];
  orders: IOrder[];
  factors: IAdminFactor[];
  subOrders: ISubOrder[];
  sellerProducts: ISellerProduct[];
  products: IProduct[];
  categories: ICategory[];
  banners: IBanner[];
  sliders: ISlider[];
}

export enum AuthActions {
  LOGIN_REQUEST = "LOGIN_REQUEST",
  LOGIN_SUCCESS = "LOGIN_SUCCESS ",
  LOGIN_FAILURE = "LOGIN_FAILURE ",

  ACCESS_REQUEST = "ACCESS_REQUEST",
  ACCESS_SUCCESS = "ACCESS_SUCCESS ",
  ACCESS_FAILURE = "ACCESS_FAILURE ",

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

export enum OrderAction {
  ORDER_REQUEST = "ORDER_REQUEST",
  ORDER_SUCCESS = "ORDER_SUCCESS ",
  ORDER_FAILURE = "ORDER_FAILURE ",
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

export interface IOrderAction {
  type: OrderAction;
  payload?: {
    message?: string;
    data?: any;
    error?: any;
  };
}

export interface IResetStatus {
  type: typeof RESET_STATUS;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction =
  | IAuthActions
  | IAdminDataActions
  | IOrderAction
  | IResetStatus;

const requestConfig = (): AxiosRequestConfig => ({
  headers: {
    Authorization: "Bearer " + GetToken(),
    "content-type": "application/json",
  },
});

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  tryLogin:
    (username: string, password: string): AppThunkAction<KnownAction> =>
    (dispatch, getState) => {
      const status = getState().auth?.status;
      if (status === Status.LOADING) {
        dispatch({
          type: AuthActions.LOGIN_FAILURE,
          payload: { message: "we have another fetch " },
        });
        return false;
      }

      dispatch({ type: AuthActions.LOGIN_REQUEST });

      try {
        axios.post(LOGIN_URL, { username, password }).then((response) => {
          if (response && response.data && response.data.success) {
            dispatch({
              type: AuthActions.LOGIN_SUCCESS,
              payload: {
                message: "axios success get data",
                data: response.data,
              },
            });
          } else {
            dispatch({
              type: AuthActions.LOGIN_FAILURE,
              payload: { message: "axios not success", error: response },
            });
          }
        });
        return true;
      } catch (error) {
        dispatch({
          type: AuthActions.LOGIN_FAILURE,
          payload: { message: "axios catch error", error: error },
        });
        return false;
      }
    },

  tryAccess: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const status = getState().auth?.status;
    if (status === Status.LOADING) {
      dispatch({
        type: AuthActions.ACCESS_FAILURE,
        payload: { message: "we have another fetch " },
      });
      return false;
    }

    dispatch({ type: AuthActions.LOGIN_REQUEST });

    try {
      axios.post(ACCESS_URL, {}, requestConfig()).then((response) => {
        if (response && response.data && response.data.success) {
          dispatch({
            type: AuthActions.ACCESS_SUCCESS,
            payload: { message: "axios success get data", data: response.data },
          });
        } else {
          dispatch({
            type: AuthActions.ACCESS_FAILURE,
            payload: { message: "axios not success", error: response },
          });
        }
      });
      return true;
    } catch (error) {
      dispatch({
        type: AuthActions.ACCESS_FAILURE,
        payload: { message: "axios catch error", error: error },
      });
      return false;
    }
  },

  logout: () => ({ type: AuthActions.LOGOUT } as IAuthActions),

  addOrChangeElement:
    (
      url: AdminDataUrl,
      model: AdminDataModel,
      data: FormData,
      newPageUrl?: AdminPath
    ): AppThunkAction<KnownAction> =>
    async (dispatch, getState) => {
      const status = getState().auth?.status;
      if (status === Status.LOADING) {
        dispatch({
          type: AuthActions.LOGIN_FAILURE,
          payload: { message: "we have another fetch " },
        });
        return false;
      }

      dispatch({ type: AdminDataActions.ADD_CHANGE_REQUEST });

      try {
        axios.post(url, data, requestConfig()).then((response) => {
          if (response && response.data && response.data.success) {
            dispatch({
              type: AdminDataActions.ADD_CHANGE_SUCCESS,
              payload: {
                message: "axios success get data",
                data: response.data,
                model: model,
              },
            });
            message.success("با موفقیت ذخیره شد.");
            if (newPageUrl) {
              const history = useHistory();
              history.push(newPageUrl);
            }
            return true;
          } else {
            dispatch({
              type: AdminDataActions.ADD_CHANGE_FAILURE,
              payload: { message: "axios not success", error: response },
            });
            message.error("اشکال در ذخیره");
            return false;
          }
        });
      } catch (error) {
        dispatch({
          type: AdminDataActions.ADD_CHANGE_FAILURE,
          payload: { message: "axios catch error", error: error },
        });
        message.error("اشکال در ذخیره");
        return false;
      }
    },

  removeElement:
    (
      url: AdminDataUrl,
      model: AdminDataModel,
      id: number | string
    ): AppThunkAction<KnownAction> =>
    async (dispatch, getState) => {
      const status = getState().auth?.status;
      if (status === Status.LOADING) {
        dispatch({
          type: AuthActions.LOGIN_FAILURE,
          payload: { message: "we have another fetch " },
        });
        return false;
      }

      dispatch({ type: AdminDataActions.REMOVE_REQUEST });

      try {
        axios.post(url, { id }, requestConfig()).then((response) => {
          if (response && response.data && response.data.success) {
            dispatch({
              type: AdminDataActions.REMOVE_SUCCESS,
              payload: {
                message: "axios success get data",
                data: response.data,
                model: model,
              },
            });
            message.success("با موفقیت حذف شد.");
            return true;
          } else {
            dispatch({
              type: AdminDataActions.REMOVE_FAILURE,
              payload: { message: "axios not success", error: response },
            });
            message.error("اشکال در حذف");
            return false;
          }
        });
      } catch (error) {
        dispatch({
          type: AdminDataActions.REMOVE_FAILURE,
          payload: { message: "axios catch error", error: error },
        });
        message.error("اشکال در حذف");
        return false;
      }
    },

  resetStatus: () => ({ type: RESET_STATUS } as IResetStatus),

  packageTransaction:
    (url: OrderUrl, id: number): AppThunkAction<KnownAction> =>
    async (dispatch, getState) => {
      const status = getState().auth?.status;
      if (status === Status.LOADING) {
        dispatch({
          type: AuthActions.LOGIN_FAILURE,
          payload: { message: "we have another fetch " },
        });
        return false;
      }

      dispatch({ type: OrderAction.ORDER_REQUEST });

      try {
        axios.post(url, { id }, requestConfig()).then((response) => {
          if (response && response.data && response.data.success) {
            dispatch({
              type: OrderAction.ORDER_SUCCESS,
              payload: {
                message: "axios success get data",
                data: response.data,
              },
            });
            return true;
          } else {
            dispatch({
              type: OrderAction.ORDER_FAILURE,
              payload: { message: "axios not success", error: response },
            });
            return false;
          }
        });
      } catch (error) {
        dispatch({
          type: OrderAction.ORDER_FAILURE,
          payload: { message: "axios catch error", error: error },
        });
        return false;
      }
    },

  deliverPackage:
    (
      url: OrderUrl,
      orderId: number,
      deliverConfirmCode: number
    ): AppThunkAction<KnownAction> =>
    async (dispatch, getState) => {
      const status = getState().auth?.status;
      if (status === Status.LOADING) {
        dispatch({
          type: AuthActions.LOGIN_FAILURE,
          payload: { message: "we have another fetch " },
        });
        return false;
      }

      dispatch({ type: OrderAction.ORDER_REQUEST });

      try {
        axios
          .post(url, { orderId, deliverConfirmCode }, requestConfig())
          .then((response) => {
            if (response && response.data && response.data.success) {
              dispatch({
                type: OrderAction.ORDER_SUCCESS,
                payload: {
                  message: "axios success get data",
                  data: response.data,
                },
              });
              return true;
            } else {
              dispatch({
                type: OrderAction.ORDER_FAILURE,
                payload: { message: "axios not success", error: response },
              });
              message.warning("خطا در تايید کد!");
              return false;
            }
          });
      } catch (error) {
        dispatch({
          type: OrderAction.ORDER_FAILURE,
          payload: { message: "axios catch error", error: error },
        });
        return false;
      }
    },

  answerOrder:
    (
      url: OrderUrl,
      userId: string,
      orderId: number,
      answer: boolean
    ): AppThunkAction<KnownAction> =>
    async (dispatch, getState) => {
      const status = getState().auth?.status;
      if (status === Status.LOADING) {
        dispatch({
          type: AuthActions.LOGIN_FAILURE,
          payload: { message: "we have another fetch " },
        });
        return false;
      }

      dispatch({ type: OrderAction.ORDER_REQUEST });

      try {
        axios
          .post(url, { orderId, answer, userId }, requestConfig())
          .then((response) => {
            if (response && response.data && response.data.success) {
              dispatch({
                type: OrderAction.ORDER_SUCCESS,
                payload: {
                  message: "axios success get data",
                  data: response.data,
                },
              });
              return true;
            } else {
              dispatch({
                type: OrderAction.ORDER_FAILURE,
                payload: { message: "axios not success", error: response },
              });
              return false;
            }
          });
      } catch (error) {
        dispatch({
          type: OrderAction.ORDER_FAILURE,
          payload: { message: "axios catch error", error: error },
        });
        return false;
      }
    },

  uploadFile:
    (
      url: AdminDataUrl,
      formData: FormData,
      model: AdminDataModel
    ): AppThunkAction<KnownAction> =>
    async (dispatch, getState) => {
      const status = getState().auth?.status;
      if (status === Status.LOADING) {
        dispatch({
          type: AdminDataActions.ADD_CHANGE_FAILURE,
          payload: { message: "we have another fetch " },
        });
        message.warning("خطا در بارگزاری!");
        return false;
      }
      dispatch({ type: AdminDataActions.ADD_CHANGE_REQUEST });

      console.trace("auth.ts 472", url, formData, requestConfig());

      try {
        axios.post(url, formData, requestConfig()).then((response) => {
          if (response && response.data && response.data.success) {
            dispatch({
              type: AdminDataActions.ADD_CHANGE_SUCCESS,
              payload: {
                message: "axios success get data",
                data: response.data,
                model,
              },
            });
            message.success("با موفقیت بارگزاری شد.");
            return true;
          } else {
            dispatch({
              type: AdminDataActions.ADD_CHANGE_FAILURE,
              payload: { message: "axios not success", error: response },
            });
            message.warning("خطا در بارگزاری!");
            return false;
          }
        });
      } catch (error) {
        dispatch({
          type: AdminDataActions.ADD_CHANGE_FAILURE,
          payload: { message: "axios catch error", error: error },
        });
        message.warning("خطا در بارگزاری!");
        return false;
      }
    },
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
      message: "",

      id: "",
      username: "",
      role: "",
      token: "",

      status: Status.INIT,
      users: [],
      roles: [],
      orders: [],
      factors: [],
      subOrders: [],
      sellerProducts: [],
      products: [],
      categories: [],
      banners: [],
      sliders: [],
    };
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case AuthActions.LOGIN_REQUEST:
    case AuthActions.ACCESS_REQUEST:
      return { ...state, login: false, status: Status.LOADING };

    case AuthActions.LOGIN_SUCCESS:
    case AuthActions.ACCESS_SUCCESS:
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
        if (data.subOrders) {
          loginState.subOrders = data.subOrders;
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
        if (data.sliders) {
          loginState.sliders = data.sliders;
        }
        if (data.banners) {
          loginState.banners = data.banners;
        }
      }
      return loginState;

    case AuthActions.LOGIN_FAILURE:
    case AuthActions.ACCESS_FAILURE:
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

        if (modelName == AdminDataModel.SellerProducts) {
          const sellerProducts = action.payload.data
            .sellerProducts as ISellerProduct[];

          if (sellerProducts) {
            return {
              ...state,
              sellerProducts: sellerProducts,
              status: Status.SUCCEEDED,
            };
          }
          return { ...state, status: Status.FAILED };
        }

        if (modelName == AdminDataModel.Users) {
          const users = action.payload.data.users as IUser[];

          if (users) {
            return { ...state, users: users, status: Status.SUCCEEDED };
          }
          return { ...state, status: Status.FAILED };
        }

        if (modelName == AdminDataModel.Products) {
          const products = action.payload.data.products as IProduct[];

          if (products) {
            return { ...state, products: products, status: Status.SUCCEEDED };
          }
          return { ...state, status: Status.FAILED };
        }

        const stateModelData = state[modelName] as Array<any>;
        const element = action.payload.data.element;
        const filterData = stateModelData.filter(
          (m: any) => m.id === element.id
        );
        if (filterData) {
          return {
            ...state,
            [modelName]: [...filterData, element],
            status: Status.SUCCEEDED,
          };
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
        if (modelName == AdminDataModel.Users) {
          const newUsers = action.payload.data.users;
          return { ...state, users: newUsers, status: Status.SUCCEEDED };
        }
        const newData = action.payload.data[modelName];
        return { ...state, [modelName]: [...newData] };
      }
      // not success
      return { ...state, status: Status.FAILED };

    case AdminDataActions.REMOVE_FAILURE:
      return { ...state, status: Status.FAILED };

    case RESET_STATUS:
      return { ...state, status: Status.IDLE };

    case OrderAction.ORDER_REQUEST:
      return { ...state, status: Status.LOADING };

    case OrderAction.ORDER_SUCCESS:
      // ----
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.success
      ) {
        const data = action.payload.data;
        const newState = { ...state, status: Status.SUCCEEDED };
        if (data.orders) {
          newState.orders = data.orders;
        }
        if (data.subOrders) {
          newState.subOrders = data.subOrders;
        }
        return newState;
      }
      return { ...state, status: Status.FAILED };

    case OrderAction.ORDER_FAILURE:
      return { ...state, status: Status.FAILED };

    default:
      return state;
  }
};
