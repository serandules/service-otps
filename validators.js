var log = require('logger')('service-otps:validators');
var errors = require('errors');

exports.create = function (req, res, next) {
  var data = req.body;
  var password = data.password;
  if (!password) {
    return res.pond(errors.unprocessableEntity('\'password\' needs to be specified'));
  }
  var user = req.user;
  user.auth(password, function (err, auth) {
    if (err) {
      log.error('users:auth', err);
      return res.pond(errors.serverError());
    }
    if (!auth) {
      return res.pond(errors.unauthorized());
    }
    next();
  });
};