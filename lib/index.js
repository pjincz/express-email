var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var fs = require('fs');

var inject_cid = function(html) {
  return html.replace(/(['"])cid:(.*?)\1/g, '$1?cid=$2$1');
};

var attachments_cid = function(resPath, html) {
  var attachments = [];
  html.replace(/(['"])cid:(.*?)\1/g, function(match, quote, cid) {
    attachments.push({
      cid: cid,
      path: path.join(resPath, cid)
    });
  });
  return attachments;
};

module.exports = function(emailPath, resPath) {
  var engine = new EmailTemplate(emailPath);
  resPath = resPath || emailPath;

  var obj = {};
  obj.preview = function(locals) {
    return function(req, res, next) {
      var url = req.originalUrl.replace(/\?.*$/, '');
      
      if (req.query.cid) {
        res.sendFile(path.join(resPath, req.query.cid));
        return;
      }

      engine.render(locals, function(err, result) {
        if (err) {
          next(err);
          return;
        }
        if (req.query.text) {
          res.set('content-type', 'text/plain');
          res.send(result.text);
        } else {
          res.send(inject_cid(result.html));
        }
      });
    };
  };

  obj.render = function(locals, callback) {
    engine.render(locals, function(err, result) {
      if (err) {
        callback(err);
        return;
      }

      result.attachments = attachments_cid(resPath, result.html);
      callback(null, result);
    });
  };

  return obj;
};

