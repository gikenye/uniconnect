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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { HapticButton } from "../components/haptic";
import { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import { accentColor1, accentColor2, accentColor3, accentColor4, accentColor5, accentColor6, accentColor7, accentColor8, textColor, textColor2, textColor3, textColorAlt } from "../styles/main";
import { OpenChat, OpenLink, capitalize } from "../constants";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../components/header";
import { BusinessType, BusinessTypes } from "../types/types";
import { GetStoredUserToken } from "../storage";
import { FETCH_BUSINESSES_LIST, FETCH_LIKED_BUSINESS } from "../graphql/queries";
import { LIKE_BUSINESS } from "../graphql/mutations";


export default function Home() {
  const [category, setcategory] = useState(Object.values(BusinessType)[0]);
  const navigation = useNavigation()
  const [searchTerm, setSearchTerm] = useState("")
  const [data, setData] = useState()
  const [likes, setLikes] = useState()
  const [loading, setLoading] = useState(false)


  async function FetchCategoryBusiness() {
    setLoading(true)
    const token = await GetStoredUserToken(navigation)
    const response = await FETCH_BUSINESSES_LIST({ token: token, type: category })
    if (response.FetchBusinessList) {
      setData(response.FetchBusinessList)
    }
    setLoading(false)
  }

  useEffect(() => {
    FetchCategoryBusiness()
    FetchLikedBusiness()
  }, [category])

  useEffect(() => {
    if (searchTerm != "") {
      navigation.navigate("BusinessList", { search: searchTerm })
    }
  }, [searchTerm])

  async function LikeBusiness(bizId) {
    const token = await GetStoredUserToken(navigation)
    const response = await LIKE_BUSINESS(token, bizId)
    if (response.LikeBusiness) {
      setLikes({ ...likes, [bizId]: true })
    } else {
      setLikes({ ...likes, [bizId]: false })
    }
  }

  async function FetchLikedBusiness() {
    const token = await GetStoredUserToken(navigation)
    const response = await FETCH_LIKED_BUSINESS(token)
    if (response) {
      setLikes(Object.fromEntries(response.FetchLikedBusiness.map((b) => [b.id, true])))
    }
  }

  console.log(likes);

  return (
    <LinearGradient
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[accentColor1, accentColor2]}
    >
      <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              colors={[accentColor5]}
              onRefresh={() => FetchCategoryBusiness()}
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
          style={{ paddingBottom: 100 }}>
          <Header />
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={24} color={accentColor4} />
            <TextInput
              placeholder="Search"
              placeholderTextColor={accentColor4}
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={(e) => setSearchTerm(e)}
            />
            <TouchableOpacity onPress={() => setSearchTerm("")} >
              {searchTerm && <Ionicons name="close" size={24} color={accentColor4} />}
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingVertical: 25, paddingLeft: 10 }}
          >
            {BusinessTypes.map((cat, index) => (
              <TouchableOpacity
                onPress={() => setcategory(cat)}
                key={index}
                style={[
                  {
                    backgroundColor: cat == category ? accentColor5 : accentColor3,
                    shadowColor: cat == category ? accentColor5 : "transparent",
                  },
                  styles.categoryItem,
                ]}
              >
                <Text style={{ color: textColor, fontSize: 20 }}>{capitalize(cat.toString().toLowerCase())}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.titleHeader}>
            <Text style={{ fontSize: 35, color: textColor }}>
              {capitalize(category.toString().toLowerCase())} Category
            </Text>
            <TouchableOpacity onPress={() => {
              navigation.navigate("BusinessList")
            }}>
              <Text style={{ color: accentColor5, fontSize: 20 }}>See all</Text>
            </TouchableOpacity>
          </View>
          {data && data?.length > 0 ?
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            >
              {data.map((biz, i) => (
                <View
                  key={i}
                  style={{
                    paddingHorizontal: 15,
                    width: Dimensions.get("window").width,
                  }}
                >
                  <ImageBackground
                    style={styles.eventImage}
                    borderRadius={25}
                    resizeMode="cover"
                    source={require("../assets/IMG_4924.jpg")}
                  >
                    <View style={styles.eventInfoContainer}>
                      <BlurView
                        style={styles.eventInfo}
                        intensity={Platform.OS == "ios" && 50}
                        tint="light"
                      >
                        <View style={{ flexDirection: "column", padding: 10 }}>
                          <Text style={styles.eventName}>
                            {biz.name}
                          </Text>
                          <Text style={styles.bizNumber}>
                            {biz.contact}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate("BusinessDetails", { id: biz.id })} style={styles.chatButton}>
                          <MaterialIcons name="more" size={24} color="white" />
                        </TouchableOpacity>
                      </BlurView>
                    </View>
                    <TouchableOpacity onPress={() => LikeBusiness(biz.id)}>
                      <Ionicons
                        style={styles.eventLikeIcon}
                        name="heart"
                        size={30}
                        color={likes && likes[biz.id] ? "red" : "black"}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              ))}
            </ScrollView>
            :
            <Text style={{ color: textColor, textAlign: "center", marginTop: 100 }}>No businesses found</Text>
          }
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: accentColor3,
    padding: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 20,
  },
  searchInput: {
    color: textColor,
    fontSize: 20,
    flexGrow: 1,
    marginLeft: 10,
  },
  categoryItem: {
    padding: 15,
    paddingHorizontal: 20,
    marginLeft: 20,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 5,
    shadowRadius: 7,
  },
  titleHeader: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  eventImage: {
    height: 370,
    position: "relative",
  },
  eventLikeIcon: {
    right: 0,
    position: "absolute",
    borderRadius: 20,
    margin: 10,
    overflow: "hidden",
    padding: 12,
    backgroundColor: "rgb(255,255,255)",
  },
  eventInfoContainer: {
    bottom: 0,
    position: "absolute",
    width: "100%",
    backgroundColor: Platform.OS == "android" && "rgba(0,0,0,0.9)",
    borderRadius: 25,
    borderTopRightRadius: 0,
    overflow: "hidden",
    borderTopLeftRadius: 0,
  },
  eventInfo: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eventName: {
    color: accentColor3,
    textTransform: "capitalize",
    fontSize: 20,
    fontWeight: "600",
  },
  bizNumber: {
    color: accentColor3,
    fontSize: 17,
    marginTop: 5,
    fontWeight: "600",
  },
  chatButton: {
    padding: 15,
    backgroundColor: accentColor5,
    borderRadius: 30,
    fontSize: 20,
    fontWeight: "600",
    overflow: "hidden",
  },
});
