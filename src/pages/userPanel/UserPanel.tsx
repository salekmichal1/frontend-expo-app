import { StyleSheet, Text, View } from "react-native";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function UserPanel() {
  const { state } = useAuthContext();
  return (
    <View style={styles.container}>
      <Text style={styles.userHeader}>User data:</Text>
      <Text style={styles.userParagraph}>Name: {state.user?.name}</Text>
      <Text style={styles.userParagraph}>Nickname: {state.user?.username}</Text>
      <Text style={styles.userParagraph}>Email: {state.user?.email}</Text>
      <Text style={styles.userParagraph}>
        Phone number: {state.user?.phone}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    marginLeft: 40,
  },
  userHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userParagraph: {
    fontSize: 16,
    marginBottom: 5,
  },
});
