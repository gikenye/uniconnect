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
import { useEffect, useRef, useState } from "react";
import { BlurView } from "expo-blur";
import { dumCategories } from "./home";
import { accentColor1, accentColor2, accentColor3, accentColor4, accentColor5, accentColor6, accentColor7, accentColor8, textColor, textColorAlt } from "../styles/main";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GetStoredUserToken } from "../storage";
import { FETCH_BUSINESSES_LIST } from "../graphql/queries";



export default function BusinessList() {
  const navigation = useNavigation()
  const route = useRoute()
  const [searchTerm, setSearchTerm] = useState("")
  const searchRef = useRef()
  const [data, setData] = useState()
  const [loading, setloading] = useState(false)

  useEffect(() => {
    const val = route.params?.search
    if (val) {
      searchRef.current?.focus()
      setSearchTerm(val)
    }
  }, [])

  useEffect(() => {
    FetchCategoryBusiness()
  }, [searchTerm])

  async function FetchCategoryBusiness() {
    setloading(true)
    const token = await GetStoredUserToken(navigation)
    const response = await FETCH_BUSINESSES_LIST({ token: token, searchTerm: searchTerm ? searchTerm : null })
    if (response) {
      setData(response.FetchBusinessList)
    }
    setloading(false)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: accentColor8 }}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color={accentColor4} />
        <TextInput
          placeholder="Search"
          placeholderTextColor={accentColor4}
          style={styles.searchInput}
          ref={searchRef}
          value={searchTerm}
          onChangeText={(e) => setSearchTerm(e)}
        />
      </View>


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
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}>
        {(data && data?.length > 0) ? data.map((biz, i) =>
          <TouchableOpacity
            onPress={() => navigation.navigate("BusinessDetails", { id: biz.id })}
            key={i}
            style={styles.eventInfo}
          >
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
        ) : <Text style={{ color: textColor, textAlign: "center", marginTop: 100 }}>No businesses found</Text>}
      </ScrollView>

    </SafeAreaView >
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
    backgroundColor: accentColor3,
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
    borderBottomColor: accentColor3,
    borderBottomWidth: 0.2,
    alignItems: "center",
  },
  eventName: {
    color: textColor,
    fontSize: 20,
    textTransform: "capitalize",
    fontWeight: "300",
  },
  bizDescription: {
    color: textColorAlt,
    fontSize: 15,
    marginTop: 5,
    maxWidth: "90%",
    fontWeight: "300",
  },
});
