import xmur3 from "./xmur3";


export default function xoshiro128(seed = null) {

  let xmurSeed = seed ? 
    xmur3(seed) : 
    xmur3((Math.floor(Math.random() * 10000000)).toString());

  let a = xmurSeed();
  let b = xmurSeed();
  let c = xmurSeed();
  let d = xmurSeed();

  return function () {
    var t = b << 9, r = a * 5; r = (r << 7 | r >>> 25) * 9;
    c ^= a; d ^= b;
    b ^= c; a ^= d; c ^= t;
    d = d << 11 | d >>> 21;
    return (r >>> 0) / 4294967296;
  }
}