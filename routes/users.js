const express = require("express");
const router = express.Router();
const db = require("../db");
const { validateUserInput } = require("../middleware/validate");
const { formatDate } = require("../utils/date");

// Create
router.post("/", validateUserInput, (req, res) => {
  const { name, email, password } = req.body;
  const stmt = db.prepare(
    "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)"
  );
  const info = stmt.run(name, email, password, new Date().toISOString());
  res.status(201).json({ id: info.lastInsertRowid, name, email });
});

// Read all
router.get("/", (req, res) => {
  const users = db.prepare("SELECT id, name, email, created_at FROM users").all();
  const withFormattedDate = users.map((u) => ({
    ...u,
    created_at_formatted: formatDate(u.created_at),
  }));
  res.json(withFormattedDate);
});

// Read one
router.get("/:id", (req, res) => {
  const user = db
    .prepare("SELECT id, name, email, created_at FROM users WHERE id = ?")
    .get(req.params.id);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user);
});

// Update
router.put("/:id", validateUserInput, (req, res) => {
  const { name, email, password } = req.body;
  const stmt = db.prepare(
    "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?"
  );
  const info = stmt.run(name, email, password, req.params.id);
  if (info.changes === 0)
    return res.status(404).json({ error: "Usuario no encontrado" });
  res.json({ id: req.params.id, name, email });
});

// Delete
router.delete("/:id", (req, res) => {
  const info = db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  if (info.changes === 0)
    return res.status(404).json({ error: "Usuario no encontrado" });
  res.status(204).send();
});

module.exports = router;
