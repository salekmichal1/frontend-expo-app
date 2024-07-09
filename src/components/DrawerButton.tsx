import { View, Button } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

const DrawerButton = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* Render the original drawer items */}
      <DrawerItemList {...props} />
      {/* Add your additional button */}
      <View style={{ padding: 20 }}>
        <Button
          title="Your Button Title"
          onPress={() => {
            // Handle your button press here
            console.log("Button pressed");
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
};
