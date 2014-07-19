var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('layout', 'layout') // defaults to 'layout'

app.use(require('node-compass')({mode: 'expanded'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: false }));

/* GET home page. */
app.get('/', function(req, res) {
  res.render('index', { title: 'Send Email', msg: false, err: true });
});

// POST the form
app.post('/', function(req, res) {
  var api_key = req.body.key;
  var domain = req.body.mydomain;
  var Mailgun = require('mailgun-js');

  var mailgun = new Mailgun({apiKey: api_key, domain: domain});

  var data = {
    from: req.body.myname +"<"+req.body.email+">",
    to: req.body.to,
    subject: req.body.subject,
    html: req.body.html
  };
  console.log(req.body);
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
    //Email not sent
      if (error) {
          res.render('index', { title: 'No Email', msg: 'Error', err: true })
      }
      //Yay!! Email sent
      else {
          res.render('index', { title: 'Sent Email', msg: 'Yay!', err: false })
      }
  });

});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
