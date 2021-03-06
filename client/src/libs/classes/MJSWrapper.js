import * as mjs from "matter-js";

const Bodies = mjs.Bodies;
const Body = mjs.Body;
const World = mjs.World;
const Constraint = mjs.Constraint;
const Engine = mjs.Engine;
const Composite = mjs.Composite;
const Events = mjs.Events;
// const Runner = mjs.Runner;
// const Common = mjs.Common;

const TAU = Math.PI * 2;
const PI = Math.PI;

class MJSWrapper {
  constructor() {
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.lastDelta = 60;

    this.Body = mjs.Body;
    this.World = mjs.World;
    this.Constraint = mjs.Constraint;
    this.Engine = mjs.Engine;
    this.Composite = mjs.Composite;
    this.Runner = mjs.Runner;
    this.Events = mjs.Events;
    this.Common = mjs.Common;
  }

  eventsOn(condition, cb) {
    Events.on(this.engine, condition, cb);
  }

  setGravityY(val) {
    this.world.gravity.y = val;
  }

  upTime() {
    return this.engine.timing.timestamp;
  }

  smoothUpdate(delta) {
    Engine.update(this.engine, delta, delta/this.lastDelta)
    this.lastDelta = delta;
  }

  createComposite(options) {
    let composite = Composite.create(options);
    this.addBody(composite);
    return composite
  }

  addToComposite(composite, ...elements) {
    Composite.add(composite, ...elements) 
  }

  addConstraint(options, composite=null) {
    let constraint = Constraint.create(options);
    if (composite) Composite.add(composite, constraint);
    else World.add(this.world, constraint);
    return constraint;
  }

  addBody(...bodies) {
    World.add(this.world, ...bodies);
  }

  removeBody(...bodies) {
    World.remove(this.world, ...bodies);
  }

  addCircle({ x = 0, y = 0, r = 10, composite = null, owner = null, options = {} } = {}) {
    let body = Bodies.circle(x, y, r, options);

    if (composite) {
      Composite.add(composite, body);
      body.owner = owner;
    }
    else this.addBody(body);

    return body;
  }

  addSoftCircle({
    x, y, r, thickness, nSegs,
    owner = null, composite = null,
    compositeOptions = {},
    constraintOptions = {},
    bodyOptions = {}
    } = {}) {

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
        { angle: angle - PI / 2, collisionFilter: { group: -1 }, ...bodyOptions })
      segments.push(rect);
      rect.owner = owner;
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
          ...constraintOptions
        }

      let constraint = Constraint.create(optsEdge);
      constraints.push(constraint);
    }
    
    segments.pop();
    if (composite) {
    
      let wallComposite = Composite.create(compositeOptions);
      Composite.add(wallComposite, segments);
      Composite.add(wallComposite, constraints);
      Composite.add(composite, wallComposite);


    } else {
      for (let segment in segments) World.add(this.world, segment);
      for (let constraint in constraints) World.add(this.world, constraint);
    }

    return [segments, constraints]
  }

  setWorldBounds(w, h, boundsThickness) {
    this.bounds = this.constructor.getBounds(w, h, boundsThickness)
    this.addBody(this.bounds);
  }

  run() {
    Engine.run(this.engine);
  }

  stop() {
    this.engine.enabled = false;
  }

  setVelocity(body, vecV) {
    Body.setVelocity(body, vecV);
  }

  static
  applyForce(body, vecF) {
    Body.applyForce(body, body.position, vecF)
  }

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

const MJSW = new MJSWrapper();
export default MJSW;