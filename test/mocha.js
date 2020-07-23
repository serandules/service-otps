var nconf = require('nconf');

nconf.overrides({
    "SERVICE_CONFIGS": "master:apis:/v/configs",
    "SERVICE_USERS": "master:apis:/v/users",
    "SERVICE_TOKENS": "master:apis:/v/tokens",
    "LOCAL_CLIENTS": __dirname + "/..:apis:/v/otps"
});

require('pot');
