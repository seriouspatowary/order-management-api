import { model, Schema } from "mongoose";



export interface IFoodItem{
    name:string;
    description: string;
    price: number;
    image:string;
    isAvailable: boolean;
    availableQuantity: number;
}


const FoodItemSchema = new Schema<IFoodItem>(
{
    name:{
        type:String,
        required: true,
        trim: true

    },
    description:{
        type:String,
        required:true,
        trim : true
    },
    price:{
        type: Number,
        required:true,
        min:0
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

})


export const FoodItem = model<IFoodItem>("FoodItem",FoodItemSchema)