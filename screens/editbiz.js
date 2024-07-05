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
import { useNavigation, useRoute } from "@react-navigation/native";
import { dumCategories } from "./home";
import { SelectList } from 'react-native-dropdown-select-list'
import * as ImagePicker from 'expo-image-picker';
import { Header } from "../components/header";
import { GetStoredUserToken } from "../storage";
import { FETCH_BUSINESSES_DETAILS, FETCH_COMMENTS } from "../graphql/queries";
import { typedata } from "./newbiz";
import { DELETE_BUSINESS, EDIT_BUSINESS, POST_COMMENT } from "../graphql/mutations";
import { BottomSheet } from "react-native-btr";

export default function EditBusiness() {
  const [selected, setSelected] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState();
  const route = useRoute()
  const navigation = useNavigation()
  const [input, setInput] = useState({
    token: "",
    type: "",
    name: "",
    description: "",
    location: "",
    contact: "",
    website: "",
    image: ""
  })
  const [data, setData] = useState()

  const [comment, setcomment] = useState("")
  const [comments, setComments] = useState()
  const [visible, setVisible] = useState(false);






  async function FetchBusiness(id) {
    if (!id) return
    const token = await GetStoredUserToken(navigation)
    const response = await FETCH_BUSINESSES_DETAILS(token, id)
    if (response) {
      setData(response.FetchBusiness)
    }
  }

  useEffect(() => {
    const val = route.params?.id
    FetchBusiness(val)
    FetchComments()
  }, [])

  function EditMyBusiness() {
    Alert.alert(
      //title
      'Edit this Business',
      //body
      'Are you sure you want to continue?',
      [
        { text: 'Yes', onPress: () => EditBusinessFunction() },
        {
          text: 'No',
          style: 'cancel',
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  }
  function DeleteMyBusiness() {
    Alert.alert(
      //title
      'Delete this Business',
      //body
      'Are you sure you want to delete your business?',
      [
        { text: 'Yes', onPress: () => DeleteBusinessFunction() },
        {
          text: 'No',
          style: 'cancel',
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  }



  async function EditBusinessFunction() {
    const response = await EDIT_BUSINESS(input, route.params?.id)
    if (response?.EditBusiness) {
      Alert.alert("Business edited successfully")
      navigation.navigate("BusinessDetails", { id: route.params?.id })
    }
  }


  async function DeleteBusinessFunction() {
    const token = await GetStoredUserToken(navigation)
    const response = await DELETE_BUSINESS(token, route.params?.id)
    if (response?.DeleteBusiness) {
      Alert.alert("Business deleted")
      navigation.navigate("MainScreen")
    }
  }

  useEffect(() => {
    async function SetToken() {
      const token = await GetStoredUserToken(navigation);
      setInput({ ...input, token: token })
    }
    SetToken()
  }, [])


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


  return (
    <LinearGradient
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[accentColor1, accentColor2]}
    >
      <SafeAreaView>
        <Header title={data?.name} />
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}>
            {data?.image || image ?
              <>
                <Image
                  source={data?.image || image ? { uri: image || data?.image } : require("../assets/IMG_4924.jpg")}
                  resizeMode="cover"
                  style={{ height: 300, width: Dimensions.get("screen").width }}
                >
                </Image>
                <TouchableOpacity style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 15 }} onPress={() => setImage("")}>
                  <EvilIcons name="trash" size={24} color={textColor3} />
                  <Text style={{ color: textColor3 }}>Remove image</Text>
                </TouchableOpacity>
              </>
              :
              <View style={{ height: 300, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: textColor3 }}>No Photo Selected</Text>
              </View>
            }

            {data &&


              <View style={{ marginHorizontal: 10, paddingBottom: 130, marginTop: 15, }}>

                <TouchableOpacity onPress={() => PickImage()} style={{ padding: 10, backgroundColor: accentColor5, borderRadius: 25 }}>
                  <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
                    Select a new Image or logo for your business
                  </Text>
                </TouchableOpacity>

                <View style={styles.feedBackContainer}>
                  <View style={styles.feedBackButton}>
                    <Ionicons
                      name="heart"
                      size={30}
                      color="red"
                    />
                    <Text style={{ color: textColor, fontSize: 18 }}>Likes {data.likes}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setVisible(true)} style={styles.feedBackButton}>
                    <Ionicons style={styles.eventLikeIcon} name="chatbubble-outline" size={24} color={textColor} />
                    <Text style={{ color: textColor, fontSize: 18 }}>Comments</Text>
                  </TouchableOpacity>
                </View>

                <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Edit the Type of Business</Text>
                <SelectList
                  boxStyles={{ backgroundColor: accentColor3, borderWidth: 0, paddingVertical: 15 }}
                  inputStyles={{ color: textColor2, fontSize: 20, marginLeft: 10 }}
                  dropdownStyles={{ backgroundColor: accentColor8, borderWidth: 0 }}
                  dropdownTextStyles={{ color: textColor2, fontSize: 18 }}
                  dropdownItemStyles={{ width: "100%" }}
                  arrowicon={<EvilIcons name="chevron-down" size={24} color={textColor2} />}
                  searchicon={<EvilIcons name="search" size={24} color={textColor2} />}
                  closeicon={<EvilIcons name="chevron-up" size={24} color={textColor2} />}
                  setSelected={(e) => setInput({ ...input, type: e })} data={typedata}
                  placeholder={data.type}
                />
                <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Business Name</Text>
                <TextInput placeholder={data.name} onChangeText={(e) => setInput({ ...input, name: e })} placeholderTextColor={textColor2} style={styles.detailsContainer} />

                <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Description</Text>
                <TextInput placeholder={data.description} onChangeText={(e) => setInput({ ...input, description: e })} placeholderTextColor={textColor2} numberOfLines={4} style={styles.detailsContainer} />

                <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Location</Text>
                <TextInput placeholder={data.location} onChangeText={(e) => setInput({ ...input, location: e })} placeholderTextColor={textColor2} style={styles.detailsContainer} />

                <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Website (optional)</Text>
                <TextInput placeholder={data.website} onChangeText={(e) => setInput({ ...input, website: e })} placeholderTextColor={textColor2} style={styles.detailsContainer} />

                <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>WhatsApp Business Contact</Text>
                <TextInput placeholder={data.contact} onChangeText={(e) => setInput({ ...input, contact: e })} keyboardType="phone-pad" placeholderTextColor={textColor2} style={styles.detailsContainer} />

                <TouchableOpacity onPress={() => EditMyBusiness()} style={styles.createButton}>
                  <Text style={styles.createButtonText}>Update</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => DeleteMyBusiness()} style={[styles.createButton, { backgroundColor: "red", shadowOpacity: 0, marginTop: 30 }]}>
                  <Text style={styles.createButtonText}>Delete this Business</Text>
                </TouchableOpacity>
              </View>
            }


          </ScrollView>
        </KeyboardAvoidingView>

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
      </SafeAreaView>
    </LinearGradient >
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    flexDirection: "column",
    color: textColor,
    fontSize: 20,
    flexGrow: 1,
    backgroundColor: accentColor3,
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
  feedBackContainer: {
    flexDirection: "row",
    backgroundColor: accentColor3,
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 20,
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

})