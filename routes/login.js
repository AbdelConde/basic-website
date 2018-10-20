var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('login/index',{ title : 'Login' });
});

router.post('/auth',function (req, res) {
    if (req.body.username && req.body.password) {
        db.collection('profiles').findOne({ username: req.body.username}, function(err, user) {
            if (err) {
                res.end(err);
              } else if (!user) {
                res.end("User not found");
              }
              bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result === true) {
                    req.session.user = user.username;
                    res.redirect('/')
                } else {
                  res.end("Username or password incorrect");
                }
              })
        });
  }
});

module.exports = router;
