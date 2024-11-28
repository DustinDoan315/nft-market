// screens/Index.tsx

import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import Button from "../components/Button";
import ImageViewer from "../components/ImageViewer";
import useImagePicker from "../hooks/useImagePicker";
import uploadImage from "../services/imageUploadService";

const PlaceholderImage = require("@/assets/images/background-image.png");

const Index = () => {
  const { selectedImage, pickImageAsync, loading, setLoading } =
    useImagePicker();

  const handleImageUpload = async () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      const { success, ipfsHash, pinataUrl } = await uploadImage(selectedImage);

      if (success) {
        Alert.alert(
          "Upload Success",
          `IPFS Hash: ${ipfsHash}\nPinata URL: ${pinataUrl}`
        );
      } else {
        Alert.alert("Upload Failed", "Failed to upload the image.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while uploading the image.");
    } finally {
      setLoading(false);
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
          theme="primary"
          label={loading ? "Uploading..." : "Use this photo"}
          onPress={handleImageUpload}
          disabled={loading}
        />
      </View>
    </View>
  );
};

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

export default Index;
