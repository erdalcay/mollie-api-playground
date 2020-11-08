'use-strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const ordersdb = new (require('../db/db'))();
const {Payments} = require('../lib/mollie');
const payments = new Payments();

/**
 * Bring in the routes
 */
const apiRoute = require('./routes/api');
const shopRoute = require('./routes/shop');
const adminRoute = require('./routes/admin');

// Use routes
app.use('/api', apiRoute);
app.use('/shop', shopRoute);
app.use('/admin', adminRoute);


/**
 * Deal with post body
 */ 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/**
 * Serve static files
 */
app.use(express.static(path.join(__dirname, '../../grocery-shop')));

/**
 * Home page
 */
app.get('/', async (req, res) => {
	res.redirect('/shop');
});

/**
 * 404 for unmatched routes
 */
app.use((req, res) => {
	res.status(404)
	res.sendFile(path.join(__dirname, '../../grocery-shop/html/404.html'));
});

app.listen(process.env.port || 3000);