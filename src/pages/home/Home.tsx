import { ScrollView, Text } from "react-native";
import TodoList from "../../components/TodoList";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFetch } from "../../hooks/useFetch";
import { Todo } from "../../model/types";
import { View } from "react-native";
import { StyleSheet } from "react-native";

export default function Home() {
  const { state } = useAuthContext();
  const { data, isPending, error } = useFetch<Todo[]>(
    `https://front-end-app-server.onrender.com/todos?userId=${state.user?.id}`
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text>{error.toString()}</Text>}
      {isPending && <Text>Loading...</Text>}
      {data && <TodoList todos={data} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
