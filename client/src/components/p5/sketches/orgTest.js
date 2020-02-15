import * as mjs from "matter-js";
// import CCapture from "ccapture.js";

import OrgEnv from "../../../libs/classes/org-env/orgEnv";
import { CS } from "./orgConfig";



const testSketch = (p) => {
  var canvas;
  
  const Engine = mjs.Engine;
  const World = mjs.World;
  const Bodies = mjs.Bodies;
  var orgEnv;
  // var capturer = new CCapture({ format: 'gif', workersPath: 'js/' });
  // var capturer = new CCapture({ format: 'webm' });
  var started = false;
  p.setup = () => {
    p.disableFriendlyErrors = true; 
    canvas = p.createCanvas(CS.w, CS.h);
    
    orgEnv = new OrgEnv(p, CS.w, CS.h);
    orgEnv.addNOrgs2(10);
    orgEnv.mjsi.run();
    // p.stroke('black')
    // p.noStroke();

    // console.log(orgEnv.organisms)
    
    // capturer.capture(document.getElementById('defaultCanvas0'));

  }

  p.draw = () => {
    p.background(0);

    orgEnv.dispOrgs();
    orgEnv.moveOrgs();

  }
}

export default testSketch;