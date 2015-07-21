Express mail preview
====================

Render email by [node-email-templates](https://github.com/niftylettuce/node-email-templates) and 
show in web browser.

Usage
-----

    var preview = require('express-mail-preview');

    if (app.get('env') === 'development') {
      var opts = {
        path: path_to_mail_dir, # for more, see node-email-templates
        locals: {billing_id: 123, user: 'tony'...}, # locals for render template
        cid: where_to_find_cid
      };
      app.get('/_mail/billing.html', preview(opts));    # preview html
      app.get('/_mail/billing.txt', preview(opts));     # preview text
    }

If path end with .txt or .text, will show text, elsewise, show html.

* `opts.path`: email template dir, see node-email-templates for more details

* `opts.locals`: locals, for render template, see `ejs`, `jade`... for more details

* `opts.cid`: where to find cid

  * null or undefined: search in opts.path
  * path: seach in path
  * {aaa: path\_of\_aaa, bbb: path\_of\_bbb...}: special as hash

Then, run app in development mode, access `/_mail/billing.html` and `/_mail/billing.txt`, you can view your email.
