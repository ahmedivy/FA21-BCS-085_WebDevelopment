const express = require('express');
const router = express.Router();
const Car = require('../../models/Car');
const Order = require('../../models/order');
const isAuthenticated = require('../../middleware/authMiddleware');

// Route to handle buying a car
router.post('/buy/:carId', isAuthenticated, async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) {
      return res.status(404).send('Car not found');
    }

    const order = new Order({
      user: req.session.user._id,
      car: car._id,
    });

    await order.save();
    res.redirect(`/orders/${order._id}`);
  } catch (error) {
    console.error('Error buying car:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to display order confirmation
const { ObjectId } = require('mongoose').Types;

router.get('/:orderId', isAuthenticated, async (req, res) => {
  const orderId = req.params.orderId;

  // Validate the ID
  if (!ObjectId.isValid(orderId)) {
    return res.status(400).send('Invalid ID format');
  }

  try {
    const order = await Order.findById(orderId).populate('car').populate('user');
    if (!order) {
      return res.status(404).send('Order not found');
    }

    res.render('order', { order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
