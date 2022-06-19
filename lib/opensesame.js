"use strict"
import async from 'async';
import Aws from './service/aws.js';
import ipify from 'ipify';
import util from 'util';

/**
 * class OpenSesame
 */
class OpenSesame {
  
  /**
   * Construct OpenSesame object.
   *
   * @param {Object} opts: optional settings
   *   - port: port numbeer of the ingress rule
   *   - protocol: protocol of the ingress rule
   *   - name: name of the ingress rule
   *   - dryRun: when true, changelog file won't be modified
   */
  constructor(opts) {
    this.opts = opts || {};
    this.opts.port = this.opts.port || 22;
    this.opts.protocol = this.opts.protocol || 'tcp';
    this.opts.dryRun = this.opts.dryRun || false;
    this.opts.name = this.opts.name || 'open-sesame';
  }

  /**
   * Add public IP address to AWS security group inbound rules.
   *
   * @param {String} region: AWS region
   * @param {Array} secGroupIds: an array of AWS security group IDs
   * @param {Function} cb: standard cb(err, result) callback
   */
  aws(region, secGroupIds, cb) {

    const self = this;

    function createAddIpToSecGroupTask(aws, ip, secGroupId) {
      function task(cb) {
        aws.addIpToSecGroup(self.opts.protocol, ip, self.opts.port, secGroupId, self.opts.name, cb);
      }
      return task;
    }
    function addPublicIp(err, ip) {
      if (err) {
        cb(err);
      } else {
        const tasks = [];
        const aws = new Aws(region, self.opts);
        secGroupIds.forEach(function (secGroupId) {
          tasks.push(createAddIpToSecGroupTask(aws, ip, secGroupId));
        });
        async.series(tasks, cb);
      }
    }

    this._getPublicIp(addPublicIp);
  }

  _getPublicIp(cb) {
    console.log('--\nRetrieving public IP address...');
    ipify().then(ip => {
      console.log(util.format('IP is %s', ip));
      cb(null, ip);
    })
    .catch((err) => {
      console.error('Unable to retrieve public IP');
      cb(err);
    });
  }

}

export {
  OpenSesame as default
};
