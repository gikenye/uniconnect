import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { textColor } from "../styles/main";
import { useNavigation } from "@react-navigation/native";

export function Header({title}) {
  const navigation = useNavigation()
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()}>
        <Ionicons name="ios-chevron-back" size={30} color={textColor} />
      </TouchableOpacity>
      <Text numberOfLines={1} style={{ textAlign: "center", color: textColor, fontSize: 30,maxWidth:"80%" }}>{title}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('MainScreen', { screen: 'Account' })}>
        <Image source={require("../assets/IMG_4925.jpg")} style={{ height: 30, width: 30, borderRadius: 50, }} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 15,
  }
})