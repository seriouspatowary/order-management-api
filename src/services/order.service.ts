import mongoose from "mongoose";
import { Types } from "mongoose";

import { FoodItem } from "../models/foodItem.models.js";
import {
  Order,
  OrderStatus,
} from "../models/order.models.js";
import { OrderItem } from "../models/orderItem.models.js";

import type { CreateOrderInput } from "../validators/order.validator.js";
import { simulateOrderStatus } from "./order-status.service.js";

export const createOrder = async (
  data: CreateOrderInput
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const orderItems = [];
    let totalAmount = 0;

    
    for (const item of data.items) {
      if (!Types.ObjectId.isValid(item.foodItemId)) {
        throw new Error(
          `Invalid food item ID: ${item.foodItemId}`
        );
      }

      const foodItem = await FoodItem.findById(
        item.foodItemId
      ).session(session);

      if (!foodItem) {
        throw new Error(
          `Food item not found: ${item.foodItemId}`
        );
      }

    //  Check availability
      if (!foodItem.isAvailable) {
        throw new Error(
          `${foodItem.name} is currently unavailable`
        );
      }


    //   Check stock
      if (
        foodItem.availableQuantity <
        item.quantity
      ) {
        throw new Error(
          `Only ${foodItem.availableQuantity} ${foodItem.name} available`
        );
      }

    //   Calculate subtotal

      const subtotal =
        foodItem.price * item.quantity;

      totalAmount += subtotal;

//    Prepare OrderItem
      orderItems.push({
        foodItemId: foodItem._id,
        quantity: item.quantity,
        price: foodItem.price,
        subtotal,
      });
    }

//    Generate order number
    const orderNumber = `ORD-${Date.now()}`;

//   Create Order
    const [order] = await Order.create(
      [
        {
          orderNumber,
          customerName: data.customerName,
          address: data.address,
          phone: data.phone,
          totalAmount,
          status: OrderStatus.RECEIVED,
        },
      ],
      {
        session,
      }
    );

   
    const orderItemsWithOrderId =
      orderItems.map((item) => ({
        ...item,
        orderId: order._id,
      }));


    await OrderItem.insertMany(
      orderItemsWithOrderId,
      {
        session,
      }
    );


    for (const item of data.items) {
      const updatedFoodItem =
        await FoodItem.findOneAndUpdate(
          {
            _id: item.foodItemId,
            availableQuantity: {
              $gte: item.quantity,
            },
          },
          {
            $inc: {
              availableQuantity: -item.quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

      if (!updatedFoodItem) {
        throw new Error(
          "Food quantity changed. Please try again."
        );
      }
      if (
        updatedFoodItem.availableQuantity === 0
      ) {
        await FoodItem.updateOne(
          {
            _id: updatedFoodItem._id,
          },
          {
            $set: {
              isAvailable: false,
            },
          },
          {
            session,
          }
        );
      }
    }

    await session.commitTransaction();
    simulateOrderStatus(order._id);
   
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const trackOrder = async (orderNumber: string) => {
  const order = await Order.findOne({
    orderNumber,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const orderItems = await OrderItem.find({
    orderId: order._id,
  }).populate(
    "foodItemId",
    "name image"
  );

  return {
    order,
    items: orderItems,
  };
};

export const updateOrderStatus = async (
  orderNumber: string,
  status: OrderStatus
) => {
  const order = await Order.findOneAndUpdate(
    { orderNumber },
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};