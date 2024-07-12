import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text } from "react-native";
import Home from "./src/pages/home/Home";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useAuthContext } from "./src/hooks/useAuthContext";
import Albums from "./src/pages/albums/Albums";
import Login from "./src/pages/login/Login";
import Signup from "./src/pages/signup/Signup";
import CreatePosts from "./src/pages/createPosts/CreatePosts";
import Posts from "./src/pages/posts/Posts";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { View } from "react-native";
import { useLogout } from "./src/hooks/useLogout";
import CreateAlbums from "./src/pages/createAlbums/CreateAlbums";
import UserPanel from "./src/pages/userPanel/UserPanel";

const CustomDrawerContent = (props: any) => {
  const { state } = useAuthContext();
  const { logout } = useLogout();
  return (
    <DrawerContentScrollView {...props}>
      {/* Render the original drawer items */}
      <DrawerItemList {...props} />
      {/* Add your additional button */}
      {state.user && (
        <View style={{ padding: 20 }}>
          <Pressable
            style={{ backgroundColor: "#D32F2F", padding: 10, borderRadius: 5 }}
            onPress={logout}
          >
            <Text style={{ color: "#fff" }}>Logout</Text>
          </Pressable>
        </View>
      )}
    </DrawerContentScrollView>
  );
};

export default function App() {
  const Drawer = createDrawerNavigator();
  const { state } = useAuthContext();

  return (
    <NavigationContainer>
      {state.authIsReady && (
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          {state.user ? (
            <>
              <Drawer.Screen name="Home" component={Home} />
              <Drawer.Screen name="Albums" component={Albums} />
              <Drawer.Screen
                name="CreateAlbums"
                component={CreateAlbums}
                initialParams={{
                  locationPath: "createAlbum",
                  id: null,
                }}
              />

              <Drawer.Screen name="Posts" component={Posts} />
              <Drawer.Screen
                name="CreatePosts"
                initialParams={{
                  locationPath: "createPost",
                  id: null,
                }}
                component={CreatePosts}
              />
              <Drawer.Screen name="UserPanel" component={UserPanel} />
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
