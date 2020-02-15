import * as mjs from "matter-js";

const Bodies = mjs.Bodies;
const Body = mjs.Body;
const World = mjs.World;
const Constraint = mjs.Constraint;
const Engine = mjs.Engine;
const Composite = mjs.Composite;

const TAU = Math.PI * 2;
const PI = Math.PI;

export class MJSWrapper {
  constructor() {
    this.engine = Engine.create();
    this.world = this.engine.world;

    this.Body = mjs.Body;
    this.World = mjs.World;
    this.Constraint = mjs.Constraint;
    this.Engine = mjs.Engine;
    this.Composite = mjs.Composite;
  }

  addBody(...bodies) {
    World.add(this.world, ...bodies);
  }

  removeBody(...bodies) {
    World.remove(this.world, ...bodies);
  }

  addTrapezoid({ x = 0, y = 0, w = 10, h = 10, slope = 0, options = {} }) {
    let body = Bodies.trapezoid(x, y, w, h, slope, options);
    this.addBody(body);
    return body;
  }

  addRect({ x = 0, y = 0, w = 10, h = 10, options = {} }) {
    let body = Bodies.rectangle(x, y, w, h, options);
    this.addBody(body);
    return body;
  }

  addCircle({ x = 0, y = 0, r = 10, options = {} }) {
    let body = Bodies.circle(x, y, r, options);
    this.addBody(body);
    return body;
  }

  addRectCircle({ x = 0, y = 0, r = 200, thickness = 20, nSegs = 16, options = {} } = {}) {
    let angDel = TAU / nSegs; // Angle each segment covers.
    let adjAng = Math.tan(angDel / 2); // The adjacent angle from the circle radius in relation to w of the rect
    let h = thickness; // h is the height of the rect but thickness of the circle we're creating.
    let w = 2 * r * adjAng; // bottom of the rect, outer edge of the circle.

    let segments = [];
    let Rdiff = r - h / 2; // Ensure that outer circle radius matches our intended radius.
    for (let i = 0; i < nSegs; i++) {
      let angle = i * angDel;
      let sx = Rdiff * Math.cos(angle);
      let sy = Rdiff * Math.sin(angle);
      // let rect = addRect({ x: sx, y: sy, w: w, h: h, 
      //   options: { angle: angle - PI / 2} })
      let rect = Bodies.rectangle(sx, sy, w, h, {angle: angle - PI/2})
      segments.push(rect);
    }

    let circle = Body.create({parts: segments});
    Body.setPosition(circle, { x: x, y: y })
    World.add(this.world, circle)
    return circle;
  } 


  addSoftCircle({ x = 0, y = 0, r = 200, thickness = 20, nSegs = 16, options = {} } = {}) {
    let angDel = TAU / nSegs; // Angle each segment covers.
    let adjAng = Math.tan(angDel / 2); // The adjacent angle from the circle radius in relation to w of the rect
    let h = thickness; // h is the height of the rect but thickness of the circle we're creating.
    let w = 2 * r * adjAng; // bottom of the rect, outer edge of the circle.

    let segments = [];

    let rDiff = r - h / 2; // Ensure that outer circle radius matches our intended radius.
    for (let i = 0; i < nSegs; i++) {
      let angle = i * angDel;
      let sx = rDiff * Math.cos(angle) + x;
      let sy = rDiff * Math.sin(angle) + y;
      let rect = Bodies.rectangle(sx, sy, w, h, 
        { angle: angle - PI / 2, collisionFilter: { group: -1 } })
      segments.push(rect);
      World.add(this.world, rect);
    }

    segments.push(segments[0]);
    let constraints = [];
    for (let i = 0; i < segments.length-1; i++) {
      let angle = i * angDel;
      let sx0 = rDiff * Math.cos(angle);
      let sy0 = rDiff * Math.sin(angle);
      let sx1 = rDiff * Math.cos(angle + angDel / 2);
      let sy1 = rDiff * Math.sin(angle + angDel / 2);
      let sx2 = rDiff * Math.cos(angle + angDel);
      let sy2 = rDiff * Math.sin(angle + angDel);

      let pointA = { x: sx1 - sx0, y: sy1 - sy0 }
      let pointB = { x: sx1 - sx2, y: sy1 - sy2 }
      let optsEdge = {
        bodyA: segments[i],
        bodyB: segments[i + 1],
        pointA: pointA,
        pointB: pointB,
        length: 0,
        stiffness: 1,
        damping: 0.1
      }
      let constraint = Constraint.create(optsEdge);
      constraints.push(constraint);
      World.add(this.world, constraint);
    }

    segments.pop();
    return [segments, constraints]


    // let circle = Body.create({ parts: segments });
    // Body.setPosition(circle, { x: x, y: y })
    // World.add(this.world, circle)
    // return circle;
  } 

  setWorldBounds(w, h, boundsThickness) {
    this.bounds = this.constructor.getBounds(w, h, boundsThickness)
    this.addBody(this.bounds);
  }

  run() {
    Engine.run(this.engine);
  }

  static
  getApplyForceToCenter(body) {
    return function(vecF) {
      Body.applyForce(body, body.position, vecF)
    }
  }

  static
    getBounds(w, h, boundsThickness) {
    let offset = boundsThickness;

    let top = Bodies.rectangle(w / 2, -offset / 2,
      w + offset, offset, { isStatic: true });
    let bottom = Bodies.rectangle(w / 2, h + offset / 2,
      w + offset, offset, { isStatic: true });
    let right = Bodies.rectangle(w + offset / 2, h / 2,
      offset, h + offset, { isStatic: true });
    let left = Bodies.rectangle(-offset / 2, h / 2,
      offset, h + offset, { isStatic: true });

    return [top, bottom, right, left];
  }

}

export function addTrapezoid({ x = 0, y = 0, w = 10, h = 10, slope = 0, options = {} }) {
  let body = Bodies.trapezoid(x, y, w, h, slope, options);
  // addBody(body);
  return body;
}

export function addRect({ x = 0, y = 0, w = 10, h = 10, options = {} }) {
  let body = Bodies.rectangle(x, y, w, h, options);
  // addBody(body);
  return body;
}

export function addCircle({ x = 0, y = 0, r = 10, options = {} }) {
  let body = Bodies.circle(x, y, r, options);
  // addBody(body);
  return body;
}

// module.exports = {
//   addTrapezoid,
//   addRect,
//   addCircle 
// }