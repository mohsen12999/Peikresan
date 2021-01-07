export interface IMoreBtn {
  show: boolean;
  title: string;
  link: string;
}

export interface ICategory {
  id: number;
  title: string;
  img: string;
  parentId: number;
}

export interface IProduct {
  id: number;
  title: string;
  description: string;
  img: string;
  price: number;
  max: number;
  soldByWeight: boolean;
  minWeight: number;

  categoryId: number;
  // count?: number;
}

export interface IShopCartProduct extends IProduct {
  count: number;
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
  id?: number;
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

export interface IDeliverTime {
  day: string;
  time: string;
  express: boolean;
}

export interface IBadge {
  id: number;
  text: string;
  url: string;
}

export interface ISlider {
  id: number;
  img: string;
}
export interface IBanner {
  id: number;
  img: string;
  title: string;
  url: string;
  bannerType: number;
}

export interface IFactor {
  id: number;
  shopCart: number[];
  total: number;
}

export interface ISellOptions {
  minSell: number;
  deliverPrice: number;
  deliverAtDoor: number;
}
