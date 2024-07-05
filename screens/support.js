import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { accentColor1, accentColor5, textColor } from "../styles/main";

export default function SupportPage({ navigation }) {
  async function openDialScreen() {
    let number = "";
    if (Platform.OS === "ios") {
      number = `telprompt:254113359777`;
    } else {
      number = `tel:254113359777`;
    }
    Linking.openURL(number)
      .then(() => { })
      .catch((err) => console.log(err));
  }

  async function openEmailScreen() {
    Linking.openURL(
      `mailto:mailto@uniconnect@gmail.com?subject=Help&body=I have a question`
    )
      .then(() => { })
      .catch((err) => console.log(err));
  }

  async function openPdf() {
    return Linking.canOpenURL("")
      .then((supported) => {
        if (supported) {
          return Linking.openURL("");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  }

  return (
    <ScrollView
      style={{ backgroundColor: accentColor1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ margin: 20 }}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 10,
            fontWeight: "bold",
            color: textColor
          }}
        >
          Support
        </Text>
        <Text style={{
          color: textColor
        }}>
          If you have any questions or concerns, please contact us here
        </Text>
      </View>

      <SupportOption
        icon={"email-outline"}
        title="Send us an E-mail"
        subtitle={"uniconnect@gmail.com"}
        onOptionClick={() => openEmailScreen()}
      />

      <SupportOption
        icon="phone-outline"
        title="Call Us"
        subtitle={"Mobile Number +254113359777"}
        onOptionClick={() => openDialScreen()}
      />

      <SupportOption
        icon="file-document-outline"
        title="Terms and Conditions"
        subtitle="Terms & Conditions and Privacy Policies"
        onOptionClick={() => openPdf()}
      />
    </ScrollView>
  );
}

function SupportOption({ icon, title, subtitle, onOptionClick }) {
  return (
    <TouchableOpacity onPress={onOptionClick} style={styles.supportOption}>
      <View style={styles.supportOptionIcon}>
        <MaterialCommunityIcons name={icon} size={25} color="white" />
      </View>
      <View style={{ flexDirection: "column", marginStart: 15 }}>
        <Text style={{ fontSize: 16, color: textColor }}>{title}</Text>
        <Text style={{ color: textColor }}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  supportOption: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "rgba(100,100,100,0.1)",
    alignItems: "center",
  },
  supportOptionIcon: {
    backgroundColor: accentColor5,
    padding: 10,
    borderRadius: 10,
  },
})