import { useCallback, useEffect, useState } from "react";
import Comments from "./../../components/Comments";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFetch } from "../../hooks/useFetch";
import { Comment, Post, UserElement } from "../../model/types";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { TextInput } from "react-native";

export default function Posts() {
  const { state } = useAuthContext();
  const [postForDeleteId, setPostForDeleteId] = useState<number>();
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useNavigation();
  const {
    getData: getPosts,
    data: postsData,
    isPending: postsIsPending,
    error: postsError,
  } = useFetch<Post[]>("https://front-end-app-server.onrender.com/posts");

  const { deleteData: deltePosts, data: postDeleteData } = useFetch<Post>(
    `https://front-end-app-server.onrender.com/posts/${postForDeleteId}`,
    "DELETE"
  );

  const {
    data: usersData,
    isPending: usersPending,
    error: usersError,
  } = useFetch<UserElement[]>(
    "https://front-end-app-server.onrender.com/users"
  );

  const {
    getData: getComments,
    data: commentsData,
    isPending: commentsPending,
    error: commentsError,
  } = useFetch<Comment[]>("https://front-end-app-server.onrender.com/comments");

  const handleDelete = function (postId: number) {
    setPostForDeleteId(postId);
    getComments();
    deltePosts();
  };

  const deleteComments = async function () {
    const commentsForDelete = commentsData?.filter(
      (comment) => comment.postId === postForDeleteId
    );

    try {
      if (commentsForDelete) {
        for (let i = 0; i < commentsForDelete.length; i++) {
          const resCommentsDelete = await fetch(
            `https://front-end-app-server.onrender.com/comments/${commentsForDelete[i].id}`,
            {
              method: "DELETE",
            }
          );
          if (!resCommentsDelete.ok) {
            throw Error(resCommentsDelete.statusText);
          }
          const dataCommentsDelete: string = await resCommentsDelete.json();
          console.log(dataCommentsDelete);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      getPosts();

      return () => {
        isActive = false; // Component is unmounted, set isActive to false
      };
    }, [])
  );

  useEffect(() => {
    deleteComments();
    getPosts();
  }, [postDeleteData]);

  const filteredPosts = postsData?.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search posts by title..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <Text style={styles.postsHead}>Posts</Text>
      <View style={styles.postsControls}>
        <Pressable
          style={styles.postItemBtn}
          onPress={() =>
            navigation.dispatch(
              CommonActions.navigate({
                name: "CreatePosts",
                params: {
                  locationPath: "createPost",
                },
              })
            )
          }
        >
          <Text style={styles.postBtnText}>Add post</Text>
        </Pressable>
      </View>
      {postsIsPending && usersPending && <Text>Loading...</Text>}
      {postsError && usersError && (
        <Text>
          {postsError.toString()}, {usersError.toString()}
        </Text>
      )}
      <View style={styles.posts}>
        {filteredPosts &&
          usersData &&
          filteredPosts.map((post) => (
            <View key={post.id} style={styles.postItem}>
              <Text style={styles.postItemTitle}>Title: {post.title}</Text>
              <Text style={styles.postItemContent}>{post.body}</Text>
              <Text style={styles.postItemContent}>
                Post created by: #
                {usersData.some((user) => user.id === post.userId)
                  ? usersData
                      .filter((user) => user.id === post.userId)
                      .map((user) => user.username)
                  : "Anonymous"}
              </Text>
              {state.user?.id === post.userId && (
                <>
                  <Pressable
                    style={styles.postItemBtn}
                    onPress={() =>
                      navigation.dispatch(
                        CommonActions.navigate({
                          name: "CreatePosts",
                          params: {
                            locationPath: "edit",
                            id: post.id,
                          },
                        })
                      )
                    }
                  >
                    <Text style={styles.postBtnText}>Edit post</Text>
                  </Pressable>
                  <Pressable
                    style={styles.postItemBtn}
                    onPress={() => handleDelete(post.id)}
                  >
                    <Text style={styles.postBtnText}>Delete post</Text>
                  </Pressable>
                </>
              )}
              {/* {commentsData &&
                commentsData.some(comment => comment.postId === post.id)
                  ? commentsData
                      .filter(comment => comment.postId === post.id)
                      .map(comment => <p className=''> {comment.body} </p>)
                  : 'No comment'} */}
              {commentsData && (
                <Comments
                  postId={post.id}
                  commentsData={commentsData}
                  commentsPending={commentsPending}
                  commentsError={commentsError}
                />
              )}
              {!commentsData && <Text>No comments to load</Text>}
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
  },
  searchInput: {
    color: "#333",
    padding: 8,
    marginTop: 20,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    backgroundColor: "#fff",
    height: 44,
    width: windowWidth * 0.7,
  },
  postsHead: {
    color: "#222",
    textAlign: "center",
    marginTop: 20,
    fontSize: 36,
  },
  postsControls: {
    margin: 20,
  },

  posts: {
    width: "100%",
  },
  postItem: {
    backgroundColor: "#616161",
    color: "#f5f5f5",
    padding: 20,
    borderRadius: 4,
    marginVertical: 40,
    marginHorizontal: 16,
  },
  postItemTitle: {
    marginBottom: 10,
    fontSize: 24,
    color: "#f5f5f5",
  },
  postItemContent: {
    marginBottom: 20,
    fontSize: 14,
    color: "#f5f5f5",
  },
  postItemBtn: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // elevation for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 10,
    backgroundColor: "#4CAF50",
  },
  postBtnText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
