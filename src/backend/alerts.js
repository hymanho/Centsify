const express = require('express');
const router = express.Router();

// Example data
const alerts = [
    { id: 1, message: "Over budget: Dining" },
    { id: 2, message: "Payment due: Credit Card" }
];

// GET alerts
router.get('/', (req, res) => {
    res.json(alerts);
});

module.exports = router;
