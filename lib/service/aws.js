const async = require('async');
const aws   = require('aws-sdk');
const util  = require('util');

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
Aws.prototype.addIpToSecGroup = function (protocol, ip, port, secGroupId, name, cb) {
  var self = this;

  function describeSecurityGroupsCb(err, secGroups) {
    if (err) {
      console.error('Unable to find security group');
      cb(err);
    } else {

      var secGroup = secGroups.SecurityGroups[0];
      console.log(util.format('Found security group %s', secGroup.GroupName));

      var tasks = [
        createRevokeSecurityGroupIngressTask(secGroup),
        createAuthorizeSecurityGroupIngressTask(secGroup)
      ];
      async.series(tasks, cb);
    }
  }

  function createRevokeSecurityGroupIngressTask(secGroup) {
    function task(cb) {

      var ipRanges = [];
      secGroup.IpPermissions.forEach(function (ipPermission) {
        ipPermission.IpRanges.forEach(function (ipRange) {
          if (ipRange.Description === name) {
            ipRanges.push(ipRange);
          }
        });
      });
      if (ipRanges.length === 0) {
        cb();
      } else {
        var existingIngress = {
          DryRun: self.opts.dryRun,
          GroupId: secGroup.GroupId,
          IpPermissions: [
            {
              FromPort: port,
              ToPort: port,
              IpProtocol: protocol,
              IpRanges: ipRanges
            }
          ]
        };
        console.log('--\nDeleting an existing inbound rule named %s...', name);
        function taskCb(err, data) {
          if (err) {
            console.error('Unable to delete existing inbound rule');
          } else {
            console.log(util.format('Succesfully deleted existing inbound rule named %s for IP %s on port %d with protocol %s', name, ip, port, protocol));
          }
          cb(err);
        }
        self.ec2.revokeSecurityGroupIngress(existingIngress, taskCb);
      }
    }
    return task;
  }

  function createAuthorizeSecurityGroupIngressTask(secGroup) {
    function task(cb) {
      var newIngress = {
        DryRun: self.opts.dryRun,
        GroupId: secGroup.GroupId,
        IpPermissions: [
          {
            FromPort: port,
            ToPort: port,
            IpProtocol: protocol,
            IpRanges: [
              {
                CidrIp: ip + '/32',
                Description: name
              }
            ]
          }
        ]
      };
      console.log('--\nAdding a new inbound rule named %s...', name);
      function taskCb(err, data) {
        if (err) {
          console.error('Unable to add new inbound rule');
        } else {
          console.log(util.format('Succesfully added new inbound rule named %s for IP %s on port %d with protocol %s', name, ip, port, protocol));
        }
        cb(err);
      }
      self.ec2.authorizeSecurityGroupIngress(newIngress, taskCb);
    }
    return task;
  }

  console.log(util.format('--\nRetrieving security group %s ...', secGroupId));
  this.ec2.describeSecurityGroups({
    GroupIds: [secGroupId]
  }, describeSecurityGroupsCb);
};

module.exports = Aws;
