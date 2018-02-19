var bag          = require('bagofcli');
var buster       = require('buster-node');
var _cli         = require('bagofcli');
var cli          = require('../lib/cli');
const OpenSesame = require('../lib/opensesame');
var referee      = require('referee');
var assert       = referee.assert;

buster.testCase('cli - exec', {
  setUp: function () {
    this.mock({});
  },
  'should contain commands with actions': function (done) {
    var mockCommand = function (base, actions) {
      assert.defined(base);
      assert.defined(actions.commands.aws.action);
      done();
    };
    this.stub(_cli, 'command', mockCommand);
    cli.exec();
  }
});

buster.testCase('cli - _aws', {
  setUp: function () {
    this.mockCli = this.mock(_cli);
    this.mockProcess = this.mock(process);
  },
  'should pass args as AWS options': function () {
    var args = {
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
    this.stub(OpenSesame.prototype, 'aws', function (region, secgroupId, cb) {
      assert.equals(region, 'ap-southeast-2');
      assert.equals(secgroupId, 'sg-12345678');
      cb();
    });
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.aws.action(args);
    });
    cli.exec();
  }
});
