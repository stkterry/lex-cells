import {
  randBaseGeneColor, randGeneColor, randNumGenes, minBodySize, cellScale,
  baseColors, cellBodyDefaults, randGeneLength, passiveColors, cellDefaults,
  eventStateDefaults,
} from "./org-cfg";

import newExpression from "./gene-func";

class Org {
  constructor(x = 0, y = 0, mjsi, p, uniqId) {
    this.p = p;
    this.mjsi = mjsi;
    this.composite = this.mjsi.createComposite({ label: 'cell' });
    this.id = uniqId;

    Object.assign(this, cellDefaults)

    this.getNewGenes();

    this.nucleus = this.getNewNucleus(x, y)
    this.expressions = this.getNewExpressions()
    this.wall = this.getNewWall();

    this.pos = this.nucleus.body.position;
    this.diameter = this.nucleus.r * 2;

    this.setBase(); // Set the baseGene name as well as actual colors to be painted.
    // baseGene, baseColor, cytoColor, nuclColor
    this.eventPaint = null; // After an orgEvent will be filled with colors for the next draw event.
    
    this.defaultState = this.getNewDefaultState();
    this.eventState = null;
  }


  getNewDefaultState() {
    let passive = {};
    let active = {};
    for (let exp of Object.values(this.expressions)) {
      passive = Object.assign({}, passive, exp.activation.passive);
      active = Object.assign({}, active, exp.activation.active);
    }


  
    return { active: active, passive: passive };
  }

  getNewGenes() {
    let numSegments = randNumGenes(); // Get the number of gene segments to create.

    let genes = { // Setup inital genes object
      numSegments: numSegments,
      segments: new Array(numSegments)
    }

    genes.segments[0] = {  // 'base' gene color/length
      color: randBaseGeneColor(),
      length: randGeneLength()
    }
    let gene = null, n = 1; // Getting the rest of the genes.
    while (n < numSegments) {
      gene = randGeneColor();
      if (true || gene == genes.segments[0].color || !baseColors.has(gene)) {
        genes.segments[n] = { color: gene, length: randGeneLength() };
        n += 1;
      }
    }

    genes['totalGenesLength'] = genes.segments  // Get total genes length;
      .reduce((total, gene) => total + gene.length, 0)

    genes['avgGeneArea'] = Math.sqrt(genes.segments // Get avg gene area.
      .reduce((total, gene) => total + gene.length * gene.length, 0))

    this.genes = genes;
  }

  getNewNucleus(x, y) {
    let avgGeneArea = this.genes.avgGeneArea
    let bodyRadius = avgGeneArea * 2 < minBodySize ? minBodySize : avgGeneArea;
    bodyRadius = cellScale * bodyRadius;

    return {
      body: this.mjsi.addCircle(
        { x: x, y: y, r: bodyRadius,
          composite: this.composite, owner: this,
          options: {...cellBodyDefaults, label: 'nucleus' }
        }
      ), 
      r: bodyRadius
    }
  }

  getNewExpressions() {
    let aggregate = {};
    for (let i = 0; i < this.genes.numSegments; i++) {
      let { color, length } = this.genes.segments[i];
      if (color in aggregate) {
        aggregate[color].length += length;
        aggregate[color].n += 1;
      }
      else {
        aggregate[color] = {length: length, n: 1}
      }
    }

    let expressions = {};
    for (const [color, exp] of Object.entries(aggregate)) {
      exp.avgLength = exp.length / exp.n;
      let expBody = this.mjsi.addCircle({
        x: this.nucleus.body.position.x,
        y: this.nucleus.body.position.y,
        r: cellScale * exp.avgLength,
        composite: this.composite, owner: this,
        options: { mass: 0, label: 'expression-' + color }
      })

      // we need to get the rest of the object...
      let completeExp = newExpression(color, exp, expBody, this);
      expressions[color] = completeExp;
    }

    return expressions;
  }

  getNewWall() {
    let thickness = 10;
    let offset = 5;
    let r = Math.max(...Object.values(this.expressions)
      .map(exp => exp.avgLength)) + this.nucleus.r + offset + 5;

    let [segments, constraints] = this.mjsi.addSoftCircle(
      { x: this.nucleus.body.position.x, 
        y: this.nucleus.body.position.y, 
        r: r,
        composite: this.composite, owner: this,
        thickness: thickness, nSegs: 8, 
        options: { mass: 1 } }
    )
    let wall = {
      segments: segments,
      constraints: constraints,
      r: r
    }

    return wall;
  }

  setBase() {
    this.baseGene = this.genes.segments[0].color;
    this.baseColor = this.expressions[this.baseGene].drawColor;
    this.cytoColor = [...this.baseColor, 25];
    this.nuclColor = [...this.baseColor, 225];
  }

  updatePassive() {
    let passiveState = this.defaultState.passive;
    if (passiveState.applyForce)  passiveState.applyForce();
    if (passiveState.energy) this.energy += passiveState.energy;
  }

  updateActive() {
    let activeState = this.defaultState.active;

  }


  static
  orgEvent(organisms, orgA, orgB) {
    let eventStateA = { vul: true, energy: 0, kill: false, flags: [] };
    let eventStateB = { vul: true, energy: 0, kill: false, flags: [] };

    for (let exp of Object.values(orgA.expressions)) {
      exp.activate(eventStateA);
    }

    for (let exp of Object.values(orgB.expressions)) {
      exp.activate(eventStateB);
    }

    // Nullification
    if (!eventStateA.vul) {
      if (eventStateB.energy || eventStateB.kill) {
        eventStateA.flags.push('blue');
      }
      eventStateB.energy = 0;
      eventStateB.kill = false;
    }
    if (!eventStateB.vul) {
      if (eventStateA.energy || eventStateA.kill) {
        eventStateB.flags.push('blue');
      }
      eventStateA.energy = 0;
      eventStateA.kill = false;
    }

    // Gains
    eventStateA.energy = eventStateA.energy - eventStateB.energy;
    eventStateB.energy = eventStateB.energy - eventStateA.energy;
    if (eventStateA.energy) eventStateA.flags.push('red')
    if (eventStateB.energy) eventStateB.flags.push('red')
    

  }

  update() {
    if (this.age > this.lifespan) {
      this.die();
      return true;
    }

    return false;
  }



  draw() {

    var baseColor = this.baseColor;
    var cytoColor = this.cytoColor;   


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
      p.fill(...exp.drawColor);
      p.circle(exp.pos.x, exp.pos.y, exp.diameter);
    }


  }


  static
  kill(org) {
    org.mjsi.removeBody(org.composite);
  }
}

export default Org;