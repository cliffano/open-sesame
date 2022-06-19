"use strict"
/* eslint no-unused-vars: 0 */
import async from 'async';
import aws from 'aws-sdk';
import util from 'util';

/**
 * class Aws
 */
class Aws {
  
  constructor(region, opts) {
    this.opts = opts || {};

    aws.config.update({region: region });
    this.ec2 = new aws.EC2({ apiVersion: '2016-11-15' });
  }

  /**
   * Add public IP address to AWS security group inbound rules.
   *
   * @param {Function} cb: standard cb(err, result) callback
   */
  addIpToSecGroup(protocol, ip, port, secGroupId, name, cb) {
    const self = this;

    function describeSecurityGroupsCb(err, secGroups) {
      if (err) {
        console.error('Unable to find security group');
        cb(err);
      } else {

        let secGroup = secGroups.SecurityGroups[0];
        console.log(util.format('Found security group %s', secGroup.GroupName));

        const tasks = [
          createRevokeSecurityGroupIngressTask(secGroup),
          createAuthorizeSecurityGroupIngressTask(secGroup)
        ];
        async.series(tasks, cb);
      }
    }

    function createRevokeSecurityGroupIngressTask(secGroup) {
      function task(cb) {

        function taskCb(err, data) {
          if (err) {
            console.error('Unable to delete existing inbound rule');
          } else {
            console.log(util.format('Succesfully deleted existing inbound rule named %s for IP %s on port %d with protocol %s', name, ingressMatch[0].ipRange.CidrIp, ingressMatch[0].fromPort, ingressMatch[0].ipProtocol));
          }
          cb(err);
        }

        let ingressMatch = [];
        secGroup.IpPermissions.forEach(function (ipPermission) {
          ipPermission.IpRanges.forEach(function (ipRange) {
            if (ipRange.Description === name) {
              ingressMatch.push({
                fromPort: ipPermission.FromPort,
                toPort: ipPermission.ToPort,
                ipProtocol: ipPermission.IpProtocol,
                ipRange: ipRange
              });
            }
          });
        });
        if (ingressMatch.length === 0) {
          cb();
        } else {
          const existingIngress = {
            DryRun: self.opts.dryRun,
            GroupId: secGroup.GroupId,
            IpPermissions: [
              {
                FromPort: ingressMatch[0].fromPort,
                ToPort: ingressMatch[0].toPort,
                IpProtocol: ingressMatch[0].ipProtocol,
                IpRanges: [ingressMatch[0].ipRange]
              }
            ]
          };
          console.log('--\nDeleting an existing inbound rule named %s...', name);
          self.ec2.revokeSecurityGroupIngress(existingIngress, taskCb);
        }
      }
      return task;
    }

    function createAuthorizeSecurityGroupIngressTask(secGroup) {
      function task(cb) {

        function taskCb(err, data) {
          if (err) {
            console.error('Unable to add new inbound rule');
          } else {
            console.log(util.format('Succesfully added new inbound rule named %s for IP %s on port %d with protocol %s', name, ip, port, protocol));
          }
          cb(err);
        }
        
        const newIngress = {
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
        self.ec2.authorizeSecurityGroupIngress(newIngress, taskCb);
      }
      return task;
    }

    console.log(util.format('--\nRetrieving security group %s ...', secGroupId));
    this.ec2.describeSecurityGroups({
      GroupIds: [secGroupId]
    }, describeSecurityGroupsCb);
  }
}

export {
  Aws as default
};

