import cloneDeep from "lodash.clonedeep";
import shortid from "shortid";

import MJSW from "../MJSWrapper";
import {
  randBaseGeneColor, randGeneColor, randNumGenes, minBodySize, cellScale,
  baseColors, cellBodyDefaults, randGeneLength, cellDefaults, wallDefaults
} from "./org-cfg";

import newExpression from "./gene-func";

shortid.seed(666);
const idGen = shortid.generate;


class Org {
  constructor(x = 0, y = 0, p) {
    this.id = idGen();
    Object.assign(this, {p}, cellDefaults)
    this.composite = MJSW.createComposite({ label: 'cell' });

    this.constructor.buildOrg(x, y, this);
    this.pos = this.nucleus.body.position;
    this.diameter = this.nucleus.r * 2;

    this.setBase(); // Set the baseGene name as well as actual colors to be painted.
    // baseGene, baseColor, cytoColor, nuclColor

    this.passiveEvents = [];
    this.activeEvents = [];
    this.dEvents = {};

    // Time of creation
    this.dead = false;
    this.creationTime = p.millis();
  }

  static buildOrg(x, y, org) {
    org.genes = Org.getNewGenes();
    org.nucleus = Org.getNewNucleus(x, y, org);
    org.expressions = Org.getNewExpressions(org);
    org.wall = Org.getNewWall(org);
    org.defaultState = Org.getNewDefaultState(org);
  }


  setBase() {
    this.baseGene = this.genes.segments[0].color;
    this.baseColor = this.expressions[this.baseGene].drawColor;
    this.cytoColor = [...this.baseColor, 25];
    this.nuclColor = [...this.baseColor, 225];
  }

  die() {
    MJSW.removeBody(this.composite);
    this.dead = true;
  }

  update() {
    // Age
    this.age = Math.floor((this.p.millis() - this.creationTime) / 1000)
    if (this.age > this.lifespan) {
      this.die();
      return true;
    }

    // Update active events;
    for (let i = 0; i < this.activeEvents.length; i++) {
      this.activeEvents[i].activation();
    }
    this.activeEvents = [];

    // Update passive events;
    if (this.passiveEvents.length == 0) {
      for (let activation of Object.values(this.defaultState.passive)) {
        activation();
      }
    } else {
      for (let activation in this.passiveEvents) activation();
      this.passiveEvents = [];
    }

    // Upkeep Costs
    this.energy -= this.genes.totalGenesLength * this.upKeepMult

    // Check energy levels
    if (this.energy <= 0) this.die();

    

    return false;
  }

  draw() {

    let baseColor = this.baseColor;
    let cytoColor = this.cytoColor;   

    let p = this.p;
    p.fill(cytoColor)
    p.stroke(baseColor)
    p.beginShape();
    for (let seg of this.wall.segments) {
      p.curveVertex(seg.position.x, seg.position.y)
    }
    p.endShape(p.CLOSE);

    p.stroke('black')
    p.fill(baseColor)
    p.circle(this.pos.x, this.pos.y, this.diameter) // Nucleus


    for (let exp of Object.values(this.expressions)) { // Draw gene expressions
      if (this.dEvents[exp.color]) {
        p.fill(exp.color);
        p.circle(exp.pos.x, exp.pos.y, exp.diameter*1.5);
        this.dEvents[exp.color] -= 1;
      } else if (exp.color == 'green') { 
        p.fill(...exp.drawColor);
        p.circle(exp.pos.x, exp.pos.y, exp.diameter + 2*Math.cos(this.p.millis()/1000));
      } else {
        p.fill(...exp.drawColor);
        p.circle(exp.pos.x, exp.pos.y, exp.diameter);
      }
    }

  }

  static
    getNewGenes() {
    let numSegments = randNumGenes(); // Get the number of gene segments to create.

    let genes = { // Setup inital genes object
      numSegments: numSegments,
      segments: new Array(numSegments)
    }

    let gene = null, n = 0; // Getting the rest of the genes.
    while (n < numSegments - 1) {
      gene = randGeneColor();
      if (true || gene == genes.segments[0].color || !baseColors.has(gene)) { // Currently disabled
        genes.segments[n] = { color: gene, length: randGeneLength() };
        n += 1;
      }
    }
    genes.segments[n] = {
      color: randBaseGeneColor(),
      length: randGeneLength()
    }

    genes['totalGenesLength'] = genes.segments  // Get total genes length;
      .reduce((total, gene) => total + gene.length, 0)

    genes['avgGeneArea'] = Math.sqrt(genes.segments // Get avg gene area.
      .reduce((total, gene) => total + gene.length * gene.length, 0))

    return genes;
  }

  static
    getNewNucleus(x, y, org) {
    let avgGeneArea = org.genes.avgGeneArea
    let bodyRadius = avgGeneArea * 2 < minBodySize ? minBodySize : avgGeneArea;
    bodyRadius = cellScale * bodyRadius;

    return {
      body: MJSW.addCircle(
        {
          x: x, y: y, r: bodyRadius,
          composite: org.composite, owner: org,
          options: { ...cellBodyDefaults, label: 'nucleus' }
        }
      ),
      r: bodyRadius
    }
  }

  static
    getNewExpressions(org) {
    let aggregate = {};
    for (let i = 0; i < org.genes.numSegments; i++) {
      let { color, length } = org.genes.segments[i];
      if (color in aggregate) {
        aggregate[color].length += length;
        aggregate[color].n += 1;
      }
      else {
        aggregate[color] = { length: length, n: 1 }
      }
    }

    let expressions = {};
    for (const [color, exp] of Object.entries(aggregate)) {
      exp.avgLength = exp.length / exp.n;
      let expBody = MJSW.addCircle({
        x: org.nucleus.body.position.x,
        y: org.nucleus.body.position.y,
        r: cellScale * exp.avgLength,
        composite: org.composite, owner: org,
        options: { mass: 0, label: 'expression-' + color }
      })

      // we need to get the rest of the object...
      let completeExp = newExpression(color, exp, expBody, org);
      expressions[color] = completeExp;
    }

    return expressions;
  }

  static
    getNewWall(org) {
    let offset = 5;
    let r = Math.max(...Object.values(org.expressions)
      .map(exp => exp.avgLength)) + org.nucleus.r + offset + 5;

    let [segments, constraints] = MJSW.addSoftCircle({
      x: org.nucleus.body.position.x,
      y: org.nucleus.body.position.y,
      r: r,
      owner: org, composite: org.composite,
      ...wallDefaults
    })

    let wall = {
      segments: segments,
      constraints: constraints,
      r: r,
    }

    return wall;
  }

  static
    getNewDefaultState(org) {
    let passive = {};
    let active = {};
    for (let exp of Object.values(org.expressions)) {
      passive = Object.assign({}, passive, exp.activation.passive);
      active = Object.assign({}, active, exp.activation.active);
    }
    return { active: active, passive: passive };
  }

  static
    orgEvent(orgA, orgB) {

    let aE = cloneDeep(orgA.defaultState.active);
    let bE = cloneDeep(orgB.defaultState.active);

    for (let activation of Object.values(aE)) activation.setup(orgB, bE);
    for (let activation of Object.values(bE)) activation.setup(orgA, aE);

    orgA.activeEvents.push(...Object.values(aE));
    orgB.activeEvents.push(...Object.values(bE));
  }

}

export default Org;