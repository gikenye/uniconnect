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
import { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import { accentColor1, accentColor2, accentColor3, accentColor4, accentColor5, accentColor6, accentColor7, accentColor8, textColor, textColor2, textColor3, textColorAlt } from "../styles/main";
import { useNavigation } from "@react-navigation/native";
import { dumCategories } from "./home";
import { SelectList } from 'react-native-dropdown-select-list'
import * as ImagePicker from 'expo-image-picker';
import { Header } from "../components/header";
import { GetStoredUserToken } from "../storage";
import { CHANGE_PASSWORD } from "../graphql/mutations";




const data = [
  { key: 'Canada', value: 'Canada' },
  { key: 'England', value: 'England' },
  { key: 'Pakistan', value: 'Pakistan' },
  { key: 'India', value: 'India' },
  { key: 'NewZealand', value: 'NewZealand' },
]
export default function ChangePassword() {
  const [oldPasswordVisible, setOldPasswordVisible] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setconfirmPasswordVisible] = useState(true);
  const navigation = useNavigation()
  const [input, setInput] = useState({
    token: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  useEffect(() => {
    async function SetToken() {
      const token = await GetStoredUserToken(navigation);
      setInput({ ...input, token: token })
    }
    SetToken()
  }, [])

  async function ChangePassword() {
    const response = await CHANGE_PASSWORD(input)
    if (response?.ChangePassword) {
      Alert.alert("Password changed successfully")
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

            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Old Password</Text>
            <View style={[styles.detailsContainer, { flexDirection: "row", gap: 5, alignItems: "center", paddingVertical: 0, paddingLeft: 0 }]}>
              <TextInput
                placeholderTextColor={textColor2}
                style={styles.detailsContainer}
                onChangeText={(e) => setInput({ ...input, oldPassword: e })}
                placeholder="Enter old password"
                passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
                secureTextEntry={oldPasswordVisible}
              />
              <Ionicons name={oldPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color={accentColor4} onPress={() => setOldPasswordVisible(!oldPasswordVisible)} />
            </View>


            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>New Password</Text>
            <View style={[styles.detailsContainer, { flexDirection: "row", gap: 5, alignItems: "center", paddingVertical: 0, paddingLeft: 0 }]}>
              <TextInput
                placeholderTextColor={textColor2}
                style={[styles.detailsContainer]}
                placeholder="Enter new password"
                onChangeText={(e) => setInput({ ...input, newPassword: e })}
                passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
                secureTextEntry={passwordVisible}
              />
              <Ionicons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={24} color={accentColor4} onPress={() => setPasswordVisible(!passwordVisible)} />
            </View>

            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Confirm New Password</Text>

            <View style={[styles.detailsContainer, { flexDirection: "row", gap: 5, alignItems: "center", paddingVertical: 0, paddingLeft: 0 }]}>
              <TextInput
                placeholderTextColor={textColor2}
                style={styles.detailsContainer}
                onChangeText={(e) => setInput({ ...input, confirmNewPassword: e })}
                placeholder="Confirm new password"
                passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
                secureTextEntry={confirmPasswordVisible}
              />
              <Ionicons name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color={accentColor4} onPress={() => setconfirmPasswordVisible(!confirmPasswordVisible)} />
            </View>

            <TouchableOpacity onPress={() => ChangePassword()} style={styles.createButton}>
              <Text style={styles.createButtonText}>Update</Text>
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