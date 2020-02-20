import shortid from "shortid";

import { MJSWrapper } from "../matterHelpers";
import { boundsThickness } from "./orgEnv-config";
import xorshiro128 from "../../PRNG/xoshiro128";
import Org from "../org/org";

const prng = xorshiro128('orgEnv');
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
      let uniqId = this.idGen();
      let org = new Org(...this.randXY(), this.mjsi, this.p, uniqId);
      if (OrgEnv.overlaps(org, orgs)) {
        Org.kill(org);
      } else {
        orgs.push(org);
        // this.organisms[org.id] = org;
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
        return pair.bodyA.owner != pair.bodyB.owner
          && pair.bodyA.owner && pair.bodyB.owner
      })
      for (let pair of pairs) {
        Org.orgEvent(this.organisms, 
          pair.bodyA.owner, pair.bodyB.owner);
      }
    })
  }

  // setupEvents() {
  //   this.mjsi.Events.on(this.mjsi.engine, 'collisionStart', (event) => {
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
    for (let org of this.orgsArray) org.draw();
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