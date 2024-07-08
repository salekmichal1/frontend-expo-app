import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import Home from "./src/pages/home/Home";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useAuthContext } from "./src/hooks/useAuthContext";
import Albums from "./src/pages/albums/Albums";
import Login from "./src/pages/login/Login";
import Signup from "./src/pages/signup/Signup";
import CreatePosts from "./src/pages/createPosts/createPosts";
import Posts from "./src/pages/posts/Posts";

export default function App() {
  const Drawer = createDrawerNavigator();
  const { state } = useAuthContext();
  return (
    <NavigationContainer>
      {state.authIsReady && (
        <Drawer.Navigator initialRouteName="Home">
          {state.user ? (
            <>
              <Drawer.Screen name="Home" component={Home} />
              <Drawer.Screen name="Albums" component={Albums} />
              <Drawer.Screen name="CreatePosts" component={CreatePosts} />
              <Drawer.Screen name="Posts" component={Posts} />
            </>
          ) : (
            <>
              <Drawer.Screen name="Login" component={Login} />
              <Drawer.Screen name="Signup" component={Signup} />
            </>
          )}
        </Drawer.Navigator>
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
