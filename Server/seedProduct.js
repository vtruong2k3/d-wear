const mongoose = require("mongoose");
const Product = require("./models/products");
const Variant = require("./models/variants");
const Category = require("./models/categories");
const Brand = require("./models/brands");

require("dotenv").config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    let category = await Category.findOne();
    if (!category) {
      category = await Category.create({ category_name: "Áo Hoodie", description: "Áo khoác có mũ", isDeleted: false });
    }

    let brand = await Brand.findOne();
    if (!brand) {
      brand = await Brand.create({ brand_name: "D-WEAR System", description: "Thương hiệu nội địa cao cấp", isDeleted: false });
    }

    // Create the Product
    const product = await Product.create({
      product_name: "Streetwear System Hoodie - Black",
      description: "Premium oversized hoodie featuring a futuristic geometric SYS logo embroidered on the chest. Made from heavy-weight cotton for maximum comfort and durability. Perfect for an urban streetwear aesthetic.",
      basePrice: 550000,
      imageUrls: ["/streetwear_hoodie.png"],
      category_id: category._id,
      brand_id: brand._id,
      gender: "unisex",
      material: "100% Premium Cotton (450gsm)",
    });

    console.log("Created Product:", product._id);

    // Create Variants (Sizes: M, L, XL; Color: Black)
    const variants = await Variant.insertMany([
      {
        product_id: product._id,
        size: "M",
        color: "Black",
        stock: 50,
        price: 550000,
        image: ["/streetwear_hoodie.png"],
      },
      {
        product_id: product._id,
        size: "L",
        color: "Black",
        stock: 45,
        price: 550000,
        image: ["/streetwear_hoodie.png"],
      },
      {
        product_id: product._id,
        size: "XL",
        color: "Black",
        stock: 20,
        price: 550000,
        image: ["/streetwear_hoodie.png"],
      }
    ]);

    console.log(`Created ${variants.length} Variants.`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
