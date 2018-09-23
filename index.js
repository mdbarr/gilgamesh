#!/usr/bin/env node

'use strict';

////////////////////////////////////////////////////////////
// Chipsets

//const architecture = require('./chipsets/architecture');
const M1047 = require('./chipsets/m1047');

////////////////////////////////////////////////////////////
// Merseene Twister Pseudo-Random Number Generator

function MersenneTwister(seed) {
  seed = seed || Date.now();
  this.N = 624;
  this.M = 397;
  this.MATRIX_A = 0x9908b0df;
  this.UPPER_MASK = 0x80000000;
  this.LOWER_MASK = 0x7fffffff;
  this.I = Math.pow(2, 32);

  this.mt = new Array(this.N);
  this.mti = this.N + 1;

  this.mt[0] = seed >>> 0;
  for (this.mti = 1; this.mti < this.N; this.mti++) {
    const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
    this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
                           (s & 0x0000ffff) * 1812433253) + this.mti;
    this.mt[this.mti] >>>= 0;
  }
};

MersenneTwister.prototype.random = function() {
  const mag01 = new Array(0x0, this.MATRIX_A);
  let y;

  if (this.mti >= this.N) {
    let kk;

    for (kk = 0; kk < this.N - this.M; kk++) {
      y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
      this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
    }

    for (;kk < this.N - 1; kk++) {
      y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
      this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
    }

    y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);

    this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

    this.mti = 0;
  }

  y = this.mt[this.mti++];

  y ^= (y >>> 11);
  y ^= (y << 7) & 0x9d2c5680;
  y ^= (y << 15) & 0xefc60000;
  y ^= (y >>> 18);
  y = y >>> 0;

  return (y + 0.5) / this.I;
};

////////////////////////////////////////////////////////////
// Deep Clone

function deepClone(object, seen = new WeakMap()) {
  // Primitives (treat Functions as primitives)
  if (Object(object) !== object || object instanceof Function) {
    return object;
  }

  // Cyclic references
  if (seen.has(object)) {
    return seen.get(object);
  }

  let result;
  if (object instanceof Buffer) {
    result = Buffer.from(object);
  } else if (object instanceof Date) {
    result = new Date(object);
  } else if (object instanceof RegExp) {
    result = new RegExp(object.source, object.flags);
  } else if (object.constructor) {
    result = new object.constructor();
  } else {
    result = Object.create(null);
  }

  seen.set(object, result);

  if (object instanceof Buffer) {
    return result;
  } else if (object instanceof Map) {
    object.forEach((value, key) => result.set(key, deepClone(value, seen)));
  } else if (object instanceof Set) {
    object.forEach(value => result.add(deepClone(value, seen)));
  } else {
    for (const key in object) {
      result[key] = deepClone(object[key], seen);
    }
  }

  return result;
}

Object.clone = function(object, deep = true) {
  if (deep) {
    return deepClone(object);
  } else {
    return JSON.parse(JSON.stringify(object));
  }
};

Object.deepClone = function(object) {
  return deepClone(object);
};

////////////////////////////////////////////////////////////

const m1047 = new M1047();
console.log(m1047 instanceof M1047);
