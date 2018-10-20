var express = require('express');
var router = express.Router();

router.post('/upload',upload.single('upl'), (req, res) => {
  // res.json({ file: req.file });
  res.redirect('/');
});


module.exports = router;


