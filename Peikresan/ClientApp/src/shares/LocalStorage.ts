const TOKEN = "TOKEN"
const ADDRESSES = "ADDRESSES"
const SHOP_CART = "SHOP_CART"
const FACTORS = "FACTORS"
const PRODUCTS = "PRODUCTS"
const CATEGORIES = "CATEGORIES"
const SUGGESTIONS = "SUGGESTIONS"
const NEWEST = "NEWEST"
const MOST_SELL = "MOST_SELL"
const SLIDERS = "SLIDERS"
const BANNERS = "BANNERS"
const DISTRICTS = "DISTRICTS"

export const AddToken = (token) => {
  localStorage.setItem(TOKEN, token);
};

export const GetToken = () => {
  return localStorage.getItem(TOKEN);
};

export const RemoveToken = () => {
  return localStorage.removeItem(TOKEN);
};

export const SaveAddresses = (addresses) => {
  localStorage.setItem(ADDRESSES, JSON.stringify(addresses));
};

export const GetAddresses = () => {
  return JSON.parse(localStorage.getItem(ADDRESSES));
};

export const SaveCart = (cart) => {
  localStorage.setItem(SHOP_CART, JSON.stringify(cart));
};

export const GetCart = () => {
  return JSON.parse(localStorage.getItem(SHOP_CART));
};

export const SaveCart2Factor = (newFactors) => {
  localStorage.setItem(FACTORS, JSON.stringify(newFactors));
  localStorage.removeItem(SHOP_CART);
};

export const GetFactors = () => {
  return JSON.parse(localStorage.getItem(FACTORS));
};

// public data

export const GetProducts = () => {
  return JSON.parse(localStorage.getItem(PRODUCTS));
};

export const SaveProducts = (products) => {
  // const newProducts = products.map((p) => ({ ...p, category: undefined }));
  localStorage.setItem(PRODUCTS, JSON.stringify(products));
};

export const GetCategories = () => {
  return JSON.parse(localStorage.getItem(CATEGORIES));
};

export const SaveCategories = (categories) => {
  // const newCategories = categories.map((c) => ({ ...c, products: undefined }));
  localStorage.setItem(CATEGORIES, JSON.stringify(categories));
};

export const GetSuggestions = () => {
  return JSON.parse(localStorage.getItem(SUGGESTIONS));
};

export const SaveSuggestions = (suggestions) => {
  localStorage.setItem(SUGGESTIONS, JSON.stringify(suggestions));
};

export const GetNewest = () => {
  return JSON.parse(localStorage.getItem(NEWEST));
};

export const SaveNewest = (newest) => {
  localStorage.setItem(NEWEST, JSON.stringify(newest));
};

export const GetMostSell = () => {
  return JSON.parse(localStorage.getItem(MOST_SELL));
};

export const SaveMostSell = (most_sell) => {
  localStorage.setItem(MOST_SELL, JSON.stringify(most_sell));
};

export const GetSliders = () => {
  return JSON.parse(localStorage.getItem(SLIDERS));
};

export const SaveSliders = (sliders) => {
  localStorage.setItem(SLIDERS, JSON.stringify(sliders));
};

export const GetBanners = () => {
  return JSON.parse(localStorage.getItem(BANNERS));
};

export const SaveBanners = (banners) => {
  localStorage.setItem(BANNERS, JSON.stringify(banners));
};

export const GetDistricts = () => {
  return JSON.parse(localStorage.getItem(DISTRICTS));
};

export const SaveDistricts = (districts) => {
  localStorage.setItem(DISTRICTS, JSON.stringify(districts));
};
