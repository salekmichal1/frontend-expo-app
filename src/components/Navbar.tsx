// import React, { useState } from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { Icon } from "react-native-elements";

// export default function Navbar({ navigation }: { navigation: any }) {
//   // const navigation = useNavigation();
//   const [isExpanded, setExpanded] = useState(false);
//   const state = { user: null }; // replace this with your actual state

//   const toggleExpanded = () => {
//     setExpanded(!isExpanded);
//   };

//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         justifyContent: "space-between",
//         padding: 20,
//         backgroundColor: "#39b385",
//       }}
//     >
//       <TouchableOpacity onPress={() => navigation.navigate("Home")}>
//         <Text style={{ fontSize: 18, color: "#fff" }}>Home</Text>
//       </TouchableOpacity>
//       {state.user ? (
//         <View style={{ flexDirection: "row" }}>
//           <TouchableOpacity onPress={() => navigation.navigate("Album")}>
//             <Text style={{ fontSize: 18, color: "#fff", marginLeft: 10 }}>
//               Album
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.navigate("Posts")}>
//             <Text style={{ fontSize: 18, color: "#fff", marginLeft: 10 }}>
//               Posts
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               /* handle logout here */
//             }}
//           >
//             <Text style={{ fontSize: 18, color: "#fff", marginLeft: 10 }}>
//               Logout
//             </Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <View style={{ flexDirection: "row" }}>
//           <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//             <Text style={{ fontSize: 18, color: "#fff", marginLeft: 10 }}>
//               Login
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
//             <Text style={{ fontSize: 18, color: "#fff", marginLeft: 10 }}>
//               Signup
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}
//       <TouchableOpacity onPress={toggleExpanded}>
//         <Icon name={isExpanded ? "close" : "menu"} size={30} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );
// }
