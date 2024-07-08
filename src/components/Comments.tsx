// import { Fragment, useEffect, useState } from "react";
// import { useAuthContext } from "../hooks/useAuthContext";
// import { useFetch } from "../hooks/useFetch";
// import { Comment } from "../model/types";

// export default function Comments({
//   postId,
//   commentsData,
//   commentsPending,
//   commentsError,
// }: {
//   postId: number;
//   commentsData: Comment[];
//   commentsPending: boolean;
//   commentsError: String | Error | null;
// }) {
//   const { state } = useAuthContext();
//   const [commentDataState, setCommentDataState] =
//     useState<Comment[]>(commentsData);
//   const [comment, setComment] = useState<string>();
//   const { postData, data } = useFetch<Comment>(
//     "https://front-end-app-server.onrender.com/comments",
//     "POST"
//   );

//   const handleSubmit = function (e: React.SyntheticEvent) {
//     e.preventDefault();
//     postData({
//       postId: postId,
//       name: "",
//       email: state.user?.email,
//       body: comment,
//     });
//     setComment("");
//   };

//   useEffect(() => {
//     if (data) {
//       setCommentDataState((prev) => [...prev, data]);
//     }
//   }, [data]);

//   return (
//     <div className={style["comments-container"]}>
//       <h2>Comments:</h2>
//       <div className={style.comments}>
//         {commentsPending && <p className="loading">Loading...</p>}
//         {commentsError && <p className="">{commentsError.toString()}</p>}
//         {commentDataState &&
//           commentDataState.map((comment) =>
//             comment.postId === postId ? (
//               <Fragment key={comment.id}>
//                 <p className={style["comment-user"]}>User: @{comment.email}</p>
//                 <p key={comment.id} className={style.comment}>
//                   Wrote: {comment.body}
//                 </p>
//               </Fragment>
//             ) : (
//               ""
//             )
//           )}
//         {/* {commentsData.some(comment => comment.postId === post.id)
//           //   ? commentsData
//           //       .filter(comment => comment.postId === post.id)
//           //       .map(comment => comment.body)
//           //   : 'No comment'} */}
//       </div>
//       <form className={style["commnets-form"]} onSubmit={handleSubmit}>
//         <label>
//           <span>Write comment: </span>
//           <textarea
//             rows={6}
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             required
//           />
//         </label>
//         <button className={`btn ${style["comments-container__btn"]}`}>
//           Add comment
//         </button>
//       </form>
//     </div>
//   );
// }

import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useAuthContext } from "../hooks/useAuthContext"; // Adjust import path as needed
import { useFetch } from "../hooks/useFetch"; // Adjust import path as needed
import { Comment } from "../model/types"; // Adjust import path as needed

function Comments({
  postId,
  commentsData,
  commentsPending,
  commentsError,
}: {
  postId: number;
  commentsData: Comment[];
  commentsPending: boolean;
  commentsError: String | Error | null;
}) {
  const { state } = useAuthContext();
  const [commentDataState, setCommentDataState] =
    useState<Comment[]>(commentsData);
  const [comment, setComment] = useState<string>("");
  const { postData, data } = useFetch<Comment>(
    "https://front-end-app-server.onrender.com/comments",
    "POST"
  );

  const handleSubmit = () => {
    postData({
      postId: postId,
      name: "",
      email: state.user?.email,
      body: comment,
    });
    setComment("");
  };

  useEffect(() => {
    if (data) {
      setCommentDataState((prev) => [...prev, data]);
    }
  }, [data]);

  return (
    <ScrollView style={styles.commentsContainer}>
      <Text>Comments:</Text>
      <View>
        {commentsPending && <Text>Loading...</Text>}
        {commentsError && <Text>{commentsError.toString()}</Text>}
        {commentDataState &&
          commentDataState.map((comment) =>
            comment.postId === postId ? (
              <Fragment key={comment.id}>
                <Text style={styles.commentUser}>User: @{comment.email}</Text>
                <Text>Wrote: {comment.body}</Text>
              </Fragment>
            ) : null
          )}
      </View>
      <View style={styles.commentsForm}>
        <Text style={styles.formLabel}>Write comment:</Text>
        <TextInput
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
          style={styles.textarea}
          placeholder="Your comment"
        />
        <Button title="Add comment" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  commentsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  commentUser: {
    marginTop: 20,
    marginBottom: 2,
  },
  commentsForm: {
    color: "#f5f5f5",
    margin: 20,
    alignSelf: "center",
    width: "90%",
  },
  formLabel: {
    display: "flex",
    marginVertical: 30,
    fontSize: 20,
  },
  textarea: {
    color: "#333",
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    backgroundColor: "#fff",
    width: "100%",
    minHeight: 44,
    fontFamily: "Poppins, sans-serif",
  },
  commentsContainerBtn: {
    marginTop: 25,
    alignSelf: "center",
  },
});

export default Comments;
