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

  addNOrgs(n) {
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
    org.removeExpressions();
    org.removeBody();
  }

  static
  overlaps(bOrg, orgs) {
    for (let aOrg of orgs) {
      let dx = aOrg.pos.x - bOrg.pos.x;
      let dy = aOrg.pos.y - bOrg.pos.y;
      let t = aOrg.wall.r + bOrg.wall.r;
      if (t*t > dx*dx + dy*dy) return true;
    }
    return false;
  }

  updateEnv() {
    for (let i = 0; i < this.organisms.length; i++) {
      this.organisms[i].update();
      // console.log(this.organisms[i])
    }
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