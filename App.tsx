import "react-native-gesture-handler";

import {
  DarkTheme,
  DefaultTheme,
  NavigationProp,
  NavigationContainer,
  NavigatorScreenParams,
  CompositeScreenProps,
} from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { PaperProvider } from "react-native-paper";
import { useColorScheme, StatusBar } from "react-native";
import {
  StackScreenProps,
  createStackNavigator,
} from "@react-navigation/stack";
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import SignIn from "./screens/SignIn";
import Orders from "./screens/Orders";
import Verify from "./screens/Verify";
import Settings from "./screens/Settings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useDriverStore from "./store/Driver";

export type RootStackParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>;
  Verify: { id: string };
  SignIn: undefined;
};

export type HomeTabParamList = {
  Orders: undefined;
  Setting: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MyTabs() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#177AD5",
        headerStyle: {
          backgroundColor: isDarkMode ? "black" : "white",
        },
        tabBarStyle: {
          backgroundColor: isDarkMode ? "black" : "white",
        },
      }}
    >
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const queryClient = new QueryClient();
export default function App() {
  const isDarkMode = useColorScheme() === "dark";
  const driver = useDriverStore((state) => state.driver);
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={{ colors: { primary: "#177AD5" } }}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={isDarkMode ? "black" : "white"}
        />
        <NavigationContainer
          theme={
            isDarkMode
              ? DarkTheme
              : {
                  ...DefaultTheme,
                  colors: { ...DefaultTheme.colors, background: "white" },
                }
          }
        >
          <Stack.Navigator>
            {driver ? (
              <>
                <Stack.Screen
                  name="Home"
                  component={MyTabs}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Verify"
                  component={Verify}
                  options={{
                    headerStyle: {
                      backgroundColor: isDarkMode ? "black" : "white",
                    },
                  }}
                />
              </>
            ) : (
              <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{ headerShown: false }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
