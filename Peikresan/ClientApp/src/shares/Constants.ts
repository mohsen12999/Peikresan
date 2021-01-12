import { IAddress } from "./Interfaces";

export enum UserRoles {
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
  Products = "/admin/products",
  AwesomeProducts = "/admin/awesome_products",
  Sliders = "/admin/sliders",
  Banners = "/admin/banners",
  Users = "/admin/users",
  ActiveOrders = "/admin/active-orders",
  SellerProducts = "/admin/seller-products",
  SellerOrders = "/admin/seller-orders",
  DeliverOrders = "/admin/deliver-orders",
  Factors = "/admin/factors",
  // Logout = "/admin/logout",
}

export enum CartPath {
  Cart = "/cart",
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
