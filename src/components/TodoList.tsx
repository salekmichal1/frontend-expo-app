import { Todo } from "../model/types";

import { DeleteIcon, EditIcon, DoneIcon, BlockIcon } from "../../assets/Svg";
import { useEffect, useRef, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useAuthContext } from "../hooks/useAuthContext";
import { ScrollView, TextInput, View } from "react-native";

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

  const handleEditdDone = function (e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter") {
      console.log(editingTodoText);

      if (editingTodoText) {
        patchDataEdit({ title: editingTodoText });
      }
      setEditingTodo(null);
      // setEditingTodoText(null);
    }
  };

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
    <ScrollView
      style={{ width: "100%" }}
      contentContainerStyle={styles.todoList}
    >
      {todosArr.map((todo) => (
        <View key={todo.id} style={styles.todo}>
          <View style={styles.todoIcons}>
            {todo.completed === true ? (
              <BlockIcon
                width={24}
                onClick={() => {
                  setTodoUrlIdStatus(todo.id);
                  setTaskCompleted(false);

                  todo.completed = false;
                }}
              />
            ) : (
              <DoneIcon
                width={28}
                onClick={() => {
                  setTodoUrlIdStatus(todo.id);
                  setTaskCompleted(true);

                  todo.completed = true;
                }}
              />
            )}
            <EditIcon
              width={24}
              onClick={() => {
                handleEditStart(todo.id);
                setTodoUrlIdEdit(todo.id);
              }}
            />
            <DeleteIcon
              width={30}
              onClick={() => {
                setTodoDeleteId(todo.id);
                // handleDelete(todo.id);
              }}
            />
          </View>
          <p>Status: {todo.completed ? "Finished" : "Unfinished"}</p>

          {editingTodoId !== todo.id && <p>Task: {todo.title}</p>}
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
                // onKeyDown={handleEditdDone}
                onBlur={handleEditdDoneLostFocus}
              />
            </View>
          )}
        </View>
      ))}
      <button style={styles.todoBtn} onClick={handleAddTodo}>
        Add todo
      </button>
    </ScrollView>
  );
}

import { StyleSheet } from "react-native";
import { Text } from "react-native-elements";

const styles = StyleSheet.create({
  todoList: {
    marginTop: 80,
    marginBottom: 80,
    alignItems: "center",
  },
  todo: {
    width: 300,
    color: "#222",
    backgroundColor: "linear-gradient(to top left, #39b385, #9be15d)", // Note: LinearGradient needs to be implemented using a separate component in React Native
    padding: 20,
    paddingBottom: 40,
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
    fontFamily: "Poppins, sans-serif", // Ensure the font is available in your React Native project
  },
  todoBtn: {
    width: 340,
    backgroundColor: "linear-gradient(to top left, #e52a5a, #ff585f)", // Note: LinearGradient needs to be implemented using a separate component in React Native
    color: "#fff",
    fontSize: 16,
    borderRadius: 4,
    fontFamily: "Poppins, sans-serif", // Ensure the font is available
    minHeight: 150,
    elevation: 4, // boxShadow equivalent in React Native for Android
    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
  },
});
