import { z } from "zod";

export const createOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, "Customer name is required"),

  address: z
    .string()
    .trim()
    .min(1, "Address is required"),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  items: z
    .array(
      z.object({
        foodItemId: z
          .string()
          .min(1, "Food item ID is required"),

        quantity: z
          .number()
          .int("Quantity must be an integer")
          .min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one food item is required"),
});

export type CreateOrderInput = z.infer<
  typeof createOrderSchema
>;