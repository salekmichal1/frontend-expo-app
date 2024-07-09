import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFetch } from "../../hooks/useFetch";
import { Post } from "../../model/types";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native";

export default function CreatePost({ route }: { route: any }) {
  const [title, setTitle] = useState<string>("");
  const [postUserId, setPostUserId] = useState<number>();
  const [content, setContent] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const navigation = useNavigation();
  const { locationPath, id } = route.params;
  console.log(locationPath, id);

  useEffect(() => {
    setIsPending(true);

    const fetchData = async function () {
      try {
        const res = await fetch(
          "https://front-end-app-server.onrender.com/posts/" + id
        );

        if (!res.ok) {
          throw Error(res.statusText);
        }
        const data: Post = await res.json();

        setTitle(data.title);
        setContent(data.body);
        setPostUserId(data.userId);
        setError(null);
        setIsPending(false);
      } catch (err: any) {
        console.error(err.message);
        setError(err.message);
        setIsPending(false);
      }
    };

    if (locationPath === "edit") {
      fetchData();
    } else {
      setTitle("");
      setContent("");
      setIsPending(false);
    }
  }, [locationPath, id]);

  const { patchData, data } = useFetch<Post>(
    "https://front-end-app-server.onrender.com/posts/" + id,
    "PATCH"
  );
  const handleSubmit = function () {
    patchData({
      title: title,
      body: content,
    });
  };

  useEffect(() => {
    if (data) {
      navigation.dispatch(
        CommonActions.navigate({
          name: "Posts",
        })
      );
    }
  }, [data]);

  return (
    // <div>
    //   {error && <p>{error.message}</p>}
    //   {isPending && <p className="loading">Loading...</p>}
    //   {!isPending &&
    //     (state.user?.id === postUserId || locationPath === "createPost") && (
    //       <div className={style.create}>
    //         <h2 className={style["create-post-head"]}> Add new post</h2>
    //         <form onSubmit={handleSubmit}>
    //           <label>
    //             <span>Post title: </span>
    //             <input
    //               type="text"
    //               value={title}
    //               onChange={(e) => setTitle(e.target.value)}
    //               required
    //             />
    //           </label>
    //           <label>
    //             <span>Post content: </span>
    //             <textarea
    //               rows={10}
    //               value={content}
    //               onChange={(e) => setContent(e.target.value)}
    //               required
    //             />
    //           </label>
    //           <button className={`btn ${style.create__btn}`}>Submit</button>
    //         </form>
    //       </div>
    //     )}
    //   {!isPending &&
    //     state.user?.id !== postUserId &&
    //     locationPath !== "createPost" && (
    //       <div>
    //         <h2 className={style["create-post-head"]}>Access denied</h2>
    //       </div>
    //     )}
    // </div>
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text>{error.message}</Text>}
      {isPending && <Text>Loading...</Text>}
      {!isPending && (
        <View style={styles.create}>
          <Text style={styles.createPostHead}>Add new post</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Post title"
          />
          <TextInput
            style={[styles.input, styles.textarea]}
            value={content}
            onChangeText={setContent}
            placeholder="Post content"
            multiline
            numberOfLines={4}
          />
          <Pressable style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Submit</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createPostHead: {
    color: "#f5f5f5",
    textAlign: "center",
    marginTop: 20,
    fontSize: 36,
  },
  create: {
    color: "#f5f5f5",
    margin: 40,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  textarea: {
    minHeight: 100,
  },
  btn: {
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
  btnText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

// const CreateEditPost = ({ route, navigation }) => {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [isEditing, setIsEditing] = useState(false);

//   // Determine if editing or creating based on route params
//   useEffect(() => {
//     if (route.params?.postId) {
//       setIsEditing(true);
//       // Load post data for editing
//       // This is a placeholder, replace with your actual data loading logic
//       setTitle('Existing Post Title');
//       setContent('Existing Post Content');
//     }
//   }, [route.params?.postId]);

//   const handleSubmit = async () => {
//     if (isEditing) {
//       // Call API to edit post
//       console.log('Editing post with title:', title);
//     } else {
//       // Call API to create post
//       console.log('Creating post with title:', title);
//     }
//     // After submission, navigate back or show success message
//   };

//   return (
//     <View>
//       <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
//       <TextInput placeholder="Content" value={content} multiline onChangeText={setContent} />
//       <Button title={isEditing ? 'Edit Post' : 'Create Post'} onPress={handleSubmit} />
//       {/* Error message display logic here */}
//     </View>
//   );
// };
