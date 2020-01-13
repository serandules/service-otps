var log = require('logger')('service-otps:test:create');
var errors = require('errors');
var should = require('should');
var request = require('request');
var pot = require('pot');

describe('POST /otps', function () {
  var client;
  before(function (done) {
    pot.client(function (err, c) {
      if (err) {
        return done(err);
      }
      client = c;
      done();
    });
  });

  it('with no media type', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/otps'),
      method: 'POST',
      auth: {
        bearer: client.users[0].token
      }
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(errors.unsupportedMedia().status);
      should.exist(b);
      b = JSON.parse(b);
      should.exist(b.code);
      should.exist(b.message);
      b.code.should.equal(errors.unsupportedMedia().data.code);
      done();
    });
  });

  it('with unsupported media type', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/otps'),
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml'
      },
      auth: {
        bearer: client.users[0].token
      }
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(errors.unsupportedMedia().status);
      should.exist(b);
      b = JSON.parse(b);
      should.exist(b.code);
      should.exist(b.message);
      b.code.should.equal(errors.unsupportedMedia().data.code);
      done();
    });
  });

  it('without name', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/otps'),
      method: 'POST',
      json: {
        password: 'dummy'
      },
      auth: {
        bearer: client.users[0].token
      }
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(errors.unprocessableEntity().status);
      should.exist(b);
      should.exist(b.code);
      should.exist(b.message);
      b.code.should.equal(errors.unprocessableEntity().data.code);
      done();
    });
  });

  it('without password', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/otps'),
      method: 'POST',
      json: {
        name: 'password-update'
      },
      auth: {
        bearer: client.users[0].token
      }
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(errors.unprocessableEntity().status);
      should.exist(b);
      should.exist(b.code);
      should.exist(b.message);
      b.code.should.equal(errors.unprocessableEntity().data.code);
      done();
    });
  });

  it('with invalid password', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/otps'),
      method: 'POST',
      json: {
        name: 'password-update',
        password: 'invalid'
      },
      auth: {
        bearer: client.users[0].token
      }
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(errors.unauthorized().status);
      should.exist(b);
      should.exist(b.code);
      should.exist(b.message);
      b.code.should.equal(errors.unauthorized().data.code);
      done();
    });
  });

  it('without token', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/otps'),
      method: 'POST',
      json: {
        name: 'password-update',
        password: pot.password()
      }
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(errors.unauthorized().status);
      should.exist(b);
      should.exist(b.code);
      should.exist(b.message);
      b.code.should.equal(errors.unauthorized().data.code);
      done();
    });
  });

  it('with invalid token', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/otps'),
      method: 'POST',
      json: {
        name: 'password-update',
        password: pot.password()
      },
      auth: {
        bearer: 'f7839fb107db8361d929e46a0001b8bb00a0a8db6c4c67aa117bd10de90c9d1379b98dee742b605ccd74e8b1492465ec'
      }
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(errors.unauthorized().status);
      should.exist(b);
      should.exist(b.code);
      should.exist(b.message);
      b.code.should.equal(errors.unauthorized().data.code);
      done();
    });
  });

  it('with valid password', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/otps'),
      method: 'POST',
      json: {
        name: 'password-update',
        password: pot.password()
      },
      auth: {
        bearer: client.users[0].token
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
      r.headers['location'].should.equal(pot.resolve('accounts', '/apis/v/otps/' + b.id));
      done();
    });
  });

  it('removes old one', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/otps'),
      method: 'POST',
      json: {
        name: 'password-update',
        password: pot.password()
      },
      auth: {
        bearer: client.users[0].token
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
      r.headers['location'].should.equal(pot.resolve('accounts', '/apis/v/otps/' + b.id));
      var old = b.id;
      request({
        uri: pot.resolve('accounts', '/apis/v/otps'),
        method: 'POST',
        json: {
          name: 'password-update',
          password: pot.password()
        },
        auth: {
          bearer: client.users[0].token
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
        r.headers['location'].should.equal(pot.resolve('accounts', '/apis/v/otps/' + b.id));
        request({
          uri: pot.resolve('accounts', '/apis/v/otps/' + old),
          method: 'GET',
          json: true,
          auth: {
            bearer: client.users[0].token
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
});
