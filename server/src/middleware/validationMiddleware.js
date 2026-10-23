/**
 * Input validation helpers and middleware
 */

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

const registerValidation = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name is required and must be at least 2 characters long.'
    });
  }

  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required.'
    });
  }

  if (!password || !validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password is required and must be at least 6 characters long.'
    });
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
};

const loginValidation = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Please enter your password.'
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

const playlistValidation = (req, res, next) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Playlist title is required.'
    });
  }
  req.body.title = title.trim();
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  registerValidation,
  loginValidation,
  playlistValidation
};
