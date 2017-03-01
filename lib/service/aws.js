const aws         = require('aws-sdk');
const cidrMatcher = require('cidr-matcher');
const util        = require('util');

/**
 * class Aws
 */
function Aws(region, opts) {
  this.opts = opts || {};

  aws.config.update({region: region });
  this.ec2 = new aws.EC2({ apiVersion: '2016-11-15' });
}

/**
 * Add public IP address to AWS security group inbound rules.
 *
 * @param {Function} cb: standard cb(err, result) callback
 */
Aws.prototype.addIpToSecGroup = function (protocol, ip, port, secGroupId, cb) {
  var self = this;

  function describeSecurityGroupsCb(err, secGroups) {
    if (err) {
      console.error('Unable to find security group');
      cb(err);
    } else {

      var secGroup = secGroups.SecurityGroups[0];
      console.log(util.format('Found security group %s', secGroup.GroupName));

      var existingIngress = [];
      secGroup.IpPermissions.forEach(function (ipPermission) {
        ipPermission.IpRanges.forEach(function (ipRange) {
          existingIngress.push(ipRange.CidrIp);
        });
      });

      var matcher = new cidrMatcher(existingIngress);
      if (matcher.contains(ip)) {
        console.log(util.format('IP %s is already within range of existing inbound rules', ip));
        cb();
      } else {
        var newIngress = {
          CidrIp: ip + '/32',
          DryRun: self.opts.dryRun,
          FromPort: port,
          GroupId: secGroup.GroupId,
          IpProtocol: protocol,
          ToPort: port
        };
        self.ec2.authorizeSecurityGroupIngress(newIngress, authorizeSecurityGroupIngressCb);
      }
    }
  }

  function authorizeSecurityGroupIngressCb(err, data) {
    if (err) {
      console.error('Unable to set inbound rule');
    } else {
      console.log(util.format('Succesfully set inbound rule for IP %s on port %d with protocol %s', ip, port, protocol));
    }
    cb(err);
  }

  console.log(util.format('--\nRetrieving security group %s ...', secGroupId));
  this.ec2.describeSecurityGroups({
    GroupIds: [secGroupId]
  }, describeSecurityGroupsCb);
};

module.exports = Aws;
