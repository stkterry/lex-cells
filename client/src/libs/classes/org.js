import * as mjs from "matter-js";

import { sFToVerts, vertsToBody } from "../superformula";

const Bodies = mjs.Bodies;
const Body = mjs.Body;
const World = mjs.World;


class Org {
  constructor(x=0, y=0) {
    this.opts = {
      'numPoints': 30, 'a': 1, 'b': 1, 'm1': 5, 'm2': 5,
      'n1': 2, 'n2': 13, 'n3': 13, 'scale': 5
    }
    this.verts = sFToVerts(this.opts);

    // this.body = Bodies.circle(x, y, 8);
    this.body = vertsToBody(x, y, this.verts, null)
    this.maxCV = 0.01;
    this.body.mass = 10;
    this.body.frictionAir = 0.01;


  }

  moveRandom(){
    let vx = this.maxCV * Math.random() - this.maxCV / 2;
    let vy = this.maxCV * Math.random() - this.maxCV / 2;
    Body.applyForce(this.body, this.body.position, {x: vx, y: vy})
  }

  disp(p) {
    p.fill(255);
    p.circle(this.body.position.x, this.body.position.y, 16)
  }

  disp2(p) {
    p.push();
    p.translate(this.body.position.x, this.body.position.y);
    p.rotate(this.body.angle)
    p.beginShape();
    for (let vert of this.verts) {
      p.curveVertex(...vert);
    }
    p.endShape();
    p.pop();   
  }
}

export default Org;