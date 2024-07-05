import {
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, EvilIcons, Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { HapticButton } from "../components/haptic";
import { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import { dumCategories } from "./home";
import { accentColor1, accentColor2, accentColor3, accentColor4, accentColor5, accentColor6, accentColor7, accentColor8, textColor, textColorAlt } from "../styles/main";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../components/header";
import { FETCH_LIKED_BUSINESS } from "../graphql/queries";
import { GetStoredUserToken } from "../storage";



export default function LikedBusiness() {
  const navigation = useNavigation()
  const [data, setData] = useState()
  const [loading, setloading] = useState(false)




  async function FetchLikedBusiness() {
    setloading(true)
    const token = await GetStoredUserToken(navigation)
    const response = await FETCH_LIKED_BUSINESS(token)
    console.log(response);
    if (response) {
      setData(response.FetchLikedBusiness)
    }
    setloading(false)
  }

  useEffect(() => {
    FetchLikedBusiness();
  }, [])


  return (
    <LinearGradient
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[accentColor1, accentColor2]}
    >
      <SafeAreaView style={{ marginHorizontal: 10, flex: 1 }}>
        <Header />
        <Text style={{ fontSize: 35, color: textColor, padding: 10 }}>
          Liked Businesses
        </Text>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              colors={[accentColor5]}
              onRefresh={() => FetchLikedBusiness()}
              tintColor={accentColor5}
              title="Fetching data..."
              titleColor={"white"}
              children={
                <Text style={{ color: accentColor5, textAlign: "center" }}>
                  Pull Down to refresh
                </Text>
              }
            />
          }
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 80 }}
        >
          {data && data.length > 0 ? data.map((biz, i) =>
            <TouchableOpacity
              onPress={() => navigation.navigate("BusinessDetails", { id: biz.id })}
              key={i}
              style={styles.eventInfo}>
              <Image source={require("../assets/IMG_4924.jpg")} style={{ height: 50, width: 50, }} />
              <View style={{ flexDirection: "column", padding: 10 }}>
                <Text style={styles.eventName}>
                  {biz.name}
                </Text>
                <Text numberOfLines={2} style={styles.bizDescription}>
                  {biz.description}
                </Text>
              </View>
              <EvilIcons style={{ marginLeft: "auto" }} name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
          ) :
            <Text style={{ color: textColor, textAlign: "center", marginTop: 100 }}>No businesses liked</Text>
          }
        </ScrollView>

      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
  },
  searchContainer: {
    backgroundColor: accentColor8,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    color: textColor,
    fontSize: 20,
    flexGrow: 1,
    marginLeft: 10,
  },
  categoryItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginLeft: 10,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 5,
    shadowRadius: 7,
  },
  titleHeader: {
    flexDirection: "row",
    margin: 20,
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  eventImage: {
    height: 370,
    position: "relative",
  },
  eventInfo: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  eventName: {
    color: textColor,
    fontSize: 20,
    fontWeight: "300",
    textTransform: "capitalize",
  },
  bizDescription: {
    color: textColorAlt,
    fontSize: 15,
    marginTop: 5,
    maxWidth: "90%",
    fontWeight: "300",
  },
});
