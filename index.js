var log = require('logger')('service-locations');
var bodyParser = require('body-parser');

var auth = require('auth');
var throttle = require('throttle');
var serandi = require('serandi');
var model = require('model');
var Otps = require('model-otps');

var validators = require('./validators');

module.exports = function (router, done) {
  router.use(serandi.ctx);
  router.use(auth());
  router.use(throttle.apis('otps'));
  router.use(bodyParser.json());

  router.post('/',
    serandi.json,
    serandi.create(Otps),
    validators.create,
    function (req, res, next) {
    Otps.remove({
      user: req.user.id,
      name: req.body.name
    }, function (err) {
      if (err) {
        return next(err);
      }
      model.create(req.ctx, function (err, otp) {
        if (err) {
          return next(err);
        }
        res.locate(otp.id).status(201).send(otp);
      });
    });
  });

  router.get('/:id',
    serandi.id,
    serandi.findOne(Otps),
    function (req, res, next) {
    model.findOne(req.ctx, function (err, otp) {
      if (err) {
        return next(err);
      }
      res.send(otp);
    });
  });

  done();
};

