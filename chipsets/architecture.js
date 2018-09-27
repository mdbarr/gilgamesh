'use strict';

const VERSION = 1;

// Code?
const FLAGS = {
  ZF: 0, // Zero Flag
  CF: 1, // Carry Flag
  OF: 2, // Overflow Flag
  PF: 3, // Parity Flag
  TF: 4, // Trap Flag
  HF: 5, // Half Carry Flag
  SF: 6, // Sign Flag (Negative Flag)
  IF: 7 // Interrupt Enabled Flag
};

// Pattern(s) for assembler?
const OPERANDS = {
  D: 'D', // Destination Register
  S: 'S', // Source Register
  R: 'R', // Result after instruction execution
  K: 'K', // Constant data,
  k: 'k', // Constant address
  b: 'b', // Bit in an I/O Register
  s: 's', // Bit in the Status Register,
  X: 'X', // Indirect Address Register r27/26
  Y: 'Y', // Indirect Address Register r29/28
  Z: 'Z', // Indirect Address Register r31/30
  A: 'A' // I/O location address
};

// Implementation?
// Squashing?
// Bit widths for Operands?
// Negative chipset for exact match instead of gte?
const INSTRUCTIONS = {
  VERSION: {
    chipset: 8,
    operands: [ OPERANDS.D ],
    immediate: VERSION
  },
  NOP: { // No Operation
    chipset: 8
  },
  ADC: { // Add with Carry
    chipset: 8,
    description: 'Adds two registers and the contents of the C Flag and places the result in the destination register Rd.',
    operands: [ OPERANDS.D, OPERANDS.S ],
    flags: [ FLAGS.ZF, FLAGS.CF ]
  },
  ADD: { // Add without Carry
    chipset: 8,
    description: 'Adds two registers without the C Flag and places the result in the destination register Rd.',
    operands: [ OPERANDS.D, OPERANDS.S ],
    flags: [ FLAGS.ZF, FLAGS.CF ]
  },
  ADI: {
    chipset: 8,
    description: 'Adds an immediate value to a register and places the result in the register.',
    operands: [ OPERANDS.D, OPERANDS.K ]
  },
  AND: {
    chipset: 8,
    description: 'Performs the logical AND between the contents of register D and register S, and places the result in the destination register D.',
    operands: [ OPERANDS.D, OPERANDS.S ],
    flags: [ FLAGS.ZF, FLAGS.CF ]
  }
};

function BitField(bits = 8) {
  const self = this;
  const bytes = Math.ceil(bits / 8);
  const field = new Uint8Array(bytes);

  self.get = function(index) {
    const offset = index >> 3;
    const value = field[offset];
    return !!(value & (128 >> (index % 8)));
  };

  self.set = function(index, set = true) {
    const offset = index >> 3;
    if (!!set === true) {
      field[offset] |= 128 >> (index % 8);
    } else {
      field[offset] &= ~(128 >> (index % 8));
    }
  };

  self.clear = function(index) {
    if (index !== undefined) {
      self.set(index, false);
    } else {
      field.fill(0, bytes, 0);
    }
  };

  self.value = function() {
    let value = 0;
    for (let i = 0; i < bytes; i++) {
      value = value << 8;
      value += field[i];
    }
    return value;
  };

  self.toInteger = function() {
    const integer = new Integer({
      bits
    });
    integer.set(self.value());
    return integer;
  };

  self[Symbol.iterator] = function() {
    return {
      next: function() {
        if (this._index < bits) {
          const value = self.get(this._index);
          this._index++;
          return {
            value,
            done: false
          };
        } else {
          return {
            done: true
          };
        }
      },
      _index: 0
    };
  };
}

BitField.prototype.valueOf = function() {
  return this.value();
};

BitField.prototype.toString = function() {
  return this.value().toString(2);
};

// Get and Set Bit
function Integer({
  bits = 8, signed = false
} = {}) {
  const bytes = Math.ceil(bits / 8);
  const data = new ArrayBuffer(bytes);
  const view = new DataView(data);

  Object.defineProperty(this, 'bits', {
    get: () => bits
  });

  Object.defineProperty(this, 'signed', {
    get: () => signed
  });

  Object.defineProperty(this, 'bytes', {
    get: () => bytes
  });

  this.get = function() {
    if (bits === 32) {
      if (signed) {
        return view.getInt32(0);
      } else {
        return view.getUint32(0);
      }
    } else if (bits === 16) {
      if (signed) {
        return view.getInt16(0);
      } else {
        return view.getUint16(0);
      }
    } else {
      if (signed) {
        return view.getInt8(0);
      } else {
        return view.getUint8(0);
      }
    }
  };

  this.getHigh = function() {
    if (bits === 32) {
      if (signed) {
        return view.getInt16(0);
      } else {
        return view.getUint16(0);
      }
    } else if (bits === 16) {
      if (signed) {
        return view.getInt8(0);
      } else {
        return view.getUint8(0);
      }
    } else {
      return (view.getUint8(0) & 0xF0) >> 4;
    }
  };

  this.getLow = function() {
    if (bits === 32) {
      if (signed) {
        return view.getInt16(2);
      } else {
        return view.getUint16(2);
      }
    } else if (bits === 16) {
      if (signed) {
        return view.getInt8(1);
      } else {
        return view.getUint8(1);
      }
    } else {
      return view.getUint8(0) & 0x0F;
    }
  };

  this.set = function(value = 0) {
    if (bits === 32) {
      if (signed) {
        return view.setInt32(0, value);
      } else {
        return view.setUint32(0, value);
      }
    } else if (bits === 16) {
      if (signed) {
        return view.setInt16(0, value);
      } else {
        return view.setUint16(0, value);
      }
    } else {
      if (signed) {
        return view.setInt8(0, value);
      } else {
        return view.setUint8(0, value);
      }
    }
  };

  this.setHigh = function(value = 0) {
    if (bits === 32) {
      if (signed) {
        return view.setInt16(0, value);
      } else {
        return view.setUint16(0, value);
      }
    } else if (bits === 16) {
      if (signed) {
        return view.setInt8(0, value);
      } else {
        return view.setUint8(0, value);
      }
    } else {
      value = (view.getUint8(0) & 0x0F) | ((value << 4) & 0xF0);
      return view.setUint8(0, value);
    }
  };

  this.setLow = function(value = 0) {
    if (bits === 32) {
      if (signed) {
        return view.setInt16(2, value);
      } else {
        return view.setUint16(2, value);
      }
    } else if (bits === 16) {
      if (signed) {
        return view.setInt8(1, value);
      } else {
        return view.setUint8(1, value);
      }
    } else {
      value = (view.getUint8(0) & 0xF0) | (value & 0x0F);
      return view.setUint8(0, value);
    }
  };

  this.clear = () => this.set(0);
}

