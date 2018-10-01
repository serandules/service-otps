var validators = require('validators');
var Otps = require('model-otps');

exports.create = function (req, res, next) {
  validators.create({
    content: 'json',
    model: Otps
  }, req, res, function (err) {
    if (err) {
      return next(err);
    }
    var data = req.body;
    var validator = validators.types.password();
    validator({
      field: 'password',
      value: data.password
    }, function (err) {
      if (err) {
        return res.pond(err);
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