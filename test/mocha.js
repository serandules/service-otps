var nconf = require('nconf');

nconf.overrides({
    "SERVICE_CONFIGS": "master:accounts:/apis/v/configs",
    "SERVICE_USERS": "master:accounts:/apis/v/users",
    "SERVICE_TOKENS": "master:accounts:/apis/v/tokens",
    "LOCAL_CLIENTS": __dirname + "/..:accounts:/apis/v/otps"
});