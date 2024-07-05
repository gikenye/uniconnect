import {
  Dimensions,
  Image,
  ImageBackground,
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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { HapticButton } from "../components/haptic";
import { useState } from "react";
import { BlurView } from "expo-blur";
import { accentColor1, accentColor2, accentColor3, accentColor4, accentColor5, accentColor6, accentColor7, accentColor8, textColor, textColor3, textColorAlt } from "../styles/main";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../components/header";
import { StatusBar } from "expo-status-bar";


export default function Root() {
  const navigation = useNavigation()
  return (
    <LinearGradient
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[accentColor1, accentColor2]}
    >
      <StatusBar style="dark" />
      <View style={{ flexDirection: "row", justifyContent: "center", }}>
        <Image
          source={require("../assets/logo-color.png")} resizeMode="cover"
          style={{ height: Dimensions.get("window").height - 350, width: Dimensions.get("window").width, borderBottomRightRadius: 150 }} />
      </View>

      <SafeAreaView style={{ marginHorizontal: 20 }}>
        <Text style={{ fontSize: 25, color: textColor3, textAlign: "center", marginTop: 70 }}>
          Are you a Student looking to expand Your Business Reach?
        </Text>
        <TouchableOpacity onPress={()=>navigation.navigate("Signup")} style={styles.createButton}>
          <Text style={styles.createButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>navigation.navigate("Login")} style={{ marginTop: 30 }}>
          <Text style={{ color: accentColor5, fontSize: 20, textAlign: "center" }}>I already have an account</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  )
}


const styles = StyleSheet.create({
  createButton: {
    backgroundColor: accentColor5,
    padding: 15,
    marginHorizontal: 10,
    marginTop: 40,
    alignItems: "center",
    borderRadius: 25,
  },
  createButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 25,
  },
})