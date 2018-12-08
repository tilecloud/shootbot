#!/usr/bin/env node

'use strict';

const program = require('commander');
const shootbot = require('./lib/Shootbot');
const pkg = require('./package.json');

program
  .version(pkg.version)
  .usage('[options] <URL>')
  .option('-b, --browser <browser>', '`chrome` or `firefox`. The default is `chrome`')
  .option('-v, --viewports <viewports>', 'Viewports to take screenshots. e.g, `--viewports 1200x800,320`.')
  .option('-l, --accept-language <language>', 'The language. The default is `en`.')
  .option('-w, --waitfor <seconds>', 'The number of seconds to wait for saving screenshots. The default is `3000`.')
  .parse(process.argv);

if (0 === program.args.length) {
  program.outputHelp();
  process.exit(1);
}

const url = program.args[0]

const options = shootbot.loadOptions(program)

for (let i = 0; i < options.viewports.length; i++) {
  let [width, height] = options.viewports[i].split(/x/)

  if (!width) {
    width = 1200
  }

  let fullpage = true;
  if (height) {
    fullpage = false
  } else {
    height = 800
  }

  const prefix = url.replace(/https?:\/\//, '').replace(/\/$/, '').replace(/\//g, '-')
  const filename = `${prefix}-${options.browser}-${options.lang}-${options.viewports[i]}.png`

  shootbot.saveScreenshot(url, {
    viewport: {
      width: parseInt(width),
      height: parseInt(height),
    },
    engine: options.browser,
    lang: options.lang,
    waitfor: options.waitfor,
    filename: filename,
    fullpage: fullpage,
  }, shootbot.handler, shootbot.errorHandler)
}
