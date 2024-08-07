const express = require('express');
const router = express.Router();

const reportData = [
    { period: "2023-08", totalExpenses: 2000, savings: 500 }
];

// GET report data
router.get('/', (req, res) => {
    res.json(reportData);
});

module.exports = router;
