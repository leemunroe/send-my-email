var express = require('express');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var app = express();

var port = process.env.PORT || 3000
var router = express.Router();

// view engine setup
// app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('layout', 'layout'); // defaults to 'layout'

app.use(require('node-compass')({mode: 'expanded'}));
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

  // var recipients = req.body.to.split(',');
  // var recipientsLength = recipients.length;
  // var recipientVars
  // for (var i = 0; i < recipientsLength; i++) {
  //   recipientVars += '"recipients[i]": {},'
  // }

  var data = {
    from: req.body.myname +"<"+req.body.email+">",
    to: req.body.to,
    'recipient-variables': '{}',
    subject: req.body.subject,
    html: req.body.html,
    text: req.body.plaintext,
    'o:tag': req.body.tag
  };
  console.log(req.body);
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
    //Email not sent
      if (error) {
          res.render('index', { title: 'No Email', msg: 'Error. Something went wrong.', err: true })
      }
      //Yay!! Email sent
      else {
          res.render('index', { title: 'Sent Email', msg: 'Yay! Message successfully sent.', err: false })
      }
  });

});

app.listen(port);
console.log('App running on port', port);
