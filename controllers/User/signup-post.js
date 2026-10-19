const User = require("../../models/Authentication/User-schema");

exports.signup_post = async (req, res) => {
  const { username, password, email } = req.body;

  // ── EMAIL VALIDATION ──────────────────────────────
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.send(`
      <h1>Invalid Email ❌</h1>
      <p>Please enter a valid email like: <strong>rahul123@gmail.com</strong></p>
      <a href='/sub-pages/user/signup.html'>← Try again</a>
    `);
  }

  // ── PASSWORD VALIDATION ───────────────────────────
  // Min 8 chars, 1 uppercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.send(`
      <h1>Weak Password ❌</h1>
      <p>Password must have:</p>
      <ul>
        <li>At least <strong>8 characters</strong></li>
        <li>At least <strong>1 uppercase letter</strong> (A-Z)</li>
        <li>At least <strong>1 number</strong> (0-9)</li>
        <li>At least <strong>1 special character</strong> like @ # $ !</li>
      </ul>
      <p>Example: <strong>Rahul@1234</strong></p>
      <a href='/sub-pages/user/signup.html'>← Try again</a>
    `);
  }

  // ── CHECK DUPLICATE USERNAME ──────────────────────
  const existingUser = await User.exists({ username });
  if (existingUser) {
    return res.send(`
      <h1>Username already taken ❌</h1>
      <p>Please choose a different username.</p>
      <a href='/sub-pages/user/signup.html'>← Try again</a>
    `);
  }

  // ── CHECK DUPLICATE EMAIL ─────────────────────────
  const existingEmail = await User.exists({ email: email.toLowerCase() });
  if (existingEmail) {
    return res.send(`
      <h1>Email already registered ❌</h1>
      <p>This email is already linked to an account.</p>
      <a href='/sub-pages/user/login.html'>← Go to Login</a>
    `);
  }

  // ── SAVE USER ─────────────────────────────────────
  const user = new User({
    username,
    password,
    email: email.toLowerCase(),
    userId: Math.random().toString().substr(2, 6),
  });

  user.save((err, docs) => {
    if (!err) {
      res.send(`
        <h1>Account Created Successfully ✅</h1>
        <p><a href='/sub-pages/user/login.html'>← Please Login</a></p>
      `);
    } else {
      res.send(`
        <h1>Failed to Sign Up ❌</h1>
        <p><a href='/sub-pages/user/signup.html'>← Please try again</a></p>
      `);
    }
  });
};