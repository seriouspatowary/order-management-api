
import { Request, Response, NextFunction } from "express";
import * as foodItemService from "../services/foodItem.services";

export const getFoodItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foodItems = await foodItemService.getFoodItems();

    res.status(200).json({
      success: true,
      data: foodItems,
    });
  } catch (error) {
    next(error);
  }
};