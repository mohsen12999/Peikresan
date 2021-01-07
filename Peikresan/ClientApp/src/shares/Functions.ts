import { ICategory, IProduct, IShopCartProduct } from "./Interfaces";

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

export const ShopCartTotalPrice = (
  shopCart: number[],
  products: IProduct[]
): number =>
  shopCart
    .map((c, i) => ({
      count: c,
      price: products.find((p) => p.id == i)?.price,
    }))
    .reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.count * (currentValue.price ?? 0),
      0
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

// TODO: add price rules
export const CalculateTotalPrice = (
  shopCart: number[],
  products: IProduct[]
  // sellOptions
): number =>
  shopCart
    .filter((c) => c > 0)
    .map(
      (c, i) =>
        ({ ...products.find((p) => p.id == i), count: c } as IShopCartProduct)
    )
    .reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.count * (currentValue.price ?? 0),
      0
    );
