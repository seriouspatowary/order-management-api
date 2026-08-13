import { z } from "zod";
import { OrderStatus } from "../models/order.models";

export const updateOrderStatusSchema = z.object({
  status: z.enum(OrderStatus),
});