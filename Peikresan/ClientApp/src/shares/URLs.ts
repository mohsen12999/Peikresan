export const LOGIN_URL = "api/auth";

export const DATA_URL = "/api/public";
export const ACCESS_URL = "/api/auth/access";

export const Cart_URL = "/api/bank/save-cart";

export enum AdminDataUrl {
  ADD_CHANGE_CATEGORY_URL = "api/category",
  REMOVE_CATEGORY_URL = "api/category/remove-category",

  ADD_CHANGE_PRODUCT_URL = "api/product",
  REMOVE_PRODUCT_URL = "api/product/remove-product",

  ADD_CHANGE_BANNER_URL = "api/banner",
  REMOVE_BANNER_URL = "api/banner/remove-banner",

  ADD_CHANGE_SLIDER_URL = "api/slider",
  REMOVE_SLIDER_URL = "api/slider/remove-slider",

  ADD_CHANGE_USER_URL = "api/user",
  REMOVE_USER_URL = "api/user/remove-user",

  ADD_CHANGE_SELLER_PRODUCT_URL = "api/sellerproduct",
  REMOVE_SELLER_PRODUCT_URL = "api/sellerproduct/remove-seller-product",
}

export enum OrderUrl {
  CHOOSE_SELLER = "/api/order/choose-seller",
  SELLER_ANSWER = "/api/order/seller-answer",

  CHOOSE_DELIVER = "/api/order/choose-deliver",
  DELIVER_ANSWER = "/api/order/deliver-answer",

  GET_PRODUCT = "/api/order/get-product",
  DELIVER_PRODUCT = "/api/order/deliver-product",
}

export enum AdminDataModel {
  Users = "users",
  Roles = "roles",
  Orders = "orders",
  SellerProducts = "sellerProducts",
  Products = "products",
  Categories = "categories",
  Banners = "banners",
}
