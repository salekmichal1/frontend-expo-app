import React, { useState } from "react";
import { Button, Input, Text } from "react-native-elements";
import { useLogin } from "../../hooks/useLogin";
import { GestureResponderEvent, View } from "react-native";
import { StyleSheet } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPasswrod] = useState("");
  const { login, error, isPending } = useLogin();
  const handleLogin = function (e: GestureResponderEvent) {
    e.preventDefault();
    login(email, password);
  };
  const navigation = useNavigation();

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
      {!isPending && <Button title="Login" onPress={handleLogin} />}
      {isPending && <Button title="Loading" />}
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
});
