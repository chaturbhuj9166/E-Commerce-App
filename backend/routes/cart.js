// import { Router } from "express";
// import { addToCart, fetchCart, removeCartItem } from "../controllers/Cart.js";
// import { checkForlogin } from "../middlewares/MiddlewaresAuth.js";

// const cartRouter = Router();

// // Add / update cart item
// cartRouter.post(
//   "/add",
//   (req, res, next) => checkForlogin(req, res, next, "user"),
//   addToCart
// );

// // Fetch cart items
// cartRouter.get(
//   "/",
//   (req, res, next) => checkForlogin(req, res, next, "user"),
//   fetchCart
// );

// // DELETE cart item
// cartRouter.delete(
//   "/remove/:id",
//   (req, res, next) => checkForlogin(req, res, next, "user"),
//   removeCartItem
// );

// export default cartRouter;




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
