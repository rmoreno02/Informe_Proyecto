const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Correo y contraseña son obligatorios." });
  }

  const user = db
    .prepare("SELECT id, name, email FROM users WHERE email = ? AND password = ?")
    .get(email, password);

  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas." });
  }

  res.json({ message: "Inicio de sesión exitoso", user });
});

module.exports = router;
