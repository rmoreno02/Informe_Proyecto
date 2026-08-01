const express = require("express");
const path = require("path");

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const paymentRouter = require("./routes/payment");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/payment", paymentRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
