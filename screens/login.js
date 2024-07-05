import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  accentColor3, accentColor4, accentColor5,
  accentColor7, accentColor8, textColor, textColor2, textColor3
} from "../styles/main";
import { useNavigation } from "@react-navigation/native";
import { LOGIN } from "../graphql/mutations";
import { StoreUserToken } from "../storage";


export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const navigation = useNavigation()

  const [creds, setCreds] = useState({
    emailorUsername: "",
    password: "",
  })

  async function LoginUser() {
    const response = await LOGIN(creds)
    if (response?.Login) {
      const stored = await StoreUserToken(response.Login.token)
      if (stored) {
        navigation.navigate("MainScreen", { screen: "Home" })
      }
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: accentColor7, flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={{ height: "100%" }}>
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 30 }}>
            <Image source={require("../assets/uniconnect-logo.png")} resizeMode="center" style={{ height: 150 }} />
          </View>

          <View style={{ marginHorizontal: 10, marginTop: 15, paddingBottom: 20 }}>

            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Username/ Email Address</Text>
            <TextInput onChangeText={(e) => setCreds({ ...creds, emailorUsername: e })} placeholder="Enter username or email" placeholderTextColor={textColor2} style={styles.detailsContainer} />

            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Password</Text>
            <View style={[styles.detailsContainer, { flexDirection: "row", gap: 5, alignItems: "center", paddingVertical: 0, paddingLeft: 0 }]}>
              <TextInput
                placeholderTextColor={textColor2}
                style={[styles.detailsContainer]}
                placeholder="Enter password"
                passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
                secureTextEntry={passwordVisible}
                onChangeText={(e) => setCreds({ ...creds, password: e })}
              />
              <Ionicons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={24} color={accentColor4} onPress={() => setPasswordVisible(!passwordVisible)} />
            </View>

            <TouchableOpacity onPress={() => LoginUser()} style={styles.createButton}>
              <Text style={styles.createButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={{ marginTop: 30 }}>
              <Text style={{ color: accentColor5, fontSize: 20, textAlign: "center" }}>I'm new here</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  detailsContainer: {
    flexDirection: "column",
    color: textColor,
    fontSize: 20,
    flexGrow: 1,
    backgroundColor: accentColor8,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  categoryItem: {
    padding: 15,
    paddingHorizontal: 20,
    marginLeft: 5,
    borderRadius: 10,
  },
  createButton: {
    backgroundColor: accentColor5,
    padding: 15,
    marginHorizontal: 5,
    marginTop: 30,
    alignItems: "center",
    borderRadius: 25,
  },
  createButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 25,
  },
})