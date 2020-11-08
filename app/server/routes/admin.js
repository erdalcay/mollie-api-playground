/**
 * Admin
 */
'use-strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const staticFilePath = path.join(__dirname, '../../../shop/admin/html');

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
	res.sendFile(path.join(staticFilePath, 'dashboard.html'));
});


module.exports = router;