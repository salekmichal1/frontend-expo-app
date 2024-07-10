import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Button,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { useSignup } from "../../hooks/useSignup";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPasswrod] = useState("");
  const [passwordConfirm, setPasswrodConfirm] = useState("");
  const [nickname, setNick] = useState("");
  const [phone, setPhone] = useState("");

  const { signup, error, isPending } = useSignup();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = function (e: GestureResponderEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      alert("Invalid email address");
      return;
    }

    signup(email, password, passwordConfirm, nickname, phone);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h2>Sign up</Text>
      <View style={styles.label}>
        <Text style={styles.span}>Nickname:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNick}
          value={nickname}
          autoCapitalize="none"
        />
      </View>
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
        <Text style={styles.span}>Phone:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPhone}
          value={phone}
          keyboardType="phone-pad"
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
      <View style={styles.label}>
        <Text style={styles.span}>Confirm Password:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPasswrodConfirm}
          value={passwordConfirm}
          secureTextEntry={true}
          autoCapitalize="none"
        />
      </View>

      {!isPending && (
        <Pressable style={styles.btn} onPress={handleSignUp}>
          <Text style={styles.btnText}>Sign Up</Text>
        </Pressable>
      )}
      {isPending && (
        <Pressable style={styles.btn} disabled>
          <Text style={styles.btnText}>Loading</Text>
        </Pressable>
      )}
      {error && <Text>{error.toString()}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    color: "#f5f5f5",
    flexGrow: 1,
    padding: 40,
  },
  label: {
    margin: 10,
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
