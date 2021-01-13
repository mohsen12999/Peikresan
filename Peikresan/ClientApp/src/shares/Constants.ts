import { IAddress } from "./Interfaces";

export enum UserRole {
  ADMIN = "ADMIN",
  SELLER = "SELLER",
  DELIVERY = "DELIVERY",
  USER = "USER",
}

export enum HomePath {
  Home = "/",
  Categories = "/categories",
  Addresses = "/addresses",
  Factors = "/factors",
  FAQ = "/faq",
  About = "/about",
  Coin = "/coin",
  Profile = "/profile",

  Category = "/category/",
  Suggestions = "#",
  MostSells = "#",
  Newest = "#",
}

export enum AdminPath {
  Admin = "/admin",
  Login = "/admin",
  Dashboard = "/admin/dashboard",

  Categories = "/admin/categories",
  Category = "/admin/category/",

  Products = "/admin/products",
  Product = "/admin/product/",

  AwesomeProducts = "/admin/awesome_products",

  Sliders = "/admin/sliders",
  Slider = "/admin/slider/",

  Banners = "/admin/banners",
  Banner = "/admin/banner",

  Users = "/admin/users",
  User = "/admin/user",

  Orders = "/admin/orders",
  SellerProducts = "/admin/seller-products",
  SellerOrders = "/admin/seller-orders",
  DeliverOrders = "/admin/deliver-orders",
  Factors = "/admin/factors",
  // Logout = "/admin/logout",
}

export enum CartPath {
  Cart = "/cart",
  DeliverAddress = "/deliver-address",
  DeliverTime = "/deliver-time",
  Factor = "/factor",
}

export const DefaultAddress: IAddress = {
  name: "",
  state: "مازندران",
  city: "رامسر",
  description: "",
  level: "",
  unit: "",
  number: "",
  mobile: "",
  postalCode: "",
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
