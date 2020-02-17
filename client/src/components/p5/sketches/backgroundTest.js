import OrgEnv from "../../../libs/classes/org-env/orgEnv";
import { CS } from "./orgConfig";

import p5 from 'p5';

import SimplexNoise from "simplex-noise";
const simplex = new SimplexNoise('seed');

const testSketch = (p) => {
  var canvas;

  var orgEnv;
  var pg;
  var stepCount = 0;
  var spNoise;

  var fpsP;
  var pDiv;

  p.setup = () => {
    p.disableFriendlyErrors = true;
    canvas = p.createCanvas(CS.w, CS.h);
    pDiv = p.createDiv();
    pDiv.style('color', 'white');
    fpsP = p.createP();
    fpsP.parent(pDiv);
    
    p.noStroke();


    orgEnv = new OrgEnv(p, CS.w, CS.h);
    orgEnv.addNOrgs(1);
  }

  p.draw = () => {
    p.background(0);
    // simplexNoiseG(p);


    orgEnv.dispOrgs();
    orgEnv.updateEnv();
    orgEnv.mjsi.nextTick(p.frameRate() / 60)


    fpsP.html(p.getFrameRate().toFixed(2));
  }
}


const randNoise = (p) => {

  p.loadPixels();
  for (let j = 0; j < CS.h; j++) {
    for (let i = 0; i < CS.w; i++) {

      let idx = (i + j * CS.w)*4;
      let val = 255 * (1 + simplex.noise2D(i, j)) / 2.0

      p.pixels[0 + idx] = val;
      p.pixels[1 + idx] = val;
      p.pixels[2 + idx] = val;
      p.pixels[3 + idx] = 255; 
    }
  }
  p.updatePixels();
}

const simplexNoise = (p) => {
  const WINDOW = 20;
  const windowSkip = WINDOW * CS.w * 4;
  p.loadPixels();
  for (let j = 0; j < CS.h; j+=WINDOW) {
    for (let i = 0; i < CS.w; i+=WINDOW) {
      let idx = (i + j * CS.w) * 4 ;
      let val = (1 + simplex.noise3D(i/400, j/400, p.millis()/1000)) / 2.0
      val = Math.floor(256 * val);
      for (let l = 0; l < WINDOW; l++) {
        for (let m = 0; m < windowSkip; m+=CS.w) {
          let idw = idx + (m + l) * 4;
          p.pixels[0 + idw] = val;
          p.pixels[1 + idw] = val;
          p.pixels[2 + idw] = val;
          p.pixels[3 + idw] = 255;
        }
      }
    }
  }
  p.updatePixels();
}

function simplexNoiseF(p) {
  const WINDOW = 20;
  const cols = Math.floor(CS.w / WINDOW);
  const rows = Math.floor(CS.h / WINDOW);
  const noiseWidth = 0.1;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let r = (1 + simplex.noise3D(i * noiseWidth, j * noiseWidth, p.millis()/10000)) / 2.0
      p.fill(Math.floor(256 * r));
      p.rect(i * WINDOW, j * WINDOW, WINDOW, WINDOW);
    }
  }
}

function simplexNoiseG(p) {
  const WINDOW = 20;
  const cols = Math.floor(CS.w / WINDOW);
  const rows = Math.floor(CS.h / WINDOW);
  const noiseWidth = 0.1;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let r = Math.PI * (1 + simplex.noise3D(i * noiseWidth, j * noiseWidth, p.millis() / 10000))
      let vec = p5.Vector.fromAngle(r);
      p.push();
      p.stroke(255)
      p.strokeWeight(2)
      p.translate(i * WINDOW, j * WINDOW);
      p.rotate(vec.heading());
      // console.log(vec.heading())
      p.line(0, 0, WINDOW, 0);
      p.pop();
      // p.fill(Math.floor(256 * r));
      // p.rect(i * WINDOW, j * WINDOW, WINDOW, WINDOW);
    }
  }
}


export default testSketch;