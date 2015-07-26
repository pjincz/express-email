var express = require('express');
var ExpressEmail = require('../lib');
var nodemailer = require('nodemailer');

var app = express();

var helloMail = ExpressEmail(__dirname + '/emails/hello');
var transport = nodemailer.createTransport();

app.get('/', function(req, res) {
  res.render('index.jade');
});

app.get('/preview', helloMail.preview({name: '{name}'}));

app.get('/send', function(req, res) {
  var email = req.query.email;
  var name = req.query.name;

  helloMail.render({name: name}, function(err, result) {
    if (err) {
      res.send(err);
      return;
    }

    transport.sendMail({
      from: 'admin@jcz.im',
      to: email,
      subject: 'a test email from express-email',
      text: result.text,
      html: result.html,
      attachments: result.attachments
    }, function(err, info) {
      if (err) {
        res.send(err);
        return;
      }
      res.send('An email have sent to ' + email + 
          '<br>Notice: This mail is sent directly in demo, so it may be in your spam. Do not do this in your production code.');
    })
  });
});

app.listen(3000);
