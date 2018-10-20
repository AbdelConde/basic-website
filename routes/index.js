var express   = require('express');
var router    = express.Router();

router.get('/', function (req, res) {
  var data = { title : 'Home' };
  if(req.session && req.session.user){
      data = { title : 'Home',user: req.session.user};
  }
  res.render('index',data);
});

module.exports = router;


