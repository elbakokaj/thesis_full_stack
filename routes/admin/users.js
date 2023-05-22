const express = require("express");
const router = express.Router();
const Users = require("../../models/users");

router.get("/find_all_professors", async (req, res) => {
    try {
        const users = await Users.find({ "role": "professor" });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
