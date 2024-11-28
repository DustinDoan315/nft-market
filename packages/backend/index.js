const express = require("express");
const multer = require("multer");
const { PinataSDK } = require("pinata");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const upload = multer({
  dest: "uploads/",
});

dotenv.config();

const app = express();
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "silver-known-bobcat-972.mypinata.cloud",
});

// Test Pinata connection
pinata
  .testAuthentication()
  .then(() => {
    console.log("Pinata is connected!");
  })
  .catch((err) => {
    console.error("Failed to connect to Pinata:", err);
  });

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Upload file to IPFS
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // The uploaded file path
    const filePath = path.join(__dirname, req.file.path);

    // Read the file and create a Blob for uploading
    const fileStream = fs.createReadStream(filePath);
    const blob = new Blob([fs.readFileSync(filePath)]);
    const file = new File([blob], req.file.originalname, {
      type: req.file.mimetype,
    });

    // Upload the file to Pinata
    const result = await pinata.upload.file(file);
    console.log(result);

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      ipfsHash: result.id,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${result.cid}`,
    });
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    res.status(500).json({ error: "Failed to upload file to IPFS" });
  }
});

app.get("/api/get-file", async (req, res) => {
  const { cid } = req.query;

  if (!cid) {
    return res.status(400).json({ error: "CID is required" });
  }

  try {
    const url = await pinata.gateways.createSignedURL({
      cid,
      expires: 30,
    });

    res.json({ image: url });
  } catch (error) {
    console.error("Error fetching file from Pinata:", error);
    res.status(500).json({ error: "Failed to fetch file from Pinata" });
  }
});
// // Upload JSON metadata to IPFS
// app.post("/upload-metadata", async (req, res) => {
//   try {
//     const metadata = {
//       name: "My NFT",
//       description: "An amazing NFT asset",
//       image: "ipfs://<image_cid>", // Replace with actual CID of the image
//       attributes: [
//         {
//           trait_type: "Background",
//           value: "Blue",
//         },
//         {
//           trait_type: "Eyes",
//           value: "Green",
//         },
//       ],
//     };

//     const options = {
//       pinataMetadata: {
//         name: "NFT_Metadata",
//       },
//       pinataOptions: {
//         cidVersion: 1,
//       },
//     };

//     const result = await pinata.pinJSONToIPFS(metadata, options);

//     res.json({
//       success: true,
//       ipfsHash: result.IpfsHash, // CID of the uploaded metadata
//       pinataUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
//     });
//   } catch (error) {
//     console.error("Error uploading metadata:", error);
//     res.status(500).json({ error: "Failed to upload metadata to IPFS" });
//   }
// });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
