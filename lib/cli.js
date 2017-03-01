const cli        = require('bagofcli');
const OpenSesame = require('./opensesame');

function _aws(args, cb) {
  var opts = {
    port: args.parent.port,
    protocol: args.parent.protocol,
    dryRun: args.parent.dryRun
  };
  new OpenSesame(opts).aws(args.region, args.secgroupId, cli.exit);
}

/**
 * Execute open-sesame CLI.
 */
function exec() {

  var actions = {
    commands: {
      'aws': { action: _aws }
    }
  };

  cli.command(__dirname, actions);
}

exports.exec   = exec;
