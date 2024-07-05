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
import { REGISTER } from "../graphql/mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTHTOKEN } from "../constants";
import { StoreUserToken } from "../storage";


export default function Signup() {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setconfirmPasswordVisible] = useState(true);
  const navigation = useNavigation()
  const [creds, setCreds] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  })

  async function RegisterUser() {
    const response = await REGISTER(creds)
    if (response?.Register) {
      const stored = await StoreUserToken(response.Register.token)
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 30 }}>
            <Image source={require("../assets/uniconnect-logo.png")} resizeMode="center" style={{ height: 150 }} />
          </View>

          <View style={{ marginHorizontal: 10, marginTop: 15, paddingBottom: 20 }}>

            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>FullName</Text>
            <TextInput placeholder="Enter your name" onChangeText={(e) => setCreds({ ...creds, fullname: e })} placeholderTextColor={textColor2} style={styles.detailsContainer} />

            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Username</Text>
            <TextInput onChangeText={(e) => setCreds({ ...creds, username: e })} placeholder="Enter a custom username" placeholderTextColor={textColor2} style={styles.detailsContainer} />

            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Email Address</Text>
            <TextInput onChangeText={(e) => setCreds({ ...creds, email: e })} keyboardType="email-address" placeholder="Enter your email address" placeholderTextColor={textColor2} style={styles.detailsContainer} />

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

            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Confirm Password</Text>
            <View style={[styles.detailsContainer, { flexDirection: "row", gap: 5, alignItems: "center", paddingVertical: 0, paddingLeft: 0 }]}>
              <TextInput
                placeholderTextColor={textColor2}
                style={styles.detailsContainer}
                placeholder="Confirm password"
                passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
                secureTextEntry={confirmPasswordVisible}
                onChangeText={(e) => setCreds({ ...creds, confirmpassword: e })}
              />
              <Ionicons name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color={accentColor4} onPress={() => setconfirmPasswordVisible(!confirmPasswordVisible)} />
            </View>

            <TouchableOpacity onPress={() => RegisterUser()} style={styles.createButton}>
              <Text style={styles.createButtonText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 30 }}>
              <Text style={{ color: accentColor5, fontSize: 20, textAlign: "center" }}>I already have an account</Text>
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
    borderRadius: 20,
  },
  createButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 25,
  },
})