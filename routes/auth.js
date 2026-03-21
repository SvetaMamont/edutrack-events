const bcrypt = require("bcrypt");
const User = require("../models/User");

app.post("/login", async (req, res) => {

  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: "Користувача не знайдено" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Невірний пароль" });
  }

  req.session.user = {
    id: user._id,
    username: user.username,
    role: user.role
  };

  res.json({ message: "Успішний вхід" });
});