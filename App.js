import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";

import Home from "./screens/home";
import { Ionicons,Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import BusinessInfo from "./screens/business";
import Account from "./screens/account";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BusinessList from "./screens/bizlist";

import { accentColor1, accentColor2, accentColor3, accentColor4, accentColor7, textColor, textColor2, textColor3 } from "./styles/main";
import MyBusinessList from "./screens/mybiz";
import LikedBusiness from "./screens/likes";
import NewBusiness from "./screens/newbiz";
import EditBusiness from "./screens/editbiz";
import Login from "./screens/login";
import Signup from "./screens/signup";
import Root from "./screens/root";
import ChangePassword from "./screens/changepass";
import VerifyEmail from "./screens/verifyemail";
import SupportPage from "./screens/support";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false, headerStyle: { backgroundColor: accentColor7, },
            headerTitleStyle: { color: textColor2 }
          }}
          initialRouteName="Root">
          <Stack.Screen options={{ headerShown: true }} name="Login" component={Login} />
          <Stack.Screen options={{ headerShown: true }} name="Signup" component={Signup} />
          <Stack.Screen options={{ headerShown: true }} name="Change Password" component={ChangePassword} />
          <Stack.Screen options={{ headerShown: true }} name="Verify Email" component={VerifyEmail} />
          <Stack.Screen options={{ headerShown: true }} name="Support" component={SupportPage} />
          <Stack.Screen name="Root" component={Root} />
          <Stack.Screen name="MainScreen" component={MainScreen} />
          <Stack.Screen name="BusinessList" component={BusinessList} />
          <Stack.Screen name="NewBusiness" component={NewBusiness} />
          <Stack.Screen name="EditBusiness" component={EditBusiness} />
          <Stack.Screen name="BusinessDetails" component={BusinessInfo} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </>
  );
}

function MainScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: "white", fontWeight: "900" }}>
            {focused && "_"}
          </Text>
        ),
        tabBarItemStyle: { top: 18 },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={focused ? 35 : 30}
              style={focused && styles.tabIconShadow}
              color={focused ? "white" : accentColor4}
            />
          ),
        }}
        component={Home}
      />
      <Tab.Screen
        name="MyBusinessList"
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo name="shop"
              size={focused ? 35 : 30}
              style={focused && styles.tabIconShadow}
              color={focused ? "white" : accentColor4}
            />
          ),
        }}
        component={MyBusinessList}
      />
      <Tab.Screen
        name="Likes"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={
                focused
                  ? "heart"
                  : "heart-outline"
              }
              size={focused ? 35 : 30}
              style={focused && styles.tabIconShadow}
              color={focused ? "white" : accentColor4}
            />
          ),
        }}
        component={LikedBusiness}
      />

      <Tab.Screen
        name="Account"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "ios-person" : "ios-person-outline"}
              size={focused ? 35 : 30}
              style={focused && styles.tabIconShadow}
              color={focused ? "white" : accentColor4}
            />
          ),
        }}
        component={Account}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconShadow: {
    shadowColor: "white",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 10,
    shadowRadius: 10,
  },
  tabBar: {
    position: "absolute",
    backgroundColor: accentColor3,
    borderTopWidth: 0,
    left: 20,
    right: 20,
    height: 80,
    elevation: 0,
    borderRadius: 20,
    bottom: 30,
  },
});