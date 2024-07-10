import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Photo } from "../model/types";

const PhotoGallery = (
  {
    photos,
    handleDeletePhoto,
  }: {
    photos: Photo[] | undefined;
    handleDeletePhoto: (photoId: number) => void;
  },
  {}
) => {
  return (
    <View style={styles.container}>
      {photos?.map((photo, index) => (
        <View key={index} style={styles.photoContainer}>
          <Image source={{ uri: photo.url }} style={styles.photo} />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePhoto(index)} // Assuming handleDeletePhoto takes an index or modify as needed
          >
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  photoContainer: {
    marginBottom: 20,
  },
  photo: {
    width: 250, // Set your desired width
    height: 250, // Set your desired height
    resizeMode: "contain",
  },
  deleteButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#D32F2F",
    borderRadius: 5,
  },
});

export default PhotoGallery;
