/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , fs = require('fs')
  , url = require('url')
  , session = require('express-session')
  , cookieParser = require('cookie-parser');;

var dateTime = require('node-datetime');

var User = require("./models/User");

const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

/* record-audio dependencies */
var BinaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');

/* Database */

//var dbUrl = 'mongodb://localhost:27017/earthling';
var dbUrl = "mongodb://d2smtsw:earthlingd2@ds137483.mlab.com:37483/earthling";


// Create mongo connection
const conn = mongoose.createConnection(dbUrl);

var outFile = 'demo.wav';
var port = 3000;
var app = express()


function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))
app.use(session({
  secret: 'd2ss',
  resave: true,
  saveUninitialized: false
}));

app.get('/', function (req, res) {
  var data = { title : 'Home' };
  if(req.session && req.session.user){
      data = { title : 'Home',cUser: req.session.user};
  }
  res.render('index',data);
})

app.get('/profile', function (req, res) {
  var data = { title : 'Profile' };
  if(req.session && req.session.user){
      data = { title : 'Profile',cUser: req.session.user};
  }
  res.render('profile/index',data);
})

app.get('/signup', function (req, res) {
  res.render('signup/index',
  { title : 'SignUp' }
  )
})

app.get('/login', function (req, res) {
  res.render('login/index',
  { title : 'Login' }
  )
})

app.post('/users',function(req, res){
   db.collection('profiles')
           .find()
           .toArray(function(err, result){
               if(err){
                   return console.log(err);
               }
               res.send(result);
   });
});


app.listen(port)
console.log('server open on port ' + port);

/* record-audio functions */
binaryServer = BinaryServer({port: 9001});

binaryServer.on('connection', function(client) {
  console.log('new connection');

  var fileWriter = new wav.FileWriter(outFile, {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });

  client.on('stream', function(stream, meta) {
    console.log('new stream');
    stream.pipe(fileWriter);

    stream.on('end', function() {
      fileWriter.end();
      console.log('wrote to file ' + outFile);
    });
  });
});

// Init gfs
let gfs;
var db;

conn.once('open', () => {
  db = conn.db;
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log("connected db")
});

// Create storage engine
const storage = new GridFsStorage({
  url: dbUrl,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const metadata = {
            user_id:req.session.user
        }
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
          metadata: metadata
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });
// @route POST /upload
// @desc  Uploads file to DB

app.post('/upload',upload.single('upl'), (req, res) => {
  // res.json({ file: req.file });
  console.log(req.body)
  console.log(req.file)
//   req.pipe(fs.createWriteStream('public/mySong.wav'))
//    .on('error', (e) => res.status(500).end(e.message))
//    .on('close', () => {
//        res.end('File saved')
//  })  

 // upload.single('file')
  res.redirect('/');
});

/* Login to db */
app.post('/auth',function (req, res) {
    console.log(req.body)
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
})

app.post('/register',function (req, res, next) {
     
//    hmac = crypto.createHmac("sha1", 'd2smarts0ft');
        var encpassword = bcrypt.hashSync(req.body.password, 10);;

//        if(req.body.password){
//          hmac.update(req.body.password);
//          encpassword = hmac.digest("hex");
//        }

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
//            req.session.userId = result._id;
            res.locals.user = result._id;
            res.redirect('/')
        })

})