const express = require("express");
const router = express.Router();

// Almacén simulado de transacciones (en memoria) para poder reembolsarlas
const transactions = new Map();

// Validación de número de tarjeta con el algoritmo de Luhn
function isValidCardNumber(cardNumber) {
  const digits = cardNumber.replace(/\s/g, "");
  if (!/^\d{12,19}$/.test(digits)) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

// Simulación de integración con una pasarela de pago externa
router.post("/charge", (req, res) => {
  const { amount, cardNumber } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "El monto debe ser mayor a 0." });
  }
  if (!cardNumber || !isValidCardNumber(cardNumber)) {
    return res.status(400).json({ error: "Número de tarjeta inválido." });
  }

  // Aquí se integraría con una API real de pagos (Stripe, PayPal, etc.)
  const transactionId = `TX-${Date.now()}`;
  transactions.set(transactionId, { amount, status: "aprobado" });

  res.json({
    status: "aprobado",
    transactionId,
    amount,
  });
});

// Reembolso de una transacción previamente aprobada
router.post("/refund/:transactionId", (req, res) => {
  const { transactionId } = req.params;
  const tx = transactions.get(transactionId);

  if (!tx) {
    return res.status(404).json({ error: "Transacción no encontrada." });
  }
  if (tx.status === "reembolsado") {
    return res.status(400).json({ error: "La transacción ya fue reembolsada." });
  }

  tx.status = "reembolsado";
  res.json({ status: "reembolsado", transactionId, amount: tx.amount });
});

module.exports = router;
