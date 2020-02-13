
const testSketch = (p) => {
  let canvas;

  p.setup = () => {
    canvas = p.createCanvas(800, 800);
  }

  p.draw = () => {
    p.background(0);
  }
}

export default testSketch;