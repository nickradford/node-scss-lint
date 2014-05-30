"use strict";

var fs = require('fs');
var pkg = require('../package.json');
var path = require('path');
var glob = require('glob');
var extend = require('extend');
var winston = require('winston');
var gonzales = require('gonzales-pe');

var string = JSON.stringify;


var optimist = require('optimist')
  .usage('Lint .scss files.\nUsage: $0 [options] <files>')
  // Usage
  .describe('h', 'Display usage info')
  .alias('h', 'help')

  // Config
  .describe('c', 'Set the config gile location')
  .alias('c', 'config')
  .default('c', './scsslint.json')

  // Log Level
  .describe('l', 'Set the Log Level')
  .alias('l', 'loglevel')
  .default('l', process.env.LOG_LEVEL || 'info')

winston.cli();

exports = module.exports = function NodeScssLintCli(args) {
  console.log(args)
  var argv = optimist.parse(args);
  var configFile = path.resolve(process.cwd(), argv.config);
  var config;

  // Set up the logger
  var logger = new winston.Logger({
    transports: [
      new winston.transports.Console({level: argv.loglevel})
    ]
  });
  logger.cli();

  logger.log('debug', "Args: %s", string(argv));

  // Give people some help
  if (argv.help) {
    optimist.showHelp();
    process.exit(0);
    return;
  }

  // Load the default config
  var defaultConfigPath = path.resolve(__dirname, './scsslint.default.json')
  var defaultConfig = require(defaultConfigPath);
  var config = {};

  // Read the config file
  if (fs.existsSync(configFile) && fs.statSync(configFile).isFile) {
    var userConfig = JSON.parse(fs.readFileSync(configFile));
    extend(config, defaultConfig, userConfig);
    logger.log('debug', 'Found config file at %s', configFile)
  }
  else {
    logger.log('debug', 'Configuration file doesn\'t exist, will use default.')
    config = defaultConfig;
  }

  logger.log('debug', 'Config: %s', string(config));


  // Glob all the things
  var files = glob.sync(argv._.join(' '))
  logger.log('debug', 'Files: %s', string(files));

  // Now do something with them
  var css, ast, filePath;
  files.forEach(function(file) {
    filePath = path.resolve(process.cwd(), file);
    logger.log('debug', 'Reading file: %s', filePath);
    try {
      css = fs.readFileSync(filePath, 'utf8');
      logger.log('debug', 'CSS for %s, ', filePath, css);
    } catch (err) {
      logger.error('Couldn\'t read file %s', filePath);
    }

    ast = gonzales.cssToAST(css);
    logger.log('debug', 'AST for %s, ', filePath, ast);
  })
}
