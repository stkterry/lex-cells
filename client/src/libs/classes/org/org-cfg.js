
export const minGeneSegments = 4; // min gene segments
export const maxGeneSegments = 16; // max gene segments
export const maxGeneLength = 8; // max gene effect
export const minGeneLength = 2; // min gene effect
export const baseRepCost = 40;
export const geneRepCost = 3;

export const minBodySize = 10;
export const cellScale = 0.5;
export const cellBodyDefaults = {
  mass: 10
}
export const GeneDefaults = {
  maxVel: 0.01,
  greenMult: 1/500,
  redMult: 1/2,
}

export const cellDefaults = {
  lifespan: 30,
  age: 0,
  energy: 50,
  upKeepMult: 1/5000,
}

export const baseColors = new Set(
  ['red', 'gray', 'green', 'black']
)
export const geneColors = new Set(
  ['red', 'gray', 'green', 'black',
   'yellow', 'blue', 'white', 'cyan']
)

export const activeColors = new Set([
  'red', 'blue', 'white', 'gray', 'black'
])

export const passiveColors = new Set([
  'green', 'cyan', 'yellow'
])

export const colorCodes = {
  base: [170, 0, 255], // purple
  green: [98, 188, 77],
  red: [255, 64, 64],
  black: [30, 30, 30],
  white: [200, 200, 200],
  gray: [125, 125, 125],
  yellow: [213, 150, 44],
  cyan: [73, 172, 197],
  blue: [8, 82, 165]
}

export const randGeneColor = () => {
  let pick = 20 * Math.random();
  if      (pick < 2) return 'white' // 10%
  else if (pick < 4) return 'blue'  // 10%
  else if (pick < 6) return 'yellow'  // 10%
  else if (pick < 8) return 'gray'  // 10%
  else if (pick < 10) return 'black'  // 10%
  else if (pick < 12) return 'red' // 10%
  else if (pick < 16) return 'cyan'  // 15%
  else return 'green'  // 25%
}

export const randBaseGeneColor = () => {
  let pick = 10 * Math.random();
  if      (pick < 2) return 'red' // 20%
  else if (pick < 4) return 'gray' // 20%
  else if (pick < 6) return 'black' // 20%
  else return 'green';  // 40%
}

export const randGeneLength = () => {
  let diff = maxGeneLength - minGeneLength;
  return diff * Math.random() + minGeneLength;
}

export const randNumGenes = () => {
  let diff = maxGeneSegments - minGeneSegments;
  let numGenes = diff * Math.random() + minGeneSegments;
  return Math.floor(numGenes);
}