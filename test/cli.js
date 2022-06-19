"use strict"
/* eslint no-unused-vars: 0 */
import bag from 'bagofcli';
import _cli from 'bagofcli';
import cli from '../lib/cli.js';
import fs from 'fs';
import OpenSesame from '../lib/opensesame.js';
import referee from '@sinonjs/referee';
import sinon from 'sinon';
const assert = referee.assert;

describe('cli - exec', function() {
  it('should contain commands with actions', function(done) {
    const mockCommand = function (base, actions) {
      assert.isString(base);
      assert.isFunction(actions.commands.aws.action);
      done();
    };
    sinon.stub(_cli, 'command').value(mockCommand);
    cli.exec();
  });
});

describe('cli - _aws', function() {
  beforeEach(function (done) {
    this.mockCli = sinon.mock(_cli);
    this.mockProcess = sinon.mock(process);
    done();
  });
  afterEach(function (done) {
    this.mockCli.verify();
    this.mockProcess.verify();
    sinon.restore();
    done();
  });
  it('should pass args as AWS options', function() {
    const args = {
      region: 'ap-southeast-2',
      secgroupId: 'sg-12345678',
      parent: {
        port: 22,
        protocol: 'ssh',
        dryRun: false,
        name: 'some-wi-fi'
      }
    };
    this.mockProcess.expects('exit').once().withExactArgs(0);
    sinon.stub(OpenSesame.prototype, 'aws').value(function (region, secgroupId, cb) {
      assert.equals(region, 'ap-southeast-2');
      assert.equals(secgroupId, ['sg-12345678']);
      cb();
    });
    sinon.stub(bag, 'command').value(function (base, actions) {
      actions.commands.aws.action(args);
    });
    cli.exec();
  });
});
