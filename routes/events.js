const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middleware/auth");
const checkRole = require("../middleware/roles");


// Organizer + Admin можуть переглядати подію
router.get("/events/:id/participants",
  isAuthenticated,
  (req, res) => {
    res.json({ message: "Список учасників події" });
  }
);


// ТІЛЬКИ Admin може видаляти події
router.delete("/events/:id",
  isAuthenticated,
  checkRole("Admin"),
  (req, res) => {
    res.json({ message: "Подія видалена (Admin)" });
  }
);


// ТІЛЬКИ Admin може редагувати учасників
router.put("/events/:id/participants",
  isAuthenticated,
  checkRole("Admin"),
  (req, res) => {
    res.json({ message: "Список учасників оновлено (Admin)" });
  }
);

module.exports = router;