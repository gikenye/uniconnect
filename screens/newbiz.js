import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { HapticButton } from "../components/haptic";
import { useEffect, useState } from "react";
import { accentColor5, accentColor7, accentColor8, textColor, textColor2, textColor3, textColorAlt } from "../styles/main";
import { dumCategories } from "./home";
import { SelectList } from 'react-native-dropdown-select-list'
import * as ImagePicker from 'expo-image-picker';
import { Header } from "../components/header";
import { CREATE_BUSINESS } from "../graphql/mutations";
import { BusinessTypes } from "../types/types";
import { capitalize } from "../constants";
import { GetStoredUserToken } from "../storage";
import { useNavigation } from "@react-navigation/native";
import { UploadFile } from "../graphql/network";


export const typedata = BusinessTypes.map((t) => ({ key: t.toUpperCase(), value: capitalize(t.toLowerCase()) }))

export default function NewBusiness() {
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

  async function AddMyBusiness() {
    const response = await CREATE_BUSINESS(input)
    if (response?.CreateBusiness) {
      Alert.alert("New Business added")
      navigation.navigate("MainScreen", { screen: "Home" })
    }
  }


  async function PickImage() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setInput({ ...input, image: result.assets[0].uri })
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function SetToken() {
      const token = await GetStoredUserToken(navigation);
      setInput({ ...input, token: token })
    }
    SetToken()
  }, [])


  return (
    <SafeAreaView style={{ backgroundColor: accentColor7, flex: 1 }}>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}>
          {input.image ?
            <>
              <Image
                source={{ uri: input.image }}
                resizeMode="cover"
                style={{ height: 300, width: Dimensions.get("screen").width }}
              >
              </Image>
              <TouchableOpacity style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 15 }} onPress={() => setInput({ ...input, image: "" })}>
                <EvilIcons name="trash" size={24} color={textColor3} />
                <Text style={{ color: textColor3 }}>Remove image</Text>
              </TouchableOpacity>
            </>
            :
            <View style={{ height: 300, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: textColor3 }}>No Photo Selected</Text>
            </View>
          }

          <View style={{ marginHorizontal: 10, paddingBottom: 30, marginTop: 15, }}>
            <TouchableOpacity onPress={() => PickImage()} style={{ padding: 10, backgroundColor: accentColor5, borderRadius: 25 }}>
              <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
                Select an Image or logo for your business
              </Text>
            </TouchableOpacity>

            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Choose the Type of Business</Text>
            <SelectList
              boxStyles={{ backgroundColor: accentColor8, borderWidth: 0, paddingVertical: 15 }}
              inputStyles={{ color: textColor2, fontSize: 20, marginLeft: 10 }}
              dropdownStyles={{ backgroundColor: accentColor8, borderWidth: 0 }}
              dropdownTextStyles={{ color: textColor2, fontSize: 18 }}
              dropdownItemStyles={{ width: "100%" }}
              arrowicon={<EvilIcons name="chevron-down" size={24} color={textColor2} />}
              searchicon={<EvilIcons name="search" size={24} color={textColor2} />}
              closeicon={<EvilIcons name="chevron-up" size={24} color={textColor2} />}
              setSelected={(e) => setInput({ ...input, type: e })} data={typedata}
            />
            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Business Name</Text>
            <TextInput onChangeText={(e) => setInput({ ...input, name: e })} placeholder="Name of your business" placeholderTextColor={textColor2} style={styles.detailsContainer} />

            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Description</Text>
            <TextInput placeholder="Business description" onChangeText={(e) => setInput({ ...input, description: e })} placeholderTextColor={textColor2} numberOfLines={4} style={styles.detailsContainer} />

            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Location</Text>
            <TextInput placeholder="Where the business is located" onChangeText={(e) => setInput({ ...input, location: e })} placeholderTextColor={textColor2} style={styles.detailsContainer} />

            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>Website (optional)</Text>
            <TextInput placeholder="Website for your business (Optional)" onChangeText={(e) => setInput({ ...input, website: e })} placeholderTextColor={textColor2} style={styles.detailsContainer} />

            <Text style={{ color: textColor3, marginBottom: 10, marginTop: 20 }}>WhatsApp Business Contact</Text>
            <TextInput keyboardType="phone-pad" placeholder="254xxxxxxxx" onChangeText={(e) => setInput({ ...input, contact: e })} placeholderTextColor={textColor2} style={styles.detailsContainer} />


            <TouchableOpacity style={styles.createButton} onPress={() => AddMyBusiness()}>
              <Text style={styles.createButtonText}>Create Business</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView >
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
})