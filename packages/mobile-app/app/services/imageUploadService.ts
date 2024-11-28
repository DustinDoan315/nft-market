// services/imageUploadService.ts

import axios from "axios";

const uploadImage = async (imageUri: string) => {
  const formData: any = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: "Test",
    type: "image/png",
  });

  try {
    const response = await axios.post(
      "https://elf-fluent-morally.ngrok-free.app/api/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Upload failed");
  }
};

export default uploadImage;
