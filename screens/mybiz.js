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
import { Ionicons, EvilIcons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { HapticButton } from "../components/haptic";
import { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import { dumCategories } from "./home";
import { accentColor1, accentColor2, accentColor3, accentColor4, accentColor5, accentColor6, accentColor7, accentColor8, textColor, textColor2, textColorAlt } from "../styles/main";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../components/header";
import { GetStoredUserToken } from "../storage";
import { FETCH_BUSINESSES_LIST } from "../graphql/queries";



export default function LikedBusiness() {
  const navigation = useNavigation()
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)



  async function FetchMyBusiness() {
    setLoading(true)
    const token = await GetStoredUserToken(navigation)
    const response = await FETCH_BUSINESSES_LIST({ token: token, mine: true })
    if (response) {
      setData(response.FetchBusinessList)
    }
    setLoading(false)
  }

  useEffect(() => {
    FetchMyBusiness()
  }, [])

  return (
    <LinearGradient
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[accentColor1, accentColor2]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <Text style={{ fontSize: 25, fontWeight: "bold", color: textColor, marginLeft: 20 }}>
          Your Shops
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
          <Text style={{ fontSize: 20, color: textColor, padding: 10 }}>
            {data?.length} Businesses
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("NewBusiness")}
            style={{
              padding: 10,
              backgroundColor: accentColor5,
              borderRadius: 25
            }}>
            <MaterialIcons name="add-business" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        <ScrollView
          indicatorStyle="white"
          refreshControl={
            <RefreshControl
              refreshing={loading}
              colors={[accentColor5]}
              onRefresh={() => FetchMyBusiness()}
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
          style={{ marginBottom: 80, paddingTop: 20 }}
        >
          {data && data?.length > 0 ? data.map((biz, i) =>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditBusiness", { id: biz.id })}
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
              <MaterialCommunityIcons style={{ marginLeft: "auto", marginHorizontal: 10 }} name="store-edit" size={24} color={textColorAlt} />
              <Text style={{ color: textColor }} >Edit</Text>
            </TouchableOpacity>
          ) :
            <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("NewBusiness")}>
              <Text style={styles.createButtonText}>Add your Business</Text>
            </TouchableOpacity>
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
    marginHorizontal: 10,
    alignItems: "center",
  },
  eventName: {
    color: textColor,
    textTransform: "capitalize",
    fontSize: 20,
    fontWeight: "300",
  },
  bizDescription: {
    color: textColorAlt,
    fontSize: 15,
    marginTop: 5,
    maxWidth: "80%",
    fontWeight: "300",
  },
  createButton: {
    backgroundColor: accentColor5,
    padding: 15,
    marginHorizontal: 50,
    marginTop: 200,
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 5,
    shadowRadius: 7,
    shadowColor: accentColor5,
    borderRadius: 25,
  },
  createButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 25,
  },
});
