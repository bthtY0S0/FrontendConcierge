// ✅ utils/storage.js - fallback for SecureStore on web
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

export const getItem = async (key) => {
  if (isWeb) {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

export const setItem = async (key, value) => {
  if (isWeb) {
    return localStorage.setItem(key, value);
  } else {
    return await SecureStore.setItemAsync(key, value);
  }
};

export const deleteItem = async (key) => {
  if (isWeb) {
    return localStorage.removeItem(key);
  } else {
    return await SecureStore.deleteItemAsync(key);
  }
};
