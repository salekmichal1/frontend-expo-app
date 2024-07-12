import React, { useEffect, useRef, useState } from "react";
import { Album, Photo } from "../../model/types";

// styles
import { useFetch } from "../../hooks/useFetch";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native";
import PhotoGallery from "../../components/PhotoGallery";
import { CommonActions, useNavigation } from "@react-navigation/native";

export default function CreateAlbum({ route }: { route: any }) {
  const [albumTitle, setAlbumTitle] = useState<string>("");
  const [albumUserId, setAlbumUserId] = useState<number>();
  const [photos, setPhotos] = useState<Photo[]>();
  const [newPhoto, setNewPhoto] = useState<string>("");
  const [addingNewPhotos, setAddingNewPhotos] = useState<string[]>([]);
  const [fetchingNewPhotos, setFetchingNewPhotos] = useState<string[]>([]);
  const [photoValidateWarn, setPhotoValidateWarn] = useState<boolean>(false);
  const [photoIdForDelete, setPhotoIdForDelete] = useState<number>();

  const addPhotoInput = useRef<HTMLInputElement>(null);

  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const { locationPath, id } = route.params;

  const navigation = useNavigation();

  const { state } = useAuthContext();
  const { postData: postAlbumData, data: albumData } = useFetch<Album>(
    "https://front-end-app-server.onrender.com/albums",
    "POST"
  );

  const { patchData: patchAlbumData } = useFetch<Album>(
    `https://front-end-app-server.onrender.com/albums/${id}`,
    "PATCH"
  );

  const { deleteData: deletePhotos, data: photosDeleteData } = useFetch<Photo>(
    `https://front-end-app-server.onrender.com/photos/${photoIdForDelete}`,
    "DELETE"
  );

  useEffect(() => {
    setIsPending(true);
    const fetchData = async function () {
      try {
        const resPhotos = await fetch(
          "https://front-end-app-server.onrender.com/photos?albumId=" + id
        );
        const resAlbum = await fetch(
          "https://front-end-app-server.onrender.com/albums/" + id
        );
        if (!resPhotos.ok) {
          throw Error(resPhotos.statusText);
        }
        if (!resAlbum.ok) {
          throw Error(resAlbum.statusText);
        }

        const dataPhotos: Photo[] = await resPhotos.json();
        const dataAlbum: Album = await resAlbum.json();

        setPhotos(dataPhotos);
        setAlbumTitle(dataAlbum.title);
        setAlbumUserId(dataAlbum.userId);
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
      setPhotos([]);
      setAlbumTitle("");
      setIsPending(false);
    }
  }, [locationPath, id, fetchingNewPhotos, photosDeleteData]);

  const handleSubmitAdd = function () {
    console.log("submit add");

    postAlbumData({
      userId: state.user?.id,
      title: albumTitle,
    });
  };

  const handleSubmitUpdate = function () {
    if (locationPath === "edit" && addingNewPhotos) {
      patchAlbumData({
        userId: state.user?.id,
        title: albumTitle,
      });

      // addingNewPhotos.forEach(photo =>
      //   postPhotosData({
      //     albumId: id,
      //     title: 'title',
      //     url: photo,
      //     thumbnailUrl: photo,
      //   })
      // );

      const postData = async function () {
        setIsPending(true);
        try {
          for (let i = 0; i < addingNewPhotos.length; i++) {
            const resPhotos = await fetch(
              "https://front-end-app-server.onrender.com/photos",
              {
                method: "POST",
                body: JSON.stringify({
                  albumId: Number(id),
                  title: "title",
                  url: addingNewPhotos[i],
                  thumbnailUrl: addingNewPhotos[i],
                }),
                headers: { "Content-Type": "application/json" },
              }
            );
            if (!resPhotos.ok) {
              throw Error(resPhotos.statusText);
            }
            const dataPhotos: string = await resPhotos.json();
            console.log(dataPhotos);

            setFetchingNewPhotos((prev) => [...prev, dataPhotos]);
          }
          setIsPending(false);
        } catch (err: any) {
          console.error(err.message);
          setError(err.message);
          setIsPending(false);
        }
      };
      postData();
      setAddingNewPhotos([]);
      setFetchingNewPhotos([]);
    }
  };

  useEffect(() => {
    if (albumData && locationPath !== "edit") {
      navigation.dispatch(
        CommonActions.navigate({
          name: "CreateAlbums",
          params: {
            locationPath: "edit",
            id: albumData.id,
          },
        })
      );
    }
  }, [navigation, albumData, locationPath]);

  const handleAdd = function () {
    const photo = newPhoto.trim();

    if (photo && !addingNewPhotos.includes(photo)) {
      setAddingNewPhotos((prevState) => [...prevState, photo]);
    }
    setNewPhoto("");
    addPhotoInput.current?.focus();
  };

  const checkPhotoUrl = function () {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

    if (urlPattern.test(newPhoto)) {
      setPhotoValidateWarn(false);
      handleAdd();
    } else {
      setPhotoValidateWarn(true);
    }
  };

  const handleDeleteLink = function (index: number) {
    setAddingNewPhotos([
      ...addingNewPhotos.slice(0, index),
      ...addingNewPhotos.slice(index + 1, addingNewPhotos.length),
    ]);
  };

  const handleDeletePhoto = function (photoId: number) {
    setPhotoIdForDelete(photoId);
    deletePhotos();
  };
  // function LightGalleryItem(props: {
  //   src: string;
  //   thumbnailUrl: string;
  //   photoTitle: string;
  //   photoId: number;
  // }) {
  //   return (
  //     <div className={style.photos__item}>
  //       <a className={`gallery-item`} data-src={props.src}>
  //         <img
  //           className={style.photos__img}
  //           src={props.thumbnailUrl}
  //           alt="photo"
  //         />
  //         <p>{props.photoTitle}</p>
  //       </a>
  //       <button
  //         className={`btn ${style["delete-btn"]}`}
  //         onClick={() => handleDeletePhoto(props.photoId)}
  //       >
  //         Delete
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text>{error.message}</Text>}
      {isPending && (
        <Text style={{ textAlign: "center", fontSize: 24 }}>Loading...</Text>
      )}
      {!isPending && locationPath !== "edit" && (
        // adding new gallery
        <View>
          <Text style={styles.createAlbumHead}>Create Album</Text>
          <View style={styles.create}>
            <Text style={styles.label}>Album Name</Text>
            <TextInput
              value={albumTitle}
              onChangeText={setAlbumTitle}
              style={styles.input}
              placeholder="Enter album name"
            />

            <Pressable style={styles.button} onPress={handleSubmitAdd}>
              <Text style={styles.buttonText}>Add Album</Text>
            </Pressable>
          </View>
        </View>
      )}

      {!isPending &&
        photos &&
        locationPath === "edit" &&
        state.user?.id === albumUserId && (
          // showing and editing gallery
          <>
            <View style={styles.create}>
              <Text style={styles.createAlbumHead}>Edit Album</Text>
              <View>
                <Text style={styles.label}>Album title: </Text>

                <TextInput
                  style={styles.input}
                  value={albumTitle}
                  onChangeText={setAlbumTitle}
                  placeholder="Album Title"
                />
                <View>
                  <Text style={styles.label}>Add photos: </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={setNewPhoto}
                    value={newPhoto}
                    placeholder="Photo URL"
                  />
                  <Pressable
                    style={{ marginBottom: 16, ...styles.button }}
                    onPress={checkPhotoUrl}
                  >
                    <Text style={styles.buttonText}>Add</Text>
                  </Pressable>
                </View>
                {photoValidateWarn && (
                  <Text style={styles.photosUrlTip}>Not valid url address</Text>
                )}
                <Text>Currently adding photos:</Text>

                {addingNewPhotos.map((photo, index) => (
                  <Text
                    style={styles.photosLink}
                    key={index}
                    onPress={() => handleDeleteLink(index)}
                  >
                    {photo}
                  </Text>
                ))}
                {addingNewPhotos.length !== 0 && (
                  <Text style={styles.photosTip}>
                    Click on link to delete from list
                  </Text>
                )}
                <Pressable style={styles.button} onPress={handleSubmitUpdate}>
                  <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
              </View>
            </View>
            <Text style={styles.createAlbumHead}>Photos</Text>
            <PhotoGallery
              photos={photos}
              handleDeletePhoto={handleDeletePhoto}
            />
            {/* <LightGallery
              selector=".gallery-item"
              elementClassNames={style.photos__container}
            >
              {photos.map((photo) => (
                <LightGalleryItem
                  key={photo.id}
                  src={photo.url}
                  thumbnailUrl={photo.thumbnailUrl}
                  photoTitle={photo.title}
                  photoId={photo.id}
                />
              ))}
            </LightGallery> */}
          </>
        )}
      {!isPending &&
        photos &&
        locationPath === "edit" &&
        state.user?.id !== albumUserId && <Text> Access denied</Text>}
    </ScrollView>
  );
}

const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
    alignSelf: "center",
    maxWidth: windowWidth * 0.8,
  },
  createAlbumHead: {
    color: "#222",
    textAlign: "center",
    fontSize: 36,
    marginVertical: 20,
  },
  create: {
    color: "#222",
    alignSelf: "center",
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
  },
  input: {
    color: "#333",
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    backgroundColor: "#fff",
    height: 44,
    width: windowWidth * 0.7,
  },
  button: {
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
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  photosAddInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  photosLink: {
    textDecorationLine: "underline",
    fontStyle: "italic",
    marginVertical: 10,
    color: "#222",
  },
  photosTip: {
    color: "#39b385",
  },
  photosUrlTip: {
    color: "#39b385",
    marginBottom: 20,
  },
  gallery: {
    flex: 1,
    marginVertical: 20,
  },
  // Add styles for other classes like photos__add-input, photos__container, etc., as needed
});
