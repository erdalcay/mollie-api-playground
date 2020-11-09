'use-strict';
const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv').config();

// SSL
const privateKey = fs.readFileSync(process.env.SSL_PKEY_LOC, 'utf8');
const certificate = fs.readFileSync(process.env.SSL_CERT_LOC, 'utf8');
const ca = fs.readFileSync(process.env.SSL_CA_LOC, 'utf8');

// Secure
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

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

/**
 *
 */
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
  // console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
  // console.log('HTTPS Server running on port 443');
});