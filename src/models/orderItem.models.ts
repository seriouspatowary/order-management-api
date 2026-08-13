import { model, Schema, Types } from "mongoose";

export interface IOrderItem {
  orderId: Types.ObjectId;
  foodItemId: Types.ObjectId;
  quantity: number;
  price: number;
  subtotal: number;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    foodItemId: {
      type: Schema.Types.ObjectId,
      ref: "FoodItem",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const OrderItem = model<IOrderItem>(
  "OrderItem",
  OrderItemSchema
);