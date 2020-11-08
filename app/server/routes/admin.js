/**
 * Admin
 */
'use-strict';
const express = require('express');
const router = express.Router();
const path = require('path');

/**
 * Admin home
 */
router.get('/', async (req, res) => {
	res.redirect('/admin/dashboard');
});

/**
 * Dashboard
 */
router.get('/dashboard', async (req, res) => {
	res.sendFile(path.join(__dirname, '../../../grocery-shop/html/shop.html'));
});


module.exports = router;