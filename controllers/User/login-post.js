const User = require("../../models/Authentication/User-schema");
const Token = require("../../jwt/token");

exports.login_post = (req, res) => {
  const { username, password } = req.body;

  // Empty check
  if (!username || !password) {
    return res.send(`
      <script>
        alert('❌ Please fill all fields.');
        window.history.back();
      </script>
    `);
  }

  User.findOne({ username }, (err, docs) => {
    if (!err) {

      // User nahi mila
      if (!docs) {
        return res.send(`
          <script>
            alert('❌ Username not found. Please sign up first.');
            window.history.back();
          </script>
        `);
      }

      // Password galat
      if (docs.password !== password) {
        return res.send(`
          <script>
            alert('❌ Incorrect password. Please try again.');
            window.history.back();
          </script>
        `);
      }

      // Login success
      const token = Token.tokenGenerator(docs.username);
      res.cookie("jwt", token);
      res.redirect(`/user/${docs.userId}`);

    } else {
      return res.send(`
        <script>
          alert('❌ Something went wrong. Please try again.');
          window.history.back();
        </script>
      `);
    }
  });
};