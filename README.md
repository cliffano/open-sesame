<img align="right" src="https://raw.github.com/cliffano/open-sesame/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://img.shields.io/travis/cliffano/open-sesame.svg)](http://travis-ci.org/cliffano/open-sesame)
[![Dependencies Status](https://img.shields.io/david/cliffano/open-sesame.svg)](http://david-dm.org/cliffano/open-sesame)
[![Coverage Status](https://img.shields.io/coveralls/cliffano/open-sesame.svg)](https://coveralls.io/r/cliffano/open-sesame?branch=master)
[![Published Version](https://img.shields.io/npm/v/open-sesame.svg)](http://www.npmjs.com/package/open-sesame)
<br/>
[![npm Badge](https://nodei.co/npm/open-sesame.png)](http://npmjs.org/package/open-sesame)

Open Sesame
-----------

Open Sesame is a CLI tool for adding your public IP address to AWS security group's inbound rules.

This is handy when you're sitting behind a dynamic IP (e.g. you're using a Wi-Fi dongle) and would like to allow access to some AWS resources through a security group.

![Console command screenshot](https://raw.github.com/cliffano/open-sesame/master/screenshots/console.png)

Installation
------------

    npm install -g open-sesame

Usage
-----

Add inbound rule through specified security group, rule will be named 'open-sesame':

    open-sesame aws --region ap-southeast-2 --secgroup-id sg-12345678

Add inbound rule with specified port and name:

    open-sesame aws --region ap-southeast-2 --secgroup-id sg-12345678 --port 22 --name some-wi-fi

Colophon
--------

[Developer's Guide](http://cliffano.github.io/developers_guide.html#nodejs)

Build reports:

* [Code complexity report](http://cliffano.github.io/open-sesame/complexity/plato/index.html)
* [Unit tests report](http://cliffano.github.io/open-sesame/test/buster.out)
* [Test coverage report](http://cliffano.github.io/open-sesame/coverage/buster-istanbul/lcov-report/lib/index.html)
* [Integration tests report](http://cliffano.github.io/open-sesame/test-integration/cmdt.out)
* [API Documentation](http://cliffano.github.io/open-sesame/doc/dox-foundation/index.html)
