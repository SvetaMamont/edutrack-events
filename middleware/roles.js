function checkRole(role) {
  return (req, res, next) => {

    if (!req.session.user) {
      return res.status(401).json({ message: "Не авторизований" });
    }

    if (req.session.user.role !== role) {
      return res.status(403).json({ message: "Недостатньо прав" });
    }

    next();
  };
}

module.exports = checkRole;