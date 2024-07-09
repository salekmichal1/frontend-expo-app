import { Todo } from "../model/types";

import { DeleteIcon, EditIcon, DoneIcon, BlockIcon } from "../../assets/Svg";
import { useEffect, useRef, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useAuthContext } from "../hooks/useAuthContext";
import {
  Dimensions,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

export default function TodoList(todos: { todos: Todo[] }) {
  const { state } = useAuthContext();

  const [taskCompleted, setTaskCompleted] = useState<boolean>(false);

  const [todoUrlIdStatus, setTodoUrlIdStatus] = useState<number>();
  const [todoUrlIdEdit, setTodoUrlIdEdit] = useState<number>();

  const [editingTodoId, setEditingTodo] = useState<number | null>(null);
  const [editingTodoText, setEditingTodoText] = useState<string | null>(null);

  // const [todoPostId, setTodoPostId] = useState<number | null>(null);

  const [todoDeleteId, setTodoDeleteId] = useState<number | null>(null);

  const [todosArr, setTodosArr] = useState<Todo[]>(todos.todos);
  const ref = useRef<TextInput>(null);

  const { patchData: patchDataStatus } = useFetch<Todo>(
    `https://front-end-app-server.onrender.com/todos/${todoUrlIdStatus}`,
    "PATCH"
  );

  const { patchData: patchDataEdit } = useFetch<Todo>(
    `https://front-end-app-server.onrender.com/todos/${todoUrlIdEdit}`,
    "PATCH"
  );

  const { postData, data } = useFetch<Todo>(
    `https://front-end-app-server.onrender.com/todos/`,
    "POST"
  );

  const { deleteData } = useFetch<Todo>(
    `https://front-end-app-server.onrender.com/todos/${todoDeleteId}`,
    "DELETE"
  );

  // swtiching between todo status
  useEffect(() => {
    if (todoUrlIdStatus) {
      patchDataStatus({ completed: taskCompleted });
    }
  }, [todoUrlIdStatus, taskCompleted]);

  const handleEditStart = function (id: number) {
    setEditingTodo(id);
  };

  // use effect for focusing todo when starting editidng
  useEffect(() => {
    ref.current?.focus();
  }, [editingTodoId]);

  const handleEditdDoneLostFocus = function () {
    console.log(editingTodoText);

    if (editingTodoText) {
      patchDataEdit({ title: editingTodoText });
    }
    setEditingTodo(null);
    // setEditingTodoText(null);
  };

  useEffect(() => {
    if (todoDeleteId) {
      setTodosArr((prev) => prev.filter((todo) => todo.id !== todoDeleteId));
      deleteData();
    }
  }, [todoDeleteId]);

  const handleAddTodo = function () {
    // const lastTodoId = Math.max.apply(
    //   Math,
    //   todosArr.map(todo => todo.id)
    // );

    if (state.user?.id) {
      postData({
        userId: state.user.id,
        title: "",
        completed: false,
      });
    }
    console.log(data);

    // setTodoPostId(lastTodoId);
  };

  useEffect(() => {
    if (data) {
      setTodosArr((prev) => [...prev, data]);
    }
  }, [data]);

  // const handleDelete = function (id: number) {
  //   if (todoDeleteId) {
  //     setTodosArr(prev => prev.filter(todo => todo.id !== todoDeleteId));
  //     console.log(todosArr);

  //     // deleteData();
  //   }
  // };

  return (
    <View style={styles.todoList}>
      {todosArr.map((todo) => (
        <LinearGradient
          colors={["#39b385", "#9be15d"]}
          key={todo.id}
          style={styles.todo}
        >
          <View style={styles.todoIcons}>
            {todo.completed === true ? (
              <Pressable
                onPress={() => {
                  setTodoUrlIdStatus(todo.id);
                  setTaskCompleted(false);

                  todo.completed = false;
                }}
              >
                <BlockIcon width={24} height={24} fill={"#000"} />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setTodoUrlIdStatus(todo.id);
                  setTaskCompleted(true);

                  todo.completed = true;
                }}
              >
                <DoneIcon width={24} height={24} fill={"#000"} />
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                handleEditStart(todo.id);
                setTodoUrlIdEdit(todo.id);
              }}
            >
              <EditIcon width={24} height={24} fill={"#000"} />
            </Pressable>
            <Pressable
              onPress={() => {
                setTodoDeleteId(todo.id);
                // handleDelete(todo.id);
              }}
            >
              <DeleteIcon width={26} height={26} fill={"#000"} />
            </Pressable>
          </View>
          <Text>Status: {todo.completed ? "Finished" : "Unfinished"}</Text>

          {editingTodoId !== todo.id && <Text>Task: {todo.title}</Text>}
          {editingTodoId === todo.id && (
            <View style={styles.todoInputBox}>
              <Text>Task: </Text>
              <TextInput
                style={styles.todoInput}
                ref={ref}
                onFocus={(e) => setEditingTodoText(e.nativeEvent.text)}
                onChange={(e) => {
                  todo.title = e.nativeEvent.text;
                  setEditingTodoText(e.nativeEvent.text);
                }}
                defaultValue={todo.title}
                onBlur={handleEditdDoneLostFocus}
              />
            </View>
          )}
        </LinearGradient>
      ))}
      <Pressable style={styles.todoBtn} onPress={handleAddTodo}>
        <Text style={styles.todoBtnText}>Add todo</Text>
      </Pressable>
    </View>
  );
}

import { StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  todoList: {
    marginTop: 80,
    marginBottom: 80,
    flex: 1,
    justifyContent: "space-between",
    gap: 20,
  },
  todo: {
    width: 300,
    color: "#222",
    padding: 20,
    paddingBottom: 40,
    marginVertical: 10,
    borderRadius: 4,
    elevation: 4, // boxShadow equivalent in React Native for Android
    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
  },
  todoIcons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  todoIcon: {
    cursor: "pointer", // Note: 'cursor' is not supported in React Native. Interactivity is handled differently.
  },
  deleteIcon: {
    width: 30,
  },
  editIcon: {
    width: 24,
    marginRight: 2,
  },
  doneIcon: {
    width: 28,
    marginRight: 2,
  },
  blockIcon: {
    marginRight: 6,
    width: 24,
  },
  todoInputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4, // Note: 'gap' is not directly supported in React Native. Use margin or padding on child elements.
    marginTop: 6,
  },
  todoInput: {
    backgroundColor: "#444",
    color: "#fff",
    fontSize: 16,
    width: "100%",
    borderRadius: 4,
    padding: 6,
  },
  todoBtn: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // Add some elevation for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 10,
    backgroundColor: "#4CAF50",
  },
  todoBtnText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
