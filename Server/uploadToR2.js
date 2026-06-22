const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const Product = require("./models/products");
const Variant = require("./models/variants");

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    const imagePath = "/home/admin-ubuntu/workspaces/d-wear/Client/public/streetwear_hoodie.png";
    const fileStream = fs.createReadStream(imagePath);
    
    const uniqueName = Date.now() + "-streetwear-hoodie.png";
    const objectKey = "products/" + uniqueName;

    console.log(`Uploading ${objectKey} to R2...`);

    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: objectKey,
      Body: fileStream,
      ContentType: "image/png"
    }));

    const publicUrl = process.env.R2_PUBLIC_URL + "/" + objectKey;
    console.log("Upload success. Public URL:", publicUrl);

    // Update Product
    console.log("Updating product in DB...");
    const product = await Product.findOneAndUpdate(
      { product_name: "Streetwear System Hoodie - Black" },
      { $set: { imageUrls: [publicUrl] } },
      { new: true }
    );

    if (product) {
      console.log("Updated product:", product._id);
      // Update Variants
      const updatedVariants = await Variant.updateMany(
        { product_id: product._id },
        { $set: { image: [publicUrl] } }
      );
      console.log("Updated variants:", updatedVariants.modifiedCount);
    } else {
      console.log("Product not found to update.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

run();
