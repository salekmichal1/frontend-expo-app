import React, { useState } from "react";
import { Button, Input, Text } from "react-native-elements";
import { useLogin } from "../../hooks/useLogin";
import { GestureResponderEvent, Pressable, View } from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPasswrod] = useState("");
  const { login, error, isPending } = useLogin();
  const handleLogin = function (e: GestureResponderEvent) {
    e.preventDefault();
    login(email, password);
  };

  return (
    <View style={styles.container}>
      <Text h2>Login</Text>
      <View style={styles.label}>
        <Text style={styles.span}>Email:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.label}>
        <Text style={styles.span}>Password:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPasswrod}
          value={password}
          secureTextEntry={true}
          autoCapitalize="none"
        />
      </View>

      {!isPending && (
        <Pressable style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Login</Text>
        </Pressable>
      )}
      {isPending && (
        <Pressable style={styles.btn} disabled>
          <Text style={styles.btnText}>Loading</Text>
        </Pressable>
      )}
      {error && <Text>{error.toString()}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    color: "#f5f5f5",
    margin: 40,
    flex: 1,
  },
  label: {
    margin: 30,
  },
  span: {
    marginBottom: 6,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, //  elevation for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 10,
    backgroundColor: "#4CAF50",
  },
  btnText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
