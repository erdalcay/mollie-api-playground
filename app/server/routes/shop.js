/**
 * Shop
 */
'use-strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const {Payments} = require('../../lib/mollie');
const payments = new Payments();
const ordersdb = new (require('../../db/db'))('orders');

/**
 * Home page
 */
router.get('/', async (req, res) => {
	res.redirect('/shop/home');
});

/**
 * Shop home page
 */
router.get('/home', async (req, res) => {
	res.sendFile(path.join(__dirname, '../../../grocery-shop/html/shop.html'));
});

/**
 * Order confirmation page
 */
router.get('/order-success', async (req, res) => {
	res.status(200);
	res.sendFile(path.join(__dirname, '../../../grocery-shop/html/confirm.html'));
});

/**
 * Order fail page
 */
router.get('/order-error', async (req, res) => {	
	res.status(200);
	res.sendFile(path.join(__dirname, '../../../grocery-shop/html/error.html'));
});

/**
 * Order not completed
 */
router.get('/unsuccessful-order', async (req, res) => {	
	res.status(200);
	res.sendFile(path.join(__dirname, '../../../grocery-shop/html/unsuccessful-order.html'));
});

/**
 * Order validation page
 */
router.get('/checkout-response', async (req, res) => {
	// Order Id
	const orderId = req.query.id;
	// Default redirect
	if (!orderId) {return res.redirect('/shop/home')}

	try {
		// First find the payment Id attached to this order
		const {paymentId} = await ordersdb.retrieve(orderId);
		// Get the payment details from Mollie
		const singlePaymentResponse = await payments.getSinglePayment(paymentId);

		if (!singlePaymentResponse.error) {
			// Payment status
			const {status: paymentStatus} = JSON.parse(singlePaymentResponse.body);
			// Route based on payment status
			// Paid then success
			if (paymentStatus === "paid") {
				res.redirect(`/shop/order-success?id=${orderId}`);
			// Waiting then no success
			} else if (paymentStatus === "open") {
				res.redirect('/shop/unsuccessful-order');
			} else {
				// Expired, canceled, failed then error
				res.redirect('/shop/order-error');
			}
			// Update payment status in DB
			await ordersdb.update(paymentId, paymentStatus);
		}
	} catch(e) {
		// Error page fallback
		res.redirect('/shop/order-error');
	}
});

module.exports = router;