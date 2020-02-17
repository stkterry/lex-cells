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
    // orgEnv.mjsi.engine.positionIterations = 2;
    // orgEnv.mjsi.engine.velocityIterations = 2;
    orgEnv.addNOrgs(50);
    // p.stroke('black')
    // p.noStroke();

    // console.log(orgEnv.organisms)
    
    
  }

  p.draw = () => {
    p.background(0);

    // if (p.millis()/1000 >= 1 && p.millis()/1000 < 2) {
    //   started = true;
    //   capturer.start();
    // }

    
    orgEnv.dispOrgs();
    orgEnv.updateEnv();
    orgEnv.mjsi.nextTick(p.frameRate()/60)

  //   if (started) {
  //     capturer.capture(document.getElementById("defaultCanvas0"));
  //     // capturer.capture(canvas);
  //   }

  //   if (p.millis()/1000 >= 15) {
  //     started = false;
  //     capturer.stop();
  //     capturer.save();
  //     p.noLoop();
  //   }
  }
}

export default testSketch;