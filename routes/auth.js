const express = require("express");
const router = express.Router();
const db = require("../db");

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 60 * 1000; // 1 minuto
const failedAttempts = new Map(); // email -> { count, lockedUntil }

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Correo y contraseña son obligatorios." });
  }

  const record = failedAttempts.get(email);
  if (record && record.lockedUntil && Date.now() < record.lockedUntil) {
    const secondsLeft = Math.ceil((record.lockedUntil - Date.now()) / 1000);
    return res.status(429).json({
      error: `Demasiados intentos fallidos. Intenta de nuevo en ${secondsLeft} segundos.`,
    });
  }

  const user = db
    .prepare("SELECT id, name, email FROM users WHERE email = ? AND password = ?")
    .get(email, password);

  if (!user) {
    const count = (record?.count || 0) + 1;
    const lockedUntil = count >= MAX_ATTEMPTS ? Date.now() + LOCK_TIME_MS : null;
    failedAttempts.set(email, { count, lockedUntil });
    return res.status(401).json({ error: "Credenciales inválidas." });
  }

  failedAttempts.delete(email);
  res.json({ message: "Inicio de sesión exitoso", user });
});

module.exports = router;
