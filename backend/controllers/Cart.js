import Cart from "../models/Cart.js";

/* ================= ADD / UPDATE CART ================= */
export async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    const parsedQuantity = Number(quantity);

    if (!productId || Number.isNaN(parsedQuantity) || parsedQuantity === 0) {
      return res.status(400).json({ message: "ProductId and quantity required" });
    }

    const userId = req.user.id;
    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      const newQuantity = Number(existingCartItem.quantity) + parsedQuantity;

      if (newQuantity <= 0) {
        await Cart.deleteOne({ _id: existingCartItem._id });
        return res.status(200).json({ message: "Product removed from cart" });
      }

      existingCartItem.quantity = newQuantity;
      await existingCartItem.save();

      return res.status(200).json({
        message: "Quantity updated",
        product: existingCartItem,
      });
    }

    if (parsedQuantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const productInCart = new Cart({
      userId,
      productId,
      quantity: parsedQuantity,
    });

    await productInCart.save();

    return res.status(201).json({
      message: "Product added to cart",
      product: productInCart,
    });
  } catch (error) {
    console.error("Cart Error:", error);
    return res.status(500).json({ message: error.message });
  }
}

/* ================= FETCH CART ================= */
export async function fetchCart(req, res) {
  try {
    const cartItems = await Cart.find({
      userId: req.user.id,
    })
      .populate("productId")
      .sort({ createdAt: -1 });

    return res.status(200).json(cartItems);
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    return res.status(500).json({ message: error.message });
  }
}

/* ================= DELETE CART ITEM ================= */
export async function removeCartItem(req, res) {
  try {
    const cartItemId = req.params.id;

    const deleted = await Cart.findOneAndDelete({
      _id: cartItemId,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Delete Cart Error:", error);
    return res.status(500).json({ message: error.message });
  }
}
