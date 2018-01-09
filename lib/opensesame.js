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
 * @param {Function} cb: standard cb(err, result) callback
 */
OpenSesame.prototype.aws = function (region, secGroupId, cb) {

  var self = this;
  function addPublicIp(err, ip) {
    if (err) {
      cb(err);
    } else {
      new Aws(region, self.opts).addIpToSecGroup(self.opts.protocol, ip, self.opts.port, secGroupId, self.opts.name, cb);
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
