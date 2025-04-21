import * as SecureStore from "expo-secure-store";

const isWeb = typeof window !== "undefined" && typeof window.document !== "undefined";

export const getItem = async (key) => {
  if (isWeb) return localStorage.getItem(key);
  return await SecureStore.getItemAsync(key);
};

export const setItem = async (key, value) => {
  if (isWeb) return localStorage.setItem(key, value);
  return await SecureStore.setItemAsync(key, value);
};

export const deleteItem = async (key) => {
  if (isWeb) return localStorage.removeItem(key);
  return await SecureStore.deleteItemAsync(key);
};