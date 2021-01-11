import { IAddress } from "./Interfaces";

export enum UserRoles {
  ADMIN = "ADMIN",
  SELLER = "SELLER",
  DELIVERY = "DELIVERY",
  USER = "USER",
}

export enum HomePath {
  Category = "/category/",
  Suggestions = "#",
  MostSells = "#",
  Newest = "#",
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
