import { IAddress, IUserFactor } from "./Interfaces";

const TOKEN = "TOKEN";
const ADDRESSES = "ADDRESSES";
const SHOP_CART = "SHOP_CART";
const FACTORS = "FACTORS";
const PRODUCTS = "PRODUCTS";
const CATEGORIES = "CATEGORIES";
const SUGGESTIONS = "SUGGESTIONS";
const NEWEST = "NEWEST";
const MOST_SELL = "MOST_SELL";
const SLIDERS = "SLIDERS";
const BANNERS = "BANNERS";
// const DISTRICTS = "DISTRICTS";

export const AddToken = (token: string) => {
  localStorage.setItem(TOKEN, token);
};

export const GetToken = () => {
  return localStorage.getItem(TOKEN);
};

export const RemoveToken = () => {
  return localStorage.removeItem(TOKEN);
};

export const SaveAddresses = (addresses: IAddress[]) => {
  localStorage.setItem(ADDRESSES, JSON.stringify(addresses));
};

export const GetAddresses = (): IAddress[] => {
  return JSON.parse(localStorage.getItem(ADDRESSES) as string);
};

export const SaveFactors = (factors: IUserFactor[]) => {
  localStorage.setItem(FACTORS, JSON.stringify(factors));
};

export const GetFactors = (): IUserFactor[] => {
  return JSON.parse(localStorage.getItem(FACTORS) as string);
};

/*
export const SaveCart = (cart) => {
  localStorage.setItem(SHOP_CART, JSON.stringify(cart));
};

export const GetCart = () => {
  return JSON.parse(localStorage.getItem(SHOP_CART) as string);
};

export const SaveCart2Factor = (newFactors) => {
  localStorage.setItem(FACTORS, JSON.stringify(newFactors));
  localStorage.removeItem(SHOP_CART);
};

export const GetFactors = () => {
  return JSON.parse(localStorage.getItem(FACTORS) as string);
};

// public data

export const GetProducts = () => {
  return JSON.parse(localStorage.getItem(PRODUCTS) as string);
};

export const SaveProducts = (products) => {
  // const newProducts = products.map((p) => ({ ...p, category: undefined }));
  localStorage.setItem(PRODUCTS, JSON.stringify(products));
};

export const GetCategories = () => {
  return JSON.parse(localStorage.getItem(CATEGORIES) as string);
};

export const SaveCategories = (categories) => {
  // const newCategories = categories.map((c) => ({ ...c, products: undefined }));
  localStorage.setItem(CATEGORIES, JSON.stringify(categories));
};

export const GetSuggestions = () => {
  return JSON.parse(localStorage.getItem(SUGGESTIONS) as string);
};

export const SaveSuggestions = (suggestions) => {
  localStorage.setItem(SUGGESTIONS, JSON.stringify(suggestions));
};

export const GetNewest = () => {
  return JSON.parse(localStorage.getItem(NEWEST) as string);
};

export const SaveNewest = (newest) => {
  localStorage.setItem(NEWEST, JSON.stringify(newest));
};

export const GetMostSell = () => {
  return JSON.parse(localStorage.getItem(MOST_SELL) as string);
};

export const SaveMostSell = (most_sell) => {
  localStorage.setItem(MOST_SELL, JSON.stringify(most_sell));
};

export const GetSliders = () => {
  return JSON.parse(localStorage.getItem(SLIDERS) as string);
};

export const SaveSliders = (sliders) => {
  localStorage.setItem(SLIDERS, JSON.stringify(sliders));
};

export const GetBanners = () => {
  return JSON.parse(localStorage.getItem(BANNERS) as string);
};

export const SaveBanners = (banners) => {
  localStorage.setItem(BANNERS, JSON.stringify(banners));
};

// export const GetDistricts = () => {
//   return JSON.parse(localStorage.getItem(DISTRICTS) as string);
// };

// export const SaveDistricts = (districts) => {
//   localStorage.setItem(DISTRICTS, JSON.stringify(districts));
// };
*/
