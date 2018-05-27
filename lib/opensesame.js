const async = require('async');
const Aws   = require('./service/aws.js');
const ipify = require('ipify');
const util  = require('util');

/**
 * class OpenSesame
 */
function OpenSesame(opts) {
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
OpenSesame.prototype.aws = function (region, secGroupIds, cb) {

  var self = this;

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
      var tasks = [];
      var aws = new Aws(region, self.opts);
      secGroupIds.forEach(function (secGroupId) {
        tasks.push(createAddIpToSecGroupTask(aws, ip, secGroupId));
      });
      async.series(tasks, cb);
    }
  }

  this._getPublicIp(addPublicIp);
};

OpenSesame.prototype._getPublicIp = function (cb) {
  console.log('--\nRetrieving public IP address...');
  ipify().then(ip => {
    console.log(util.format('IP is %s', ip));
    cb(null, ip);
  })
  .catch((err) => {
    console.error('Unable to retrieve public IP');
    cb(err);
  });
};

module.exports = OpenSesame;
