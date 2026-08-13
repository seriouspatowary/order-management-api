import { Types } from "mongoose";
import { Order, OrderStatus } from "../models/order.models.js";

const updateStatus = async (
  orderId: Types.ObjectId,
  status: OrderStatus
) => {
  try {
    await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    console.log(
      `Order ${orderId} status updated to ${status}`
    );
  } catch (error) {
    console.error(
      "Failed to update order status:",
      error
    );
  }
};

export const simulateOrderStatus = (
  orderId: Types.ObjectId
) => {
  setTimeout(() => {
    updateStatus(
      orderId,
      OrderStatus.PREPARING
    );
  }, 10_000);

  setTimeout(() => {
    updateStatus(
      orderId,
      OrderStatus.OUT_FOR_DELIVERY
    );
  }, 20_000);

  setTimeout(() => {
    updateStatus(
      orderId,
      OrderStatus.DELIVERED
    );
  }, 30_000);
};