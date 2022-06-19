"use strict"
import bag from 'bagofcli';
import p from 'path';
import OpenSesame from './opensesame.js';

const DIRNAME = p.dirname(import.meta.url).replace('file://', '');

function _aws(args) {
  const opts = {
    port: args.parent.port,
    protocol: args.parent.protocol,
    dryRun: args.parent.dryRun,
    name: args.parent.name
  };
  const secGroupIds = args.secgroupId.split(',');
  new OpenSesame(opts).aws(args.region, secGroupIds, bag.exit);
}

/**
 * Execute open-sesame CLI.
 */
 function exec() {

  const actions = {
    commands: {
      aws : { action: _aws }
    }
  };

  bag.command(DIRNAME, actions);
}

const exports = {
  exec: exec
};

export {
  exports as default
};
