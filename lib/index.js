var emailTemplates = require('email-templates');
var path = require('path');

module.exports = function(opts) {
  var subdir = path.basename(opts.path);
  dirpath = path.dirname(opts.path);
  var locals = opts.locals;

  return function(req, res, next) {
    if (req.query.cid) {
      if (typeof opts.cid === 'object') {
        if (opts.cid[req.query.cid]) {
          res.sendFile(opts.cid[req.query.cid]);
        } else {
          next();
        }
      } else if (typeof opts.cid === 'string') {
        res.sendFile(path.join(opts.cid, req.query.cid));
      } else {
        res.sendFile(path.join(opts.path, req.query.cid));
      }
      return;
    }

    var reqPath = req.originalUrl.replace(/\?.*$/, '');

    emailTemplates(dirpath, function(err, template) {
      if (err) {
        next(err);
        return;
      }
      template(subdir, locals, function(err, html, text) {
        if (err) {
          next(err);
          return;
        }
        if (reqPath.match(/\.txt$/) || reqPath.match(/\.text$/)) {
          res.set('content-type', 'text/plain');
          res.send(text);
        } else {
          res.send(html.replace(/'cid:([^']+)'/g, '\'?cid=$1\'').replace(/"cid:([^"]+)"/g, '"?cid=$1"'));
        }
      });
    });
  };
};
