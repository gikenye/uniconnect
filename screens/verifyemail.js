import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, AntDesign, EvilIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { HapticButton } from "../components/haptic";
import { useState } from "react";
import { BlurView } from "expo-blur";
import { accentColor1, accentColor2, accentColor3, accentColor4, accentColor5, accentColor6, accentColor7, accentColor8, textColor, textColor2, textColor3, textColorAlt } from "../styles/main";
import { useNavigation } from "@react-navigation/native";
import { dumCategories } from "./home";
import { SelectList } from 'react-native-dropdown-select-list'
import * as ImagePicker from 'expo-image-picker';
import { Header } from "../components/header";
import { VERIFY_USER } from "../graphql/mutations";
import { GetStoredUserToken } from "../storage";


export default function VerifyEmail() {
  const navigation = useNavigation()
  const [otp, setOtp] = useState("")

  async function VerifyUser() {
    const token = await GetStoredUserToken(navigation)
    const response = await VERIFY_USER(token, otp)
    if (response?.VerifyUser) {
      Alert.alert("User verified")
      navigation.navigate("Account")
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: accentColor7, flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginHorizontal: 10, marginTop: 15, paddingBottom: 20 }}>
            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Enter OTP sent to email - mikey123@gmail.com</Text>
            <TextInput onChangeText={(e) => setOtp(e)} placeholder="Enter otp" placeholderTextColor={textColor2} style={styles.detailsContainer} />
            <TouchableOpacity onPress={() => VerifyUser()} style={styles.createButton}>
              <Text style={styles.createButtonText}>Verify</Text>
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