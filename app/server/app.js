'use-strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

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
 * Serve static files
 */
const staticShop = path.join(__dirname, '../../shop/shop');
const staticAdmin = path.join(__dirname, '../../shop/admin');
app.use(express.static(staticShop));
app.use(express.static(staticAdmin));

/**
 * Home page
 */
app.get('/', (req, res) => {
  res.redirect('/shop');
});

/**
 * 404 for unmatched routes
 */
app.use((req, res) => {
  res.status(404)
  res.sendFile(path.join(staticShop, 'html', '404.html'));
});

app.listen(8080);