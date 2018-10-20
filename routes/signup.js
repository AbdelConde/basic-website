var express = require('express');
var router = express.Router();

router.get('/signup', function (req, res) {
  res.render('signup/index',
  { title : 'SignUp' }
  )
});

router.post('/register',function (req, res, next) {
     
        var encpassword = bcrypt.hashSync(req.body.password, 10);;

        var dt = dateTime.create();
        var dt_reg = dt.format('Y-m-d H:M:S');
        console.log(req.body)
        var document = {
            full_name:   req.body.full_name,
            username:   req.body.username,
            email:       req.body.email, 
            password:    encpassword, 
            dob:         req.body.dob, 
            location:    req.body.location,
            dt_reg:      dt_reg
          };
          
        db.collection('profiles').save(document,(err,result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            req.session.user = result._username;
            res.redirect('/')
        })

})

module.exports = router;

