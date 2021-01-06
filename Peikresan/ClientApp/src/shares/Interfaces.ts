export interface IMoreBtn {
  show: boolean;
  title: string;
  link: string;
}

export interface ICategory {
  id: number;
  title: string;
  img: string;
}

export interface IProduct {
  id: number;
  title: string;
  img: string;
  price: number;
  max: number;
  soldByWeight: boolean;
  minWeight: number;
  // count?: number;
}

export interface IUser {
  id: number;
}

export interface IRole {
  id: number;
}

export interface IOrder {
  id: number;
}

export interface ISellerProduct {
  id: number;
}

export interface IAddress {
  state: string;
  city: string;
  district: string;
  mobile: string;
  name: string;
  description: string;
  level: string;
  unit: string;
  number: string;
  postalCode: string;
}

export interface IBadge {
  id: number;
  text: string;
  url: string;
}

export interface IShopCartProduct extends IProduct {
  count: number;
}
