import {
  ICategory,
  IProduct,
  IShopCartProduct,
  IAddress,
  ISellOptions,
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
        ({ ...products.find((p) => p.id == i), count: c } as IShopCartProduct)
    );

export const GetSubCategories = (id: number, categories: ICategory[]) =>
  categories.filter((cat) => Number(cat.parentId) === Number(id));

export const GetProductsFromList = (
  idList: number[],
  products: IProduct[]
): IProduct[] =>
  idList
    .map((s) => products.find((p) => p.id == s))
    .filter((p) => p !== undefined)
    .map((p) => p as IProduct);

export const CalculateShopCartTotalPrice = (
  shopCart: number[],
  products: IProduct[]
): number =>
  shopCart
    .filter((c) => c > 0)
    .map((c, i) => ({
      count: c,
      price: products.find((p) => p.id == i)?.price,
    }))
    .reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.count * (currentValue.price ?? 0),
      0
    );

export const CalculateDeliverPrice = (
  shopCartTotalPrice: number,
  deliverAtDoor: boolean,
  sellOptions: ISellOptions
) =>
  (shopCartTotalPrice < sellOptions.minimumCart
    ? sellOptions.deliverPrice
    : 0) + (deliverAtDoor ? sellOptions.deliverAtDoor : 0);

export const CalculateTotalPrice = (
  shopCart: number[],
  products: IProduct[],
  deliverAtDoor: boolean,
  sellOptions: ISellOptions
) => {
  const totalProductPrice = CalculateShopCartTotalPrice(shopCart, products);
  return (
    totalProductPrice +
    CalculateDeliverPrice(totalProductPrice, deliverAtDoor, sellOptions)
  );
};

export const ValidateAddress = ({
  state,
  city,
  mobile,
  name,
  description,
}: IAddress): boolean =>
  name.length > 2 &&
  state.length > 2 &&
  city.length > 2 &&
  description.length > 5 &&
  mobile.length > 5;
