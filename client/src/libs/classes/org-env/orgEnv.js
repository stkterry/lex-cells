import * as mjs from "matter-js";

import Org from "../org";
import { boundsOffset } from "./orgEnv-config";

const Bodies = mjs.Bodies;
const Body = mjs.Body;
const World = mjs.World;

class OrgEnv {
  constructor(p, engine, w, h) {
    this.p = p;
    this.w = w;
    this.h = h;

    this.engine = engine;
    this.world = engine.world;
    this.world.gravity.y = 0;
    World.add(this.world, this.constructor.getBounds(w, h));

    this.organisms = [];
  }

  addNOrgs(n) {
    let newOrgs = Array.from({ length: n },
      () => new Org(...this.randXY()));
      
    World.add(this.world, newOrgs.map(org => org.body));
    this.organisms.push(...newOrgs);
  }

  moveOrgs() {
    for (let org of this.organisms) org.moveRandom();
  }

  dispOrgs() {
    for (let org of this.organisms) org.disp(this.p);
  }

  dispOrgShapes() {
    for (let org of this.organisms) org.disp2(this.p);
  }

  randXY() {
    let x = this.w * Math.random();
    let y = this.h * Math.random();
    return [x, y]
  }

  static
  getBounds(w, h) {
    let offset = boundsOffset;

    let top = mjs.Bodies.rectangle(w / 2, -offset / 2, 
      w + offset, offset, { isStatic: true });
    let bottom = mjs.Bodies.rectangle(w / 2, h + offset / 2,
        w + offset, offset, { isStatic: true });
    let right = mjs.Bodies.rectangle(w + offset / 2, h / 2,
        offset, h + offset, { isStatic: true });
    let left = mjs.Bodies.rectangle(-offset / 2, h / 2,
        offset, h + offset, { isStatic: true });

    return [top, bottom, right, left];
  }
}

export default OrgEnv;