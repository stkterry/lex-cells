import * as mjs from "matter-js";

import OrgEnv from "../../../libs/classes/org-env/orgEnv";
import { CS } from "./orgConfig";



const testSketch = (p) => {
  var canvas;
  
  const Engine = mjs.Engine;
  const World = mjs.World;
  const Bodies = mjs.Bodies;

  const engine = Engine.create();
  var orgEnv;

  p.setup = () => {
    canvas = p.createCanvas(CS.w, CS.h);
    
    orgEnv = new OrgEnv(p, engine, CS.w, CS.h);
    orgEnv.addNOrgs(50);
    // const world = engine.world;
    Engine.run(engine);
    p.noStroke();




  }

  p.draw = () => {
    p.background(0);

    // orgEnv.moveOrgs();
    // orgEnv.dispOrgShapes();

  }
}

export default testSketch;