
export const minGeneSegments = 4; // min gene segments
export const maxGeneSegments = 16; // max gene segments
export const maxGeneLength = 8; // max gene effect
export const minGeneLength = 2; // min gene effect
export const baseRepCost = 40;
export const geneRepCost = 3;

export const baseColors = new Set(
  ['red', 'gray', 'green', 'black']
)
export const geneColors = new Set(
  ['red', 'gray', 'green', 'black',
   'yellow', 'blue', 'white', 'cyan']
)

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