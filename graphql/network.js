import { API_URL, capitalize } from "../constants";
import { Alert } from "react-native";
import { request } from "../node_modules/graphql-request/build/esm/index";


export async function makeRequest(query, body, withDefaultInput) {
  try {
    const data = await request(
      API_URL,
      query,
      withDefaultInput ? { input: body } : body
    );
    return data;
  } catch (error) {
    console.log("❌", error);
    const first_error = error.response?.errors[0];
    const errormsg = first_error?.message;
    if (errormsg == "invalid token") {
      Alert.alert("Please login to continue");
      return undefined;
    }
    Alert.alert(errormsg ? capitalize(errormsg) : "Network error");
    return null;
  }
}
