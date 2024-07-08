import { ScrollView } from "react-native";
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
    <View style={styles.container}>
      {error && <p>{error.toString()}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {data && <TodoList todos={data} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
});
