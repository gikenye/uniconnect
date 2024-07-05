import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, AntDesign, EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { HapticButton } from "../components/haptic";
import { useEffect, useRef, useState } from "react";
import { BlurView } from "expo-blur";
import { accentColor1, accentColor2, accentColor3, accentColor4, accentColor5, accentColor6, accentColor7, accentColor8, textColor, textColor2, textColor3, textColorAlt } from "../styles/main";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import * as LocalAuthentication from 'expo-local-authentication';
import { ClearStorage, GetStoredUserToken } from "../storage";
import { FETCH_USER_DATA } from "../graphql/queries";
import { FetchUserResponse } from "../types/types";



export default function Account() {
  const [image, setImage] = useState();
  const navigation = useNavigation()
  const [hasBiometric, sethasBiometric] = useState(false)
  const [bioSwitch, setBioSwitch] = useState(false)
  const [data, setData] = useState()

  const userNameRef = useRef()

  async function PickImage() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function GetUserData() {
    const token = await GetStoredUserToken(navigation)
    if (token) {
      const response = await FETCH_USER_DATA(token)
      console.log(response);
      if (response == undefined) {
        navigation.navigate("Login")
      } else if (response.fetchUserData) {
        setData(response.fetchUserData)
      }
    }
  }

  async function CheckBiometric() {
    try {
      sethasBiometric(await LocalAuthentication.hasHardwareAsync() && await LocalAuthentication.isEnrolledAsync())
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    GetUserData()
    // CheckBiometric()
  }, [])

  useEffect(() => {
    if (bioSwitch) return
    // CheckAuth()
  }, [bioSwitch])


  async function CheckAuth() {
    if (hasBiometric) {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate UniConnect User 🔒',
      })
      if (auth.success) {
        Alert.alert("Successfully Authenticated")
      } else {
        Alert.alert("Please use password to login")
      }
    }
  }

  return (
    <LinearGradient
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[accentColor1, accentColor2]}
    >
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 30 }}>
          {data && <>
            <View style={{ padding: 10 }}>
              <View style={{ flexDirection: "column", gap: 20, alignItems: "center", marginBottom: 20 }}>
                <Image source={image ? { uri: image } : require("../assets/IMG_4925.jpg")} style={{ height: 100, width: 100, borderRadius: 50, borderColor: accentColor3, borderWidth: 0.2 }} />
                <TouchableOpacity onPress={() => PickImage()} style={{ backgroundColor: accentColor5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 25 }}>
                  <Text style={{ color: textColor, fontSize: 18 }}>
                    Change Profile Picture
                  </Text>
                </TouchableOpacity>
              </View>


              <View
                style={styles.detailsContainer}>
                <View>
                  <Text style={{ color: textColor2 }}>Account Name</Text>
                  <Text style={styles.details}>{data.name}</Text>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <View style={{ flexDirection: "column" }}>
                  <Text style={{ color: textColor2 }}>Username</Text>
                  <Text numberOfLines={1} style={styles.details}>@{data.username}</Text>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <View>
                  <Text style={{ color: textColor2 }}>Email</Text>
                  <Text style={styles.details}>{data.email}</Text>
                </View>
              </View>
            </View>

            <Text style={{ fontSize: 20, fontWeight: "bold", color: textColor, marginVertical: 20, marginLeft: 10 }}>Preferences</Text>

            <View style={{ backgroundColor: accentColor2, padding: 20, margin: 10, borderRadius: 10 }}>
              <TouchableOpacity onPress={() => navigation.navigate("Change Password")} style={styles.accountOption}>
                <MaterialCommunityIcons name="form-textbox-password" size={24} color={textColor3} />
                <Text style={styles.optionText}>
                  Change Password
                </Text>
                <EvilIcons name="chevron-right" size={24} style={{ marginLeft: "auto" }} color={textColor3} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Verify Email")} style={styles.accountOption}>
                <Ionicons name="mail-outline" size={24} color={textColor3} />
                <Text style={styles.optionText}>
                  Email {data.verified ? "Verified" : "Not Verified"}
                </Text>
                <Ionicons name={data.verified ? "checkmark-circle" : "close-circle"} size={24} style={{ marginLeft: "auto" }} color={textColor3} />
              </TouchableOpacity>

              {hasBiometric &&
                <View style={[styles.accountOption, { borderBottomWidth: 0 }]}>
                  <Ionicons name="finger-print" size={24} color={textColor3} />
                  <Text style={styles.optionText}>
                    Biometric Authentication
                  </Text>
                  <Switch
                    trackColor={{ false: accentColor3, true: accentColor5 }}
                    ios_backgroundColor={accentColor3}
                    onValueChange={() => setBioSwitch(!bioSwitch)}
                    value={bioSwitch}
                    style={{ marginLeft: "auto", }}
                  />
                </View>
              }
            </View>
          </>
          }

          <Text style={{ fontSize: 20, fontWeight: "bold", color: textColor, marginVertical: 20, marginLeft: 10 }}>Support</Text>

          <View style={{ backgroundColor: accentColor2, padding: 20, margin: 10, borderRadius: 10, marginBottom: 120 }}>
            <TouchableOpacity style={styles.accountOption} onPress={() => navigation.navigate("Support")}>
              <View style={{ flexDirection: "column" }}>
                <Text style={{ color: textColor2, fontSize: 18 }}>
                  Info
                </Text>
                <Text style={styles.optionText}>
                  Help and Support
                </Text>
              </View>
              <EvilIcons style={{ marginLeft: "auto" }} name="chevron-right" size={24} color={textColor3} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                ClearStorage()
                navigation.navigate("Root")
              }}
              style={styles.logoutButton}>
              <AntDesign name="logout" size={20} color={textColor3} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </SafeAreaView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  details: {
    color: textColor,
    flexGrow: 1,
    fontSize: 20,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    backgroundColor: accentColor3,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  logoutButton: {
    backgroundColor: accentColor7,
    padding: 15,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 15,
    borderRadius: 25,
  },
  logoutButtonText: {
    color: textColor3,
    fontWeight: "500",
    fontSize: 25,
  },
  accountOption: {
    paddingVertical: 25,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: accentColor3,
    borderBottomWidth: 0.2,
    gap: 10,
  },
  optionText: {
    color: textColor3,
    fontSize: 20,
    fontWeight: "300",
  },
})