import * as mjs from "matter-js";
import { MJSWrapper } from "../matterHelpers";

import Org from "../org/org";
import { boundsThickness } from "./orgEnv-config";

class OrgEnv {
  constructor(p, w, h) {
    this.p = p;
    this.mjsi = new MJSWrapper();
    this.w = w;
    this.h = h;

    this.mjsi.world.gravity.y = 0;
    this.mjsi.setWorldBounds(w, h, boundsThickness);
    this.organisms = [];
  }

  addNOrgs2(n) {
    let orgs = [];
    while (orgs.length < n) {
      let org = new Org(...this.randXY(), this.mjsi);
      if (OrgEnv.overlaps(org, orgs)) {
        this.kill(org);
      } else {
        orgs.push(org);
      }
    }
    this.organisms.push(...orgs);
  }

  kill(org) {
    org.removeWall();
    org.removeGenes();
    org.removeBody();
    this.mjsi.removeBody(org)
  }

  static
  overlaps(bOrg, orgs) {
    for (let aOrg of orgs) {
      let dx = aOrg.body.position.x - bOrg.body.position.x;
      let dy = aOrg.body.position.y - bOrg.body.position.y;
      let t = aOrg.r*2.5 + bOrg.r*2.5;
      if (t*t > dx*dx + dy*dy) return true;
    }
    return false;
  }

  moveOrgs() {
    for (let org of this.organisms) org.moveRandom();
  }

  dispOrgs() {
    for (let org of this.organisms) org.disp(this.p);
  }

  randXY() {
    let limit = 50;
    let x = limit + (this.w - limit*2) * Math.random();
    let y = limit + (this.h - limit*2) * Math.random();
    return [x, y]
  }

}

export default OrgEnv;