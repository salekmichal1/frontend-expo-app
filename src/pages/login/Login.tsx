import React, { useState } from "react";
import { Button, Input, Text } from "react-native-elements";
import { useLogin } from "../../hooks/useLogin";
import { GestureResponderEvent, View } from "react-native";
import { StyleSheet } from "react-native";

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
        <Input
          inputStyle={styles.input}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.label}>
        <Text style={styles.span}>Password:</Text>
        <Input
          inputStyle={styles.input}
          onChangeText={setPasswrod}
          value={password}
          secureTextEntry={true}
          autoCapitalize="none"
        />
      </View>
      {!isPending && <Button title="Login" onPress={handleLogin} />}
      {isPending && <Button title="Loading" />}
      {error && <Text>{error.toString()}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    color: "#f5f5f5",
    maxWidth: 300,
    margin: 40,
    alignSelf: "center",
  },
  label: {
    display: "flex",
    margin: 30,
  },
  span: {
    display: "flex",
    marginBottom: 6,
  },
  input: {
    color: "#333",
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    borderColor: "#d4d4d4",
    backgroundColor: "#fff",
    width: "100%",
    fontFamily: "Poppins, sans-serif",
  },
});
