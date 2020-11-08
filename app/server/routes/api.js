/**
 * APIs
 */
'use-strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const crypto = require("crypto");
const {Payments} = require('../../lib/mollie');
const payments = new Payments();
const ordersdb = new (require('../../db/db'))('orders');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

/*
 * Creates a new payment request
 */
router.get('/create-payment', async (req, res) => {
	// Set headers & send status
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Content-Type", "application/json");
	res.status(200);

	// Order details
	const {productId, amount, currency} = req.query;
	// Generate a random order Id
	const orderId = crypto.randomBytes(4).toString("hex").toUpperCase();

	try {
		// Create a new payment 
		const createPaymentResponse = await payments.createPayment({
			productId,
			amount,
			currency, 
			orderId
		});

		if (!createPaymentResponse.error) {
			
			// Get payment info
			const {
				id: paymentId, 
				status: paymentStatus,
				_links: {checkout: {href: payscreenUrl}}
			} = JSON.parse(createPaymentResponse.body);
			
			// Send response
			res.send(
				JSON.stringify({error: null, payscreenUrl})
				);
			
			// Insert order into db
			await ordersdb.insert({orderId, paymentId, paymentStatus, productId});
		
		} else {
			res.send(
				JSON.stringify({error: true})
				);
		}
	} catch(e) {
		res.send(
			JSON.stringify({error: true})
			);
	}

});

/**
 * The webhook URL - Listens for updates from Payments API
 *
 * @param {string} [req.body.id] - Payment ID on which a status update happens
 */
router.post('/news-from-mollie', async (req, res) => {
	// Send 200 already
	res.status(200);
	// Payment Id
	const {id: paymentId} = req.body;

	try {
		// Get the details for this payment
		const singlePaymentResponse = await payments.getSinglePayment(paymentId);

		if (!singlePaymentResponse.error) {
			const {status: paymentStatus} = JSON.parse(singlePaymentResponse.body);

			// Update payment status
			await ordersdb.update(paymentId, paymentStatus);
		}
	} catch(e) {}

});

module.exports = router;