
export const maxBaseEnergy = 128;
export const minGeneLength = 4;
export const maxGeneLength = 16;
export const maxGeneRate = 8;
export const baseRepCost = 40;
export const geneRepCost = 3;

export const geneTypes = new Set([
  'red', 'green', 'black', 'gray',
  'yellow', 'blue', 'cyan', 'white'
]);


export const randGeneType = () => {
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

export const randBaseGene = () => {
  let pick = 10 * Math.random();
  if      (pick < 2) return 'red' // 20%
  else if (pick < 4) return 'gray' // 20%
  else if (pick < 6) return 'black' // 20%
  else return 'green';  // 40%
}

export const randRate = () => {
  return Math.random() * maxGeneRate;
}
