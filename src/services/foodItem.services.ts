import { FoodItem } from "../models/foodItem.models";


export const getFoodItems = async()=>{

    return await FoodItem.find()
}

export const getFoodItemById = async(id: string)=>{

    return await FoodItem.findById(id)
}

