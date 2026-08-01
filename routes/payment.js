const express = require("express");
const router = express.Router();

// Simulación de integración con una pasarela de pago externa
router.post("/charge", (req, res) => {
  const { amount, cardNumber } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "El monto debe ser mayor a 0." });
  }
  if (!cardNumber || cardNumber.length < 12) {
    return res.status(400).json({ error: "Número de tarjeta inválido." });
  }

  // Aquí se integraría con una API real de pagos (Stripe, PayPal, etc.)
  const transactionId = `TX-${Date.now()}`;
  res.json({
    status: "aprobado",
    transactionId,
    amount,
  });
});

module.exports = router;
