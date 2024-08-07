const express = require('express');
const router = express.Router();

const expenses = [
    { id: 1, category: "Food", amount: 120, date: "2023-08-01" },
    { id: 2, category: "Utilities", amount: 80, date: "2023-08-05" }
];

// GET expenses
router.get('/', (req, res) => {
    res.json(expenses);
});

module.exports = router;
