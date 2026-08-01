function validateUserInput(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("El correo electrónico no es válido.");
  }

  if (!password || password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

module.exports = { validateUserInput };
