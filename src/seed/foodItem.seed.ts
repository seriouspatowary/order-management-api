import mongoose from "mongoose";
import dotenv from "dotenv";

import { FoodItem } from "../models/foodItem.models"
import { foodItems } from "../data/foodItem.data";

dotenv.config();

const seedFoodItems = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    console.log("MongoDB connected");

    await FoodItem.deleteMany({});

    const insertedFoodItems = await FoodItem.insertMany(foodItems);

    console.log(
      `${insertedFoodItems.length} food items inserted successfully`
    );

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedFoodItems();