import { DeliverDay } from "./Constants";

export interface IMoreBtn {
  show: boolean;
  title: string;
  link: string;
}

export interface ICategory {
  id: number;
  title: string;
  description: string;
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

  barcode: number;
  order: number;

  categoryId: number;
  category: string;
  // count?: number;
}

export interface IShopCartProduct extends IProduct {
  count: number;
}

export interface IUser {
  id: string;
  fullName: string;

  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  title: string;

  role: string;
  roleId: string;

  latitude: number;
  longitude: number;
}

export interface IRole {
  id: string;
  name: string;
  description: string;
}

export interface IOrder extends IAddress {
  orderStatus: number;

  deliverAtDoor: boolean;
  items: IOrderItem[];

  deliveryId: number;
  delivery: string;
  deliveryMobile: string;
}

export interface ISubOrder {
  id: number;

  sellerId: number;
  sellerName: string;
  sellerAddress: string;

  requestStatus: number;

  orderId: number;
  items: IOrderItem[];
}

export interface IOrderItem {
  id: number;
  title: string;
  count: number;
  productId: number;
  product: string;
  price: number;
}

export interface ISellerProduct {
  id: number;

  productId: number;
  productTitle: string;

  count: number;
  price: number;
}

export interface IAddress {
  id?: number;
  state: string;
  city: string;
  mobile: string;
  name: string;
  formattedAddress: string;
  description: string;
  // level: string;
  // unit: string;
  // number: string;
  // postalCode: string;
  latitude?: number;
  longitude?: number;
}

export interface IDeliverTime {
  id: string;
  time: number;
  title: string;
  deliverDay?: DeliverDay;
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

export interface IUserFactor {
  id: number;
  shopCart: number[];
  total: number;
}

export interface ISellOptions {
  minimumCart: number;
  deliverPrice: number;
  deliverAtDoor: number;
  expressDeliver: number;
}

export interface IBankData {
  token: string;
  terminalId: string;
  url: string;
  success: boolean;
}

export interface IAdminFactor {
  id: number;
  title: string;
  price: number;
  traceNumber: number;

  factorStatus: number;
  factorStatusDescription: number;
}

export interface ITreeNode {
  id: number;
  value: string;
  label: string;
  children: ITreeNode[];
}
