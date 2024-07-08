import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Comments from "./../../components/Comments";
import PostsSearch from "./../../components/PostsSearch";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFetch } from "../../hooks/useFetch";
import { Comment, Post, UserElement } from "../../model/types";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";

export default function Posts() {
  const { state } = useAuthContext();
  const [postForDeleteId, setPostForDeleteId] = useState<number>();
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

  useEffect(() => {
    deleteComments();
    getPosts();
  }, [postDeleteData]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.postsHead}>Posts</Text>
      <View style={styles.postsControls}>
        <PostsSearch />
        <TouchableOpacity
          style={styles.createPostBtn}
          onPress={() => navigation.dispatch(CommonActions.navigate("CreatePost"))}
        >
          <Text>Add post</Text>
        </TouchableOpacity>
      </View>
      {postsIsPending && usersPending && <p className="loading">Loading...</p>}
      {postsError && usersError && (
        <Text>
          {postsError.toString()}, {usersError.toString()}
        </Text>
      )}
      <View style={styles.posts}>
        {postsData &&
          usersData &&
          postsData.map((post) => (
            <View key={post.id} style={styles.postItem}>
              <Text style={styles.postItemTitle}>Title: {post.title}</Text>
              <Text style={styles.postItemContent}>{post.body}</Text>
              <Text>
                Post created by: #
                {usersData.some((user) => user.id === post.userId)
                  ? usersData
                      .filter((user) => user.id === post.userId)
                      .map((user) => user.username)
                  : "Anonymous"}
              </Text>
              {state.user?.id === post.userId && (
                <>
                  <TouchableOpacity
                    style={styles.postItemBtn}
                    onPress={() => null}
                  >
                    <Text>Edit post</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.postItemBtn}
                    onPress={() => handleDelete(post.id)}
                  >
                    <Text>Delete post</Text>
                  </TouchableOpacity>
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
              {!commentsData && <p className="loading">No comments to load</p>}
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postsHead: {
    color: "#f5f5f5",
    textAlign: "center",
    marginTop: 20,
    fontSize: 36,
  },
  postsControls: {
    margin: 20,
    alignSelf: "center",
  },
  createPostBtn: {
    alignSelf: "center",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#007bff", // Adjust as needed
    borderRadius: 4,
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
    marginTop: 10,
    marginRight: 16,
    backgroundColor: "#007bff", // Adjust as needed
    padding: 10,
    borderRadius: 4,
  },
});
