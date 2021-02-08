import { IAddress } from "./Interfaces";

export enum UserRole {
  ADMIN = "ADMIN",
  SELLER = "SELLER",
  DELIVERY = "DELIVERY",
  USER = "USER",
}

export const DefaultAddress: IAddress = {
  name: "",
  state: "مازندران",
  city: "رامسر",
  description: "",
  formattedAddress: "",
  // level: "",
  // unit: "",
  // number: "",
  mobile: "",
  // postalCode: "",
};

export enum DeliverDay {
  TODAY = "TODAY",
  TOMORROW = "TOMORROW",
  EXPRESS = "EXPRESS",
}

export enum Status {
  INIT = "INIT",
  IDLE = "IDLE",
  LOADING = "LOADING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
}

export enum OrderStatus {
  Init = 1,
  Verified = 10,

  // Choose Market
  AssignToSeller = 20,
  SellerDeny = 23,
  SellerAccepted = 27,

  // Choose Deliver
  AssignToDeliver = 30,
  DeliverDeny = 33,
  DeliverAccepted = 37,

  // Deliver Action
  DeliveryGetProduct = 40,
  DeliveredProduct = 45,

  // Customer
  CustomerDelivered = 50,
  CustomerVote = 55,
}

export enum RequestStatus {
  Pending = 0,
  Accept = 10,
  Deny = 20,
  DenyByAdmin = 40,
}

export enum AdminDataModel {
  Users = "users",
  Roles = "roles",
  Orders = "orders",
  SellerProducts = "sellerProducts",
  Products = "products",
  Categories = "categories",
  Banners = "banners",
  Sliders = "sliders",
}
