// Example Use
// let seed = xmur3("somestring");
// seed() -> returns random hash
// pulled from https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316


export default function xmur3(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
      h = h << 13 | h >>> 19;
  return function () {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }
}