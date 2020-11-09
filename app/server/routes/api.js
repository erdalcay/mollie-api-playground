/**
 * APIs
 */
'use-strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const crypto = require("crypto");
const Response = require('../../lib/response');
const {Payments, Methods, Refunds, Orders} = require('../../lib/mollie');
const paymentsClient = new Payments();
const methodsClient = new Methods();
const refundsClient = new Refunds();
const ordersClient = new Orders();
const paymentsdb = new (require('../../db/db'))('payments');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

/**
 * Get payments - getPayments
 */
router.get('/getPayments', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  // Response object
  const responseModel = new Response('payments');
  try {
    // Call Payments API
    const paymentsResponse = await paymentsClient.getAllPayments();
    if (!paymentsResponse.error) {
      const {_embedded: {payments: paymentsData}} = JSON.parse(paymentsResponse.body);
      const response = responseModel.buildResponse(paymentsData);
      res.send(JSON.stringify(response));
    } else {
      res.send(JSON.stringify({error: true}));
    }
  } catch(e) {
    res.send(JSON.stringify({error: true}));
  }
});

/**
 * Get orders - getOrders
 */
router.get('/getOrders', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  // Response object
  const responseModel = new Response('orders');
  try {
    // Call Payments API
    const ordersResponse = await ordersClient.getAllOrders();
    if (!ordersResponse.error) {
      const {_embedded: {orders: ordersData}} = JSON.parse(ordersResponse.body);
      const response = responseModel.buildResponse(ordersData);
      res.send(JSON.stringify(response));
    } else {
      res.send(JSON.stringify({error: true}));
    }
  } catch(e) {
    res.send(JSON.stringify({error: true}));
  }
});

/**
 * Get refunds - getRefunds
 */
router.get('/getRefunds', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  // Response object
  const responseModel = new Response('refunds');
  try {
    // Call Payments API
    const refundsResponse = await refundsClient.getAllRefunds();
    if (!refundsResponse.error) {
      const {_embedded: {refunds: refundsData}} = JSON.parse(refundsResponse.body);
      const response = responseModel.buildResponse(refundsData);
      res.send(JSON.stringify(response));
    } else {
      res.send(JSON.stringify({error: true}));
    }
  } catch(e) {
    res.send(JSON.stringify({error: true}));
  }
});

/**
 * Get payment methods - getPaymentMethods
 */
router.get('/getPaymentMethods', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    // Response object
    const responseModel = new Response('methods');
    try {
      // Call Payments API
      const methodsResponse = await methodsClient.getAllEnabledPaymentMethods();
      if (!methodsResponse.error) {
        const {_embedded: {methods: methodsData}} = JSON.parse(methodsResponse.body);
        const response = responseModel.buildResponse(methodsData);
        res.send(JSON.stringify(response));
      } else {
        res.send(JSON.stringify({error: true}));
      }
    } catch(e) {
      res.send(JSON.stringify({error: true}));
    }
});

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
    const createPaymentResponse = await paymentsClient.createPayment({
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
      await paymentsdb.insert({orderId, paymentId, paymentStatus, productId});
    
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
    const singlePaymentResponse = await paymentsClient.getSinglePayment(paymentId);

    if (!singlePaymentResponse.error) {
      const {status: paymentStatus} = JSON.parse(singlePaymentResponse.body);

      // Update payment status
      await paymentsdb.update(paymentId, paymentStatus);
    }
  } catch(e) {}
  
});

module.exports = router;