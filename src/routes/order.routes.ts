import { Router } from "express";

import { createOrder, trackOrder, updateOrderStatus } from "../controllers/order.controller.js";
import { validate } from "../middleware/validate.js";
import {
  createOrderSchema,
} from "../validators/order.validator.js";
import { updateOrderStatusSchema } from "../validators/status.validator.js";

const router = Router();

router.post("/create",validate(createOrderSchema),createOrder);
router.get("/track/:orderNumber",trackOrder);
router.patch("/:orderNumber/status",validate(updateOrderStatusSchema),updateOrderStatus);

export default router;