var log = require('logger')('service-otps:validators');
var validators = require('validators');
var Otps = require('model-otps');
var errors = require('errors');

exports.create = function (req, res, next) {
  validators.create({
    content: 'json',
    model: Otps
  }, req, res, function (err) {
    if (err) {
      return next(err);
    }
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
  });
};

exports.findOne = function (req, res, next) {
  validators.findOne({
    id: req.params.id,
    model: Otps
  }, req, res, next);
};