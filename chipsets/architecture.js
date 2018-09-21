'use strict';

function BitField(bits) {
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
}

function Integer({
  bits = 8, signed = false
}) {
  const bytes = Math.ceil(bits / 8);
  const data = new Buffer(bytes);
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

function IntegerField({
  bits = 8, size = 256, signed = false
}) {
  const bytes = Math.ceil(bits / 8);
  const data = new Buffer(bytes * size);
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
      data.fill(0, data.length, 0);
    }
  };
}

module.exports = {
  BitField,
  Integer,
  IntegerField
};
