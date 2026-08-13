import { Request, Response } from "express";
import * as orderService from "../services/order.service.js";

interface TrackOrderParams{
    orderNumber: string;
}


export const createOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const order = await orderService.createOrder(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create order",
    });
  }
};

export const trackOrder = async (
  req: Request<TrackOrderParams>,
  res: Response
) => {
  try {
    const { orderNumber } = req.params;

    const result = await orderService.trackOrder(
      orderNumber
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Order not found",
    });
  }
};




export const updateOrderStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderNumber } = req.params;

    if (typeof orderNumber !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid order number",
      });
    }

    const { status } = req.body;

    const order = await orderService.updateOrderStatus(
      orderNumber,
      status
    );

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Order not found",
    });
  }
};