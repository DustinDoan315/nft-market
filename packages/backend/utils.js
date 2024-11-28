const { PinataSDK } = require("pinata");

exports.getPresignedUrl = async (cid) => {
  try {
    // Generate a pre-signed URL for the file with the CID
    const result = await PinataSDK.pinFileToIPFS(cid, {
      expires: expiresIn,
    });

    const presignedUrl = `https://silver-known-bobcat-972.mypinata.cloud/files/${cid}?X-Algorithm=PINATA1&X-Date=${result.date}&X-Expires=${expiresIn}&X-Method=GET&X-Signature=${result.signature}`;
    console.log(presignedUrl);
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
  }
};
