<img align="right" src="https://raw.github.com/cliffano/open-sesame/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://github.com/cliffano/open-sesame/workflows/CI/badge.svg)](https://github.com/cliffano/open-sesame/actions?query=workflow%3ACI)
[![Security Status](https://snyk.io/test/github/cliffano/open-sesame/badge.svg)](https://snyk.io/test/github/cliffano/open-sesame)
[![Dependencies Status](https://img.shields.io/david/cliffano/open-sesame.svg)](http://david-dm.org/cliffano/open-sesame)
[![Coverage Status](https://img.shields.io/coveralls/cliffano/open-sesame.svg)](https://coveralls.io/r/cliffano/open-sesame?branch=master)
[![Published Version](https://img.shields.io/npm/v/open-sesame.svg)](http://www.npmjs.com/package/open-sesame)
<br/>

Open Sesame
-----------

Open Sesame is a CLI tool for adding your public IP address to AWS security group's inbound rules.

This is handy when you're sitting behind a dynamic IP (e.g. you're using a Wi-Fi dongle) and would like to allow access from that IP to some AWS resources through a security group.

![Console command screenshot](https://raw.github.com/cliffano/open-sesame/master/screenshots/console.png)

Installation
------------

    npm install -g open-sesame

Usage
-----

Add inbound rule to specified security group, rule will be named 'open-sesame':

    open-sesame aws --region ap-southeast-2 --secgroup-id sg-12345678

Add inbound rule with specified port and name:

    open-sesame aws --region ap-southeast-2 --secgroup-id sg-12345678 --port 22 --rule-name some-wi-fi

Note: open-sesame 1.x.x uses `--name` arg instead of `--rule-name` .

Add inbound rules to multiple security groups:

    open-sesame aws --region ap-southeast-2 --secgroup-id sg-12345678,sg-87654321

Permission
----------

You can use the example below to provision an IAM policy for Open Sesame to use:

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "OpenSesame0",
                "Effect": "Allow",
                "Action": [
                    "ec2:DescribeSecurityGroups"
                ],
                "Resource": [
                    "*"
                ]
            },
            {
                "Sid": "OpenSesame1",
                "Effect": "Allow",
                "Action": [
                    "ec2:RevokeSecurityGroupIngress",
                    "ec2:AuthorizeSecurityGroupIngress"
                ],
                "Resource": [
                    "arn:aws:ec2:<region>:<account_id>:security-group/sg-12345678",
                    "arn:aws:ec2:<region>:<account_id>:security-group/sg-87654321"
                ]
            }
        ]
    }

Colophon
--------

[Developer's Guide](https://cliffano.github.io/developers_guide.html#nodejs)

Build reports:

* [Code complexity report](https://cliffano.github.io/open-sesame/complexity/plato/index.html)
* [Unit tests report](https://cliffano.github.io/open-sesame/test/mocha.txt)
* [Test coverage report](https://cliffano.github.io/open-sesame/coverage/c8/index.html)
* [Integration tests report](https://cliffano.github.io/open-sesame/test-integration/cmdt.txt)
* [API Documentation](https://cliffano.github.io/open-sesame/doc/jsdoc/index.html)