Integer.prototype.valueOf = function() {
  return this.get();
};

Integer.prototype.toString = function() {
  return this.get().toString();
};

// asInteger?
// Proxy Object for array indicies?
// Bounds checking?
// Subset for memory mapped I/O - or Address Space
// Get and Set Bit
// Load, Save
function IntegerField({
  bits = 8, size = 256, signed = false
} = {}) {
  const bytes = Math.ceil(bits / 8);
  const data = new ArrayBuffer(bytes * size);
  const view = new DataView(data);

  Object.defineProperty(this, 'bits', {
    get: () => bits
  });

  Object.defineProperty(this, 'signed', {
    get: () => signed
  });

  Object.defineProperty(this, 'bytes', {
    get: () => bytes
  });

  Object.defineProperty(this, 'size', {
    get: () => size
  });

  Object.defineProperty(this, 'length', {
    get: () => size
  });

  this.get = function(index) {
    const offset = index * bytes;

    if (bits === 32) {
      if (signed) {
        return view.getInt32(offset);
      } else {
        return view.getUint32(offset);
      }
    } else if (bits === 16) {
      if (signed) {
        return view.getInt16(offset);
      } else {
        return view.getUint16(offset);
      }
    } else {
      if (signed) {
        return view.getInt8(offset);
      } else {
        return view.getUint8(offset);
      }
    }
  };

  this.getHigh = function(index) {
    const offset = index * bytes;

    if (bits === 32) {
      if (signed) {
        return view.getInt16(offset);
      } else {
        return view.getUint16(offset);
      }
    } else if (bits === 16) {
      if (signed) {
        return view.getInt8(offset);
      } else {
        return view.getUint8(offset);
      }
    } else {
      return (view.getUint8(offset) & 0xF0) >> 4;
    }
  };

  this.getLow = function(index) {
    const offset = index * bytes;

    if (bits === 32) {
      if (signed) {
        return view.getInt16(offset + 2);
      } else {
        return view.getUint16(offset + 2);
      }
    } else if (bits === 16) {
      if (signed) {
        return view.getInt8(offset + 1);
      } else {
        return view.getUint8(offset + 1);
      }
    } else {
      return view.getUint8(offset) & 0x0F;
    }
  };

  this.set = function(index, value = 0) {
    const offset = index * bytes;

    if (bits === 32) {
      if (signed) {
        return view.setInt32(offset, value);
      } else {
        return view.setUint32(offset, value);
      }
    } else if (bits === 16) {
      if (signed) {
        return view.setInt16(offset, value);
      } else {
        return view.setUint16(offset, value);
      }
    } else {
      if (signed) {
        return view.setInt8(offset, value);
      } else {
        return view.setUint8(offset, value);
      }
    }
  };

  this.setHigh = function(index, value = 0) {
    const offset = index * bytes;

    if (bits === 32) {
      if (signed) {
        return view.setInt16(offset, value);
      } else {
        return view.setUint16(offset, value);
      }
    } else if (bits === 16) {
      if (signed) {
        return view.setInt8(offset, value);
      } else {
        return view.setUint8(offset, value);
      }
    } else {
      value = (view.getUint8(offset) & 0x0F) | ((value << 4) & 0xF0);
      return view.setUint8(offset, value);
    }
  };

  this.setLow = function(index, value = 0) {
    const offset = index * bytes;

    if (bits === 32) {
      if (signed) {
        return view.setInt16(offset + 2, value);
      } else {
        return view.setUint16(offset + 2, value);
      }
    } else if (bits === 16) {
      if (signed) {
        return view.setInt8(offset + 1, value);
      } else {
        return view.setUint8(offset + 1, value);
      }
    } else {
      value = (view.getUint8(offset) & 0xF0) | (value & 0x0F);
      return view.setUint8(offset, value);
    }
  };

  this.clear = function(index) {
    if (index !== undefined) {
      this.set(index);
    } else {
      for (let i = 0; i < view.byteLength; i++) {
        view.setUint8(i, 0);
      }
    }
  };
}

module.exports = {
  FLAGS,
  OPERANDS,
  INSTRUCTIONS,
  BitField,
  Integer,
  IntegerField
};
