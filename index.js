var log = require('logger')('service-locations');
var bodyParser = require('body-parser');

var errors = require('errors');
var utils = require('utils');
var mongutils = require('mongutils');
var auth = require('auth');
var throttle = require('throttle');
var serandi = require('serandi');

var Otps = require('model-otps');

var validators = require('./validators');
var sanitizers = require('./sanitizers');

module.exports = function (router) {
  router.use(serandi.ctx);
  router.use(auth({}));
  router.use(throttle.apis('otps'));
  router.use(bodyParser.json());

  /**
   * {"name": "serandives app"}
   */
  router.post('/', validators.create, sanitizers.create, function (req, res) {
    Otps.remove({
      user: req.user.id,
      name: req.body.name
    }, function (err) {
      if (err) {
        log.error('otps:remove', err);
        return res.pond(errors.serverError());
      }
      Otps.create(req.body, function (err, otp) {
        if (err) {
          log.error('otps:create', err);
          return res.pond(errors.serverError());
        }
        res.locate(otp.id).status(201).send(otp);
      });
    });
  });

  router.get('/:id', validators.findOne, sanitizers.findOne, function (req, res) {
    mongutils.findOne(Otps, req.query, function (err, otp) {
      if (err) {
        log.error('otps:find-one', err);
        return res.pond(errors.serverError());
      }
      if (!otp) {
        return res.pond(errors.notFound());
      }
      res.send(otp);
    });
  });
};

