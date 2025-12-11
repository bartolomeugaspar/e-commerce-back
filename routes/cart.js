const express = require('express');
const router = express.Router();

// Mock cart data (in production, store in database)
const carts = {};

// Get cart
router.get('/:userId', (req, res) => {
  try {
    const cart = carts[req.params.userId] || { items: [], total: 0 };
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to cart
router.post('/:userId/add', (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    const userId = req.params.userId;

    if (!carts[userId]) {
      carts[userId] = { items: [], total: 0 };
    }

    const existingItem = carts[userId].items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      carts[userId].items.push({
        productId,
        quantity,
        price
      });
    }

    // Calculate total
    carts[userId].total = carts[userId].items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    res.json({
      message: 'Item added to cart',
      cart: carts[userId]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from cart
router.post('/:userId/remove', (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.params.userId;

    if (!carts[userId]) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    carts[userId].items = carts[userId].items.filter(item => item.productId !== productId);

    // Recalculate total
    carts[userId].total = carts[userId].items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    res.json({
      message: 'Item removed from cart',
      cart: carts[userId]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.post('/:userId/clear', (req, res) => {
  try {
    const userId = req.params.userId;
    carts[userId] = { items: [], total: 0 };

    res.json({
      message: 'Cart cleared',
      cart: carts[userId]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item quantity
router.put('/:userId/update', (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.params.userId;

    if (!carts[userId]) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = carts[userId].items.find(item => item.productId === productId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    item.quantity = quantity;

    // Recalculate total
    carts[userId].total = carts[userId].items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    res.json({
      message: 'Cart updated',
      cart: carts[userId]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
