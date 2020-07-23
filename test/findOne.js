var log = require('logger')('service-otps:test:find-one');
var errors = require('errors');
var should = require('should');
var request = require('request');
var pot = require('pot');

describe('GET /otps', function () {
  var client;

  var createOTPS = function (token, done) {
    request({
      uri: pot.resolve('apis', '/v/otps'),
      method: 'POST',
      json: {
        name: 'password-update',
        password: pot.password()
      },
      auth: {
        bearer: token
      }
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(201);
      should.exist(b);
      should.exist(b.id);
      should.exist(b.strong);
      should.exist(b.weak);
      should.exist(r.headers['location']);
      r.headers['location'].should.equal(pot.resolve('apis', '/v/otps/' + b.id));
      done(null, b);
    })
  };

  before(function (done) {
    pot.client(function (err, c) {
      if (err) {
        return done(err);
      }
      client = c;
      done();
    });
  });

  it('owner can access', function (done) {
    createOTPS(client.users[0].token, function (err, otp) {
      if (err) {
        return done(err);
      }
      request({
        uri: pot.resolve('apis', '/v/otps/' + otp.id),
        method: 'GET',
        json: true,
        auth: {
          bearer: client.users[0].token
        }
      }, function (e, r, b) {
        if (e) {
          return done(e);
        }
        r.statusCode.should.equal(200);
        should.exist(b);
        should.exist(b.id);
        should.exist(b.strong);
        should.exist(b.weak);
        done();
      });
    });
  });

  it('others can not access', function (done) {
    createOTPS(client.users[0].token, function (err, otp) {
      if (err) {
        return done(err);
      }
      request({
        uri: pot.resolve('apis', '/v/otps/' + otp.id),
        method: 'GET',
        json: true,
        auth: {
          bearer: client.users[1].token
        }
      }, function (e, r, b) {
        if (e) {
          return done(e);
        }
        r.statusCode.should.equal(errors.notFound().status);
        should.exist(b);
        should.exist(b.code);
        should.exist(b.message);
        b.code.should.equal(errors.notFound().data.code);
        done();
      });
    });
  });
});
