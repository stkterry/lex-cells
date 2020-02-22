

import MJSW from "../MJSWrapper";
import { boundsThickness } from "./orgEnv-config";
import Org from "../org/org";
import xorshiro128 from "../../PRNG/xoshiro128";
const prng = xorshiro128('orgEnv');

class OrgEnv {
  constructor(p, w, h) {
    this.p = p;
    this.w = w;
    this.h = h;

    MJSW.setGravityY(0);
    MJSW.setWorldBounds(w, h, boundsThickness);
    this.organisms = [];

    this.setupEvents();
  }

  addNOrgs(n) {
    let orgs = [];
    while (orgs.length < n) {

      let org = new Org(...this.randXY(), this.p);
      if (OrgEnv.overlaps(org, orgs)) {
        org.die();
      } else {
        orgs.push(org);
      }
    }
    this.organisms.push(...orgs);
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
      if (this.organisms[i].dead) this.organisms.splice(i, 1);
    }
  }

  setupEvents() {
    MJSW.eventsOn('collisionStart', (event) => {
      let pairs = event.pairs.filter(pair => {
        return pair.bodyA.owner != pair.bodyB.owner
          && pair.bodyA.owner && pair.bodyB.owner
      })
      for (let pair of pairs) {
        Org.orgEvent(
          pair.bodyA.owner, pair.bodyB.owner);
      }
    })
  }

  // setupEvents() {
  //   MJSW.Events.on(MJSW.engine, 'collisionStart', (event) => {
  //     let pairs = this.uniqPairs(event.pairs)

  //     for (let pair of pairs) {
  //       Org.orgEvent(this.organisms, pair.orgA, pair.orgB);
  //     }
  //   })
  // }

  uniqPairs(pairs) {
    let seen = new Set();
    let out = new Array(pairs.length);
    let len = pairs.length;
    let j = 0;


    for (let i = 0; i < len; i++) {
      let orgA = pairs[i].bodyA.owner;
      let orgB = pairs[i].bodyB.owner;

      if (!orgA || !orgB) continue;
      if (orgA == orgB) continue;

      let idF = (orgA.id).toString() + (orgB.id).toString();
      let idB = (orgB.id).toString() + (orgA.id).toString();

      if (!seen.has(idF) && !seen.has(idB)) {
        let pair = { orgA: orgA, orgB: orgB };
        seen.add(idF)
        out[j] = pair;
        j += 1;
      }
    }
    return out.slice(0, j);
  }

  drawOrgs() {
    for (let org of this.organisms) org.draw();
  }

  randXY() {
    let limit = 50;
    let x = limit + (this.w - limit*2) * prng();
    let y = limit + (this.h - limit*2) * prng();
    return [x, y]
  }

}


// function uniqPairs(pairs) {
//   let seen = new Set();
//   let out = new Array(pairs.length);
//   let len = pairs.length;
//   let j = 0;

//   for (let i = 0; i < len; i++) {
//     let orgA = pairs[i].bodyA.owner;
//     let orgB = pairs[i].bodyB.owner;


//     // var idF = (orgA.id).toString() + (orgB.id).toString();
//     // var idB = (orgB.id).toString() + (orgA.id).toString();

//     // if (!seen.has(idF) && !seen.has(idB)) {
//     //   var pair = { orgA: orgA, orgB: orgB };
//     //   seen.add(idF)
//     //   out[j] = pair;
//     //   j += 1;
//     // }
//   }
//   // return out.slice(0, j);
// }

export default OrgEnv;