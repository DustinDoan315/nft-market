import { View, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import ImageViewer from "../components/ImageViewer";

const PlaceholderImage = require("@/assets/images/background-image.png");

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Request permissions when the component is mounted
    const requestPermissions = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access photo library is required!");
      }
    };

    requestPermissions();
  }, []);

  // Function to pick image from the gallery
  const pickImageAsync = async () => {
    try {
      let result = await ImagePicker.launchImageLibrary({
        mediaType: "photo",
        allowsEditing: true,
        quality: 1,
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      });

      console.log(result); // Log the result to see what is returned
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      } else {
        alert("You did not select any image.");
      }
    } catch (error) {
      console.error("Error picking image:", error); // Catch and log any errors
    }
  };

  // Function to upload selected image to the backend API
  const uploadImageAsync = async () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", {
      uri: selectedImage,
      name: "image.jpg", // You can change the name if necessary
      type: "image/jpeg", // Adjust this based on the image type (jpeg, png, etc.)
    });

    try {
      setUploading(true);
      const response = await axios.post(
        "http://your-api-url/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { success, ipfsHash, pinataUrl } = response.data;
      if (success) {
        Alert.alert(
          "Upload Success",
          `IPFS Hash: ${ipfsHash}\nPinata URL: ${pinataUrl}`
        );
      } else {
        Alert.alert("Upload Failed", "Failed to upload the image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert(
        "Upload Failed",
        "An error occurred while uploading the image."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer
          imgSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
      </View>
      <View style={styles.footerContainer}>
        <Button
          theme="primary"
          label="Choose a photo"
          onPress={pickImageAsync}
        />
        <Button
          label={uploading ? "Uploading..." : "Use this photo"}
          onPress={uploadImageAsync}
          disabled={uploading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});
