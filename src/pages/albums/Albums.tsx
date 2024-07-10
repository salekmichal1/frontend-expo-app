import { useEffect, useState } from "react";
// import AlbumsSearch from "../../components/AlbumsSearch";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFetch } from "../../hooks/useFetch";
import { Album, Photo } from "../../model/types";
import { PhotosLibrary } from "../../../assets/Svg";
import AlbumsSearch from "../../components/AlbumsSearch";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
// import style from "./Albums.module.css";

export default function Albums() {
  const { state } = useAuthContext();
  const [albumIdForDelete, setAlbumIdForDelete] = useState<number>();
  const {
    getData: getAlbumData,
    data: albumData,
    isPending,
    error,
  } = useFetch<Album[]>(
    "https://front-end-app-server.onrender.com/albums?userId=" + state.user?.id
  );

  const { getData: getPhotosData, data: photosData } = useFetch<Photo[]>(
    `https://front-end-app-server.onrender.com/photos?albumId=${albumIdForDelete}`
  );

  const { deleteData: deleteAlbum, data: albumDeleteData } = useFetch<Album>(
    `https://front-end-app-server.onrender.com/albums/${albumIdForDelete}`,
    "DELETE"
  );

  const navigation = useNavigation();

  const handleDelete = function (albumId: number) {
    setAlbumIdForDelete(albumId);
    getPhotosData();
    deleteAlbum();
  };

  useEffect(() => {
    if (photosData && photosData.length > 0) {
      const deletePhotos = async function () {
        try {
          for (let i = 0; i < photosData.length; i++) {
            const resPhotos = await fetch(
              `https://front-end-app-server.onrender.com/photos/${photosData[i].id}`,
              {
                method: "DELETE",
              }
            );
            if (!resPhotos.ok) {
              throw Error(resPhotos.statusText);
            }
            const dataPhotos: string = await resPhotos.json();
            console.log(dataPhotos);
          }
        } catch (err: any) {
          console.error(err.message);
        }
      };

      deletePhotos();
    }
    getAlbumData();
  }, [albumDeleteData, photosData]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.albumsHead}>Albums</Text>
      <View style={styles.albumsControls}>
        <AlbumsSearch />
        <TouchableOpacity
          style={styles.albumsBtn}
          onPress={() =>
            navigation.dispatch(CommonActions.navigate("CreateAlbums"))
          }
        >
          <Text style={styles.albumsBtnText}>Add album</Text>
        </TouchableOpacity>
      </View>
      {isPending && <Text>Loading...</Text>}
      {error && <Text>{error.toString()}</Text>}
      {albumData && (
        <View style={styles.albums}>
          {albumData.map((album) => (
            <View key={album.id} style={styles.albumsItem}>
              <PhotosLibrary fill={"#f5f5f5"} width={64} height={64} />
              <Text style={styles.albumTitle}>{album.title}</Text>

              <Pressable
                style={styles.albumsBtn}
                onPress={() =>
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: "CreateAlbums",
                      params: {
                        locationPath: "edit",
                        id: album.id,
                      },
                    })
                  )
                }
              >
                <Text style={styles.albumsBtnText}>Open album</Text>
              </Pressable>
              <Pressable
                style={styles.albumsBtn}
                onPress={() => handleDelete(album.id)}
              >
                <Text style={styles.albumsBtnText}>Delete album</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  albums: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: "center",
    width: "100%",
  },
  albumsItem: {
    width: 300,
    backgroundColor: "#616161",
    borderRadius: 4,
    padding: 20,
    marginBottom: 40, // Adjusted for React Native layout
  },

  albumsBtn: {
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
  albumsBtnText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  albumTitle: {
    color: "#f5f5f5",
    textAlign: "center",
    marginBottom: 20,
  },
  albumsHead: {
    color: "#222",
    textAlign: "center",
    marginTop: 20,
    fontSize: 36,
  },
  albumsControls: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
});
