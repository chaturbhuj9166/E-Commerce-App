



import { Router } from "express";
import {
  addToCart,
  fetchCart,
  removeCartItem,
} from "../controllers/Cart.js";
import { checkAuth } from "../middlewares/MiddlewaresAuth.js";

const cartRouter = Router();

cartRouter.post("/add", checkAuth, addToCart);
cartRouter.get("/", checkAuth, fetchCart);
cartRouter.delete("/remove/:id", checkAuth, removeCartItem);

export default cartRouter;
