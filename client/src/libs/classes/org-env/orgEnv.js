import { MJSWrapper } from "../matterHelpers";

import shortid from "shortid";
import Org from "../org/org";
import { boundsThickness } from "./orgEnv-config";
shortid.seed(666);

class OrgEnv {
  constructor(p, w, h) {
    this.p = p;
    this.w = w;
    this.h = h;
    this.mjsi = new MJSWrapper();
    this.idGen = shortid.generate;

    this.mjsi.world.gravity.y = 0;
    this.mjsi.setWorldBounds(w, h, boundsThickness);
    this.organisms = {};
    this.orgsArray = [];

    // this.setupEvents();
  }

  addNOrgs(n) {
    let orgs = [];
    while (orgs.length < n) {
      let org = new Org(...this.randXY(), this.mjsi);
      if (OrgEnv.overlaps(org, orgs)) {
        Org.kill(org);
      } else {
        orgs.push(org);
        this.organisms[org.id] = org;
      }
    }
    this.orgsArray.push(...orgs);
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
    for (let i = 0; i < this.orgsArray.length; i++) {
      this.orgsArray[i].updatePassive();
    }
    // for (let id in this.organisms) {
    //   this.organisms[id].updatePassive();
    // }
  }

  setupEvents() {
    this.mjsi.Events.on(this.mjsi.engine, 'collisionStart', (event) => {
      let pairs = event.pairs.filter(pair => {
        return pair.bodyA.topParentId != pair.bodyB.topParentId
          && pair.bodyA.topParentId && pair.bodyB.topParentId
      })
      for (let pair of pairs) {
        // console.log(pair) 
      }
    })
  }

  dispOrgs() {
    for (let id in this.organisms) this.organisms[id].disp(this.p);
  }

  randXY() {
    let limit = 50;
    let x = limit + (this.w - limit*2) * Math.random();
    let y = limit + (this.h - limit*2) * Math.random();
    return [x, y]
  }

}

export default OrgEnv;