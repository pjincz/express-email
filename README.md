Express email
=============

Email solution in node.js.  
Render by [node-email-templates](https://github.com/niftylettuce/node-email-templates)  
Preview by [express.js](http://expressjs.com/)  
Send by [nodemailler](https://github.com/andris9/Nodemailer)  

Usage
-----

    var billing_email = require('express-email')(__dirname + '/email/billing');

    // preview
    if (app.get('env') === 'development') {
      var locals = {activation_code: '000000-0000-00000000-000000-00000000'};
      app.get('/_mail/billing', billing_email.preview(locals));
    }

    // render
    app.get('/sendBilling', function(req, res, next) {
      // ...
      var locals = {activation_code: ...};
      billing_email.render(locals, function(err, result) {
        // result.html
        // result.text
        // result.attachments
        transporter.sendEmail({
          from: ...,
          to: ...,
          subject: ...,
          html: result.html,
          text: result.text,
          attachments: result.attachments
        });
      });
    });

API
---

* `ExpressEmail(mail_dir, [res_dir])` -> EmailEngine

  `mail_dir`: see [node-email-templates]  
  `res_dir`: for seaching cid, default: `mail_dir`

* `EmailEngine#preview(locals)` -> Express handler

  example: `app.get('/_email', engine.preview(locals));`
  `locals`: for render template  

  In brower:  
  `get /_email` -> email html preview  
  `get /_email?text=1` -> email text preview  

* `EmailEngine#render(locals, callback)`

  `locals`: for render template  
  `callback`: `function(err, result)`  
  `result.html`: html result  
  `result.text`: text result  
  `result.attachments`: attachments for cid  

Notice: you can reference cids in your html template, Express email will known it,
and find them in res\_dir, and generate `result.attachments`
