'use strict';

const architecture = require('./architecture');

// Event listeners
function m1047() {
  const chipset = {
    bits: 8,
    registers: 8,
    io: {
      digital: 4,
      analog: 2,
      mapped: 32
    },
    ram: 256,
    rom: 64,
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

  const io = {
    digital: new architecture.BitField(chipset.io.digital),
    analog: new architecture.IntegerField({
      bits: chipset.bits,
      size: chipset.io.analog,
      signed: false
    }),
    mapped: new architecture.IntegerField({
      bits: chipset.bits,
      size: chipset.io.mapped,
      signed: false
    })
  };

  const ram = new architecture.IntegerField({
    bits: chipset.bits,
    size: Math.min(chipset.ram, RAM_MAX),
    signed: true
  });

  const rom = new architecture.IntegerField({
    bits: chipset.bits,
    size: Math.min(chipset.rom, RAM_MAX),
    signed: true
  });

  //////////
  // Further abstraction? push, pop? built into integer field?
  //  or ram / rom abstractions?
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

  io.digital.clear();
  io.analog.clear();
  io.mapped.clear();

  sp.clear();
  ip.clear();

  ram.clear();
  rom.clear();

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
