const User = require("../models/user");

// POST /api/cart/add
exports.addItemCart = async (req, res) => {
    const { email, productId, quantity } = req.body;

    try {
        const user = await User.findById(email);

        const itemIndex = user.cart.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
            // Update quantity
            user.cart[itemIndex].quantity += quantity;
        } else {
            // Add new item
            user.cart.push({ productId, quantity });
        }

        await user.save();
        res.json({ message: "Cart updated", cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: "Error updating cart", error: err });
    }
};

// POST /api/cart/remove
exports.removeCartItem = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        await User.findByIdAndUpdate(userId, {
            $pull: { cart: { productId } }
        });
        res.json({ message: "Item removed from cart" });
    } catch (err) {
        res.status(500).json({ message: "Error removing item", error: err });
    }
};

exports.getCartItems = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findById(email).populate("cart.productId");
        res.json(user.cart);
    } catch (err) {
        res.status(500).json({ message: "Error fetching cart", error: err });
    }
}