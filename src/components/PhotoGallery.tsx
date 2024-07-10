import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Photo } from "../model/types";
import { useState } from "react";
import { Modal } from "react-native";
import { TouchableWithoutFeedback } from "react-native";

const PhotoGallery = ({
  photos,
  handleDeletePhoto,
}: {
  photos: Photo[] | undefined;
  handleDeletePhoto: (photoId: number) => void;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleImagePress = (photo: Photo) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      {photos?.map((photo, index) => (
        <View key={index} style={styles.photoContainer}>
          <TouchableOpacity onPress={() => handleImagePress(photo)}>
            <Image source={{ uri: photo.url }} style={styles.photo} />
          </TouchableOpacity>
          <Pressable
            style={styles.deleteButton}
            onPress={() => handleDeletePhoto(photo.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      ))}
      {selectedPhoto && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalView}>
              <Image
                source={{ uri: selectedPhoto.url }}
                style={styles.modalImage}
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
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
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  deleteButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#D32F2F",
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
});

export default PhotoGallery;
