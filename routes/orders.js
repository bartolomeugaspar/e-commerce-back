const express = require('express');
const router = express.Router();

// Mock orders data
const orders = [];

// Get all orders (admin)
router.get('/', (req, res) => {
  try {
    res.json({
      total: orders.length,
      orders: orders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
router.get('/user/:userId', (req, res) => {
  try {
    const userOrders = orders.filter(o => o.userId === req.params.userId);

    res.json({
      total: userOrders.length,
      orders: userOrders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/', (req, res) => {
  try {
    const { userId, items, total, shippingAddress, paymentMethod } = req.body;

    if (!userId || !items || !total) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      items,
      total,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    orders.push(newOrder);

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin)
router.put('/:id', (req, res) => {
  try {
    const { status } = req.body;
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status) {
      order.status = status;
      order.updatedAt = new Date();
    }

    res.json({
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
