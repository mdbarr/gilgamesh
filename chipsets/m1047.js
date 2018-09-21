'use strict';

const architecture = require('./architecture');

function m1047() {
  const chipset = {
    bits: 8,
    registers: 8,
    ram: 256,
    io: {
      digital: 4,
      analog: 2
    },
    speed: 16
  };

  const RAM_MAX = Math.pow(2, chipset.bits);
  const FREQUENCY = Math.floor(1000 / chipset.speed);

  //////////

  const registers = new architecture.IntegerField({
    bits: chipset.bits,
    size: chipset.registers
  });

  const flags = new architecture.BitField(chipset.bits);

  const ram = new architecture.IntegerField({
    bits: chipset.bits,
    size: Math.min(chipset.ram, RAM_MAX),
    signed: true
  });

  const sp = new architecture.Integer({
    bits: chipset.bits,
    signed: false
  });
  const ip = new architecture.Integer({
    bits: chipset.bits,
    signed: false
  });

  //////////

  registers.clear();
  flags.clear();
  ram.clear();
  sp.clear();
  ip.clear();

  //////////

  let interval;
  this.cycle = function() {

  };

  this.boot = function() {
    interval = setInterval(this.cycle, FREQUENCY);
  };

  this.halt = function() {
    clearInterval(interval);
  };
}

module.exports = m1047;
