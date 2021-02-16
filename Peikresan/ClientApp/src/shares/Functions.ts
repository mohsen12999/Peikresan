import { DeliverDay, UserRole } from "./Constants";
import {
  ICategory,
  IProduct,
  IShopCartProduct,
  IAddress,
  ISellOptions,
  ITreeNode,
} from "./Interfaces";

export const ProductCount = (
  count: number,
  soldByWeight: boolean,
  minWeight: number
) =>
  soldByWeight
    ? count * minWeight < 1000
      ? count * minWeight + " گرم"
      : (count * minWeight) / 1000.0 + " کیلوگرم"
    : count;

export const ShopCartProductTypeCount = (shopCart: number[]) =>
  shopCart.filter((c) => c > 0).length;

export const GetShopCartProducts = (
  shopCart: number[],
  products: IProduct[]
): IShopCartProduct[] =>
  shopCart
    .filter((c) => c > 0)
    .map(
      (c, i) =>
        ({ ...products.find((p) => p.id === i), count: c } as IShopCartProduct)
    );

export const GetSubCategories = (id: number, categories: ICategory[]) =>
  categories.filter((cat) => Number(cat.parentId) === Number(id));

export const GetProductsFromList = (
  idList: number[],
  products: IProduct[]
): IProduct[] =>
  idList
    .map((s) => products.find((p) => p.id === s))
    .filter((p) => p !== undefined)
    .map((p) => p as IProduct);

export const CalculateShopCartTotalPrice = (
  shopCart: number[],
  products: IProduct[]
): number =>
  shopCart
    .filter((c) => c > 0)
    .map((c, i) => {
      const product = products.find((p) => p.id === i);
      return product
        ? { count: c, price: product.price }
        : { count: c, price: 0 };
    })
    .reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.count * currentValue.price,
      0
    );

export const CalculateDeliverPrice = (
  shopCartTotalPrice: number,
  deliverAtDoor: boolean,
  sellOptions: ISellOptions,
  deliverDay?: DeliverDay
) =>
  deliverDay && deliverDay === DeliverDay.EXPRESS
    ? shopCartTotalPrice + sellOptions.expressDeliver
    : (shopCartTotalPrice < sellOptions.minimumCart
        ? sellOptions.deliverPrice
        : 0) + (deliverAtDoor ? sellOptions.deliverAtDoor : 0);

export const CalculateTotalPrice = (
  shopCart: number[],
  products: IProduct[],
  deliverAtDoor: boolean,
  sellOptions?: ISellOptions
) => {
  const totalProductPrice = CalculateShopCartTotalPrice(shopCart, products);
  return (
    totalProductPrice +
    (sellOptions
      ? CalculateDeliverPrice(totalProductPrice, deliverAtDoor, sellOptions)
      : 0)
  );
};

export const ValidateAddressData = ({
  state,
  city,
  mobile,
  name,
}: IAddress): boolean =>
  name.length > 2 && state.length > 2 && city.length > 2 && mobile.length > 5;

export const ValidateAddress = (address?: IAddress) =>
  address ? ValidateAddressData(address) : false;

export const OrderStatusDescription = (orderStatus: number) => {
  switch (orderStatus) {
    case 1:
      return "ایجاد سفارش";
    case 10:
      return "تائید پرداخت";

    case 20:
      return "انتخاب فروشنده";
    case 23:
      return "فروشنده رد کرد";
    case 27:
      return "فروشنده تائید کرد";

    case 30:
      return "انتخاب پیک";
    case 33:
      return "پیک رد کرد";
    case 37:
      return "پیک تائید کرد";

    case 40:
      return "پیک محصول را تحویل گرفت";
    case 45:
      return "پیک محصول را تحویل داد";

    case 50:
      return "خریدار تحویل گرفت";
    case 55:
      return "خریدار امتیاز داد";

    default:
      return "";
  }
};

export const GetUsersRoleName = (role: string) => {
  role = role.toUpperCase();
  switch (role) {
    case UserRole.ADMIN:
      return "مدیریت";

    case UserRole.SELLER:
      return "فروشندگان";

    case UserRole.DELIVERY:
      return "پیک‌ها";

    default:
      return "";
  }
};

export const MakeCategoryTree = (
  id: number,
  categories: ICategory[]
): ITreeNode[] => {
  return categories
    .filter((cat) => cat.parentId === id)
    .map(
      (cat1) =>
        ({
          id: cat1.id,
          value: cat1.title,
          label: cat1.title,
          children: MakeCategoryTree(cat1.id, categories),
        } as ITreeNode)
    );
};
