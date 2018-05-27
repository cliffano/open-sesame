const cli        = require('bagofcli');
const OpenSesame = require('./opensesame');

function _aws(args) {
  var opts = {
    port: args.parent.port,
    protocol: args.parent.protocol,
    dryRun: args.parent.dryRun,
    name: args.parent.name
  };
  var secGroupIds = args.secgroupIds.split(',');
  new OpenSesame(opts).aws(args.region, secGroupIds, cli.exit);
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

exports.exec = exec;
