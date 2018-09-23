'use strict';

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

const INSTRUCTION_SET = {
  NOP: 0, // No Operation

  // Arithmetic and Logic Instructions
  ADD: 1, // Add without Carry
  ADC: 2, // Add with Carry
  ADIW: 3, // Add Immediate to Word

  SUB: 4, // Subtract without Carry
  SUBI: 5, // Subtract Immediate
  SBC: 6, // Subtract with Carry
  SBCI: 7, // Subtract Immediate with Carry
  SBIW: 8, // Subtract Immediate from Word

  AND: 9, // Logical And
  ANDI: 10 // Logical And with Immediate

};

function BitField(bits = 8) {
  const bytes = Math.ceil(bits / 8);
  const field = new Uint8Array(bytes);

  this.get = function(index) {
    const offset = index >> 3;
    const value = field[offset];
    return !!(value & (128 >> (index % 8)));
  };

  this.set = function(index, set = true) {
    const offset = index >> 3;
    if (!!set === true) {
      field[offset] |= 128 >> (index % 8);
    } else {
      field[offset] &= ~(128 >> (index % 8));
    }
  };

  this.clear = function(index) {
    if (index !== undefined) {
      this.set(index, false);
    } else {
      field.fill(0, bytes, 0);
    }
  };

  this.value = function() {
    let value = 0;
    for (let i = 0; i < bytes; i++) {
      value = value << 8;
      value += field[i];
    }
    return value;
  };

  this.toInteger = function() {
    const integer = new Integer({
      bits
    });
    integer.set(this.value());
    return integer;
  };
}

function Integer({
  bits = 8, signed = false
} = {}) {
  const bytes = Math.ceil(bits / 8);
  const data = new ArrayBuffer(bytes);
  const view = new DataView(data);

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

  this.clear = () => this.set(0);
}

// High / Low
function IntegerField({
  bits = 8, size = 256, signed = false
} = {}) {
  const bytes = Math.ceil(bits / 8);
  const data = new ArrayBuffer(bytes * size);
  const view = new DataView(data);

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
  INSTRUCTION_SET,
  BitField,
  Integer,
  IntegerField
};
