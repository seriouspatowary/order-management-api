import { Router } from "express";
import { getFoodItems } from "../controllers/foodItem.controller";

const router = Router();

router.get("/", getFoodItems);

export default router;