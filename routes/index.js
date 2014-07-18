var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Send Email' });
});

// POST the form
router.post('/', function(req, res) {
  var api_key = req.key;
  var domain = req.domain;
  var Mailgun = require('mailgun-js');

  var mailgun = new Mailgun({apiKey: api_key, domain: domain});

  var data = {
    from: req.name + "<" + req.from + ">",
    to: req.to,
    subject: req.subject,
    html: req.html
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
    console.log(req.to);
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

module.exports = router;
