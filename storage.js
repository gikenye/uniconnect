import { useNavigation } from "@react-navigation/native";
import { AUTHTOKEN } from "./constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true
  } catch (e) {
    console.log(e);
    return false
  }
};

export const storeJson = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value || null;
  } catch (e) {
    console.log(e);
  }
};

export const getJson = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return JSON.parse(value) || null;
  } catch (e) {
    console.log(e);
  }
};

export async function StoreUserToken(token) {
  return token && storeData(AUTHTOKEN, token);
}

export async function GetStoredUserToken(navigation) {
  const token = await getData(AUTHTOKEN);
  if (!token) navigation?.navigate("Login")
  return token
}

export async function ClearStorage() {
  const asyncStorageKeys = await AsyncStorage.getAllKeys();
  if (asyncStorageKeys.length > 0) {
    if (Platform.OS === "ios") {
      await AsyncStorage.multiRemove(asyncStorageKeys);
    } else {
      await AsyncStorage.clear();
    }
  }
}
