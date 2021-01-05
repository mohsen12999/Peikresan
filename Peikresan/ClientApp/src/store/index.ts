// import * as WeatherForecasts from './WeatherForecasts';
// import * as Counter from './Counter';
import * as ShopCart from "./ShopCart";
import * as Auth from "./Auth";
import * as Data from "./Data";

// The top-level state object
export interface ApplicationState {
  shopCart: ShopCart.IShopCartState | undefined;
  auth: Auth.IAuthState | undefined;
  data: Data.IDataState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
  shopCart: ShopCart.reducer,
  auth: Auth.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
