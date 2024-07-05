import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { accentColor1, accentColor2, accentColor3, accentColor4, accentColor5, accentColor6, accentColor7, accentColor8, textColor, textColor2, textColor3, textColorAlt } from "../styles/main";
import { BottomSheet } from 'react-native-btr';
import { CopyToClipBoard, OpenLink } from "../constants";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { Header } from "../components/header";
import { CHECK_LIKED_BUSINESS, FETCH_BUSINESSES_DETAILS, FETCH_COMMENTS, FETCH_LIKED_BUSINESS } from "../graphql/queries";
import { GetStoredUserToken } from "../storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LIKE_BUSINESS, POST_COMMENT } from "../graphql/mutations";

export default function BusinessInfo() {
  const [readMore, setreadMore] = useState(false)
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState()
  const route = useRoute()
  const navigation = useNavigation()
  const [liked, setliked] = useState(false)
  const [comment, setcomment] = useState("")
  const [comments, setComments] = useState()


  async function FetchBusiness(id) {
    if (!id) return
    const token = await GetStoredUserToken(navigation)
    const response = await FETCH_BUSINESSES_DETAILS(token, id)
    if (response) {
      setData(response.FetchBusiness)
    }
  }

  async function CheckLikeState(id) {
    const token = await GetStoredUserToken(navigation)
    const response = await CHECK_LIKED_BUSINESS(token, id)
    if (response?.CheckIFLiked) {
      setliked(true)
    }
  }


  async function LikeBusiness(bizId) {
    const token = await GetStoredUserToken(navigation)
    const response = await LIKE_BUSINESS(token, bizId)
    if (response.LikeBusiness) {
      setliked(true)
    } else {
      setliked(false)
    }
    FetchBusiness(route.params?.id)
  }


  async function FetchComments() {
    const token = await GetStoredUserToken(navigation)
    const response = await FETCH_COMMENTS(token, route.params?.id)
    if (response) {
      setComments(response.FetchComments)
    }
  }

  async function WriteComment() {
    const token = await GetStoredUserToken(navigation)
    const response = await POST_COMMENT({
      token: token,
      bizId: route.params?.id,
      message: comment
    })
    if (response.PostComment) {
      FetchComments()
    }
  }

  useEffect(() => {
    const val = route.params?.id
    FetchBusiness(val)
    FetchComments()
    CheckLikeState(val)
  }, [])

  return (
    <SafeAreaView style={{ backgroundColor: accentColor1 }}>
      <Header />
      {data &&
        <ScrollView style={{ backgroundColor: accentColor1, paddingBottom: 50 }}>
          <Image
            source={require("../assets/IMG_4924.jpg")}
            resizeMode="cover"
            style={{ height: 300, width: Dimensions.get("screen").width }}
          ></Image>

          <View style={{ paddingHorizontal: 15, paddingBottom: 20 }}>
            <Text style={styles.title}>
              {data.name}
            </Text>

            <View style={styles.detailsContainer}>
              <TouchableOpacity onLongPress={() => CopyToClipBoard(data.location)} style={styles.bizDetails}>
                <Ionicons name="location-outline" size={20} color={accentColor6} />
                <Text style={styles.detailsText}>
                  {data.location}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onLongPress={() => CopyToClipBoard(data.contact)} style={styles.bizDetails}>
                <Ionicons name="call-outline" size={20} color={accentColor6} />
                <Text style={styles.detailsText}>
                  {data.contact}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => data.website && OpenLink(data.website)} style={styles.bizDetails}>
                <Ionicons name="ios-link" size={20} color={accentColor6} />
                <Text style={styles.detailsText}>
                  {data.website}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.descTitle}>Description</Text>
            <Text style={styles.description} numberOfLines={readMore ? undefined : 2}>{data.description}</Text>
            <TouchableOpacity onPress={() => setreadMore(!readMore)}>
              <Text style={{ color: accentColor5, fontSize: 18 }}>{readMore ? "Show Less" : "Read more"}</Text>
            </TouchableOpacity>

            <View style={styles.feedBackContainer}>
              <TouchableOpacity style={styles.feedBackButton} onPress={() => LikeBusiness(data.id)}>
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={30}
                  color={liked ? "red" : textColor}
                />
                <Text style={{ color: textColor, fontSize: 18 }}>{data.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVisible(true)} style={styles.feedBackButton}>
                <Ionicons style={styles.eventLikeIcon} name="chatbubble-outline" size={24} color={textColor} />
                <Text style={{ color: textColor, fontSize: 18 }}>Comments</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.buyButton} onPress={() => data.contact && OpenLink("https://wa.me/" + data.contact)}>
              <Text style={styles.buyButtonText}>Chat on WhatsApp</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      }

      <BottomSheet
        visible={visible}
        onBackButtonPress={() => setVisible(!visible)}
        onBackdropPress={() => setVisible(!visible)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={styles.bottomNavigationView}>
          <View style={{ borderBottomColor: accentColor6, borderBottomWidth: 0.2, padding: 20 }}>
            <Text style={{ fontSize: 25, color: textColor }}>Comments</Text>
          </View>


          <ScrollView>
            {comments && comments.map((com, i) => (
              <View key={i} style={{ borderBottomColor: accentColor3, borderBottomWidth: 0.2, padding: 10 }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Image source={require("../assets/IMG_4925.jpg")} style={{ height: 50, width: 50, borderRadius: 50, }} />
                  <View style={{ flexDirection: "column", gap: 5 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: textColor }}>{com.sender}</Text>
                    <Text style={{ color: textColor, marginRight: 65 }}>{com.Message}</Text>
                  </View>
                  <Text style={{ marginLeft: "auto", fontSize: 15, color: textColor2 }}>{new Date(com.date).toLocaleDateString()}</Text>
                </View>
              </View>
            ))}

          </ScrollView>
          <View style={styles.textinput}>
            <TextInput
              style={{ flexGrow: 1, maxWidth: "90%", color: textColor, paddingBottom: 5, fontSize: 17 }}
              multiline
              placeholder="Type Comment Here"
              placeholderTextColor={textColor2}
              onChangeText={(e) => setcomment(e)}
            />
            <TouchableOpacity onPress={() => WriteComment()}>
              <Ionicons name="md-send" size={30} color={accentColor4} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 40, marginTop: 10, color: textColor },
  bizDetails: { flexDirection: "row", alignItems: "center", gap: 5 },
  detailsContainer: { marginTop: 20, flexDirection: "row", flexWrap: "wrap", gap: 10 },
  descTitle: {
    color: textColorAlt,
    marginTop: 25,
    fontSize: 25,
    fontWeight: "500",
  },
  description: {
    color: textColorAlt,
    marginVertical: 10,
    fontSize: 17,
    lineHeight: 30,
  },
  detailsText: {
    color: textColorAlt,
    fontSize: 18,
  },
  map: {
    marginTop: 30,
    height: 200,
    borderRadius: 20,
  },
  interestImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft: -20,
    overflow: "hidden",
  },
  interestText: {
    position: "absolute",
    top: 17,
    left: 10,
  },
  buyButton: {
    backgroundColor: accentColor5,
    padding: 20,
    marginHorizontal: 5,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 5,
    shadowRadius: 7,
    shadowColor: accentColor5,
    borderRadius: 25,
  },
  buyButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 25,
  },
  feedBackContainer: {
    flexDirection: "row",
    backgroundColor: accentColor3,
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 20,
    borderRadius: 5,
  },
  feedBackButton: {
    flexDirection: "row", alignItems: "center", gap: 10, padding: 20,
  },
  bottomNavigationView: {
    backgroundColor: accentColor2,
    height: Dimensions.get("window").height - 200,
  },
  textinput: {
    marginBottom: 30,
    marginTop: 10,
    padding: 15,
    borderRadius: 25,
    backgroundColor: accentColor3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
});


