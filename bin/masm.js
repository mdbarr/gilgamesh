#!/usr/bin/env node

'use strict';

const minimist = require('minimist');
const options = minimist(process.argv.slice(2));

const chipset = options.chipset || 'm1047';

console.log(`${ chipset } assembler`);
