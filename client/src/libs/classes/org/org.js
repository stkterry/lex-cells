
import {
  randBaseGeneColor, randGeneColor, randNumGenes, minBodySize, cellScale,
  baseColors, cellBodyDefaults, cellDefaults, randGeneLength
} from "./org-cfg";
import { getExpression } from "./gene-expression";

class Org {
  constructor(x = 0, y = 0, mjsi) {
    this.mjsi = mjsi;

    this.genes = this.constructor.getNewGenes();

    this.getNewNucleus(x, y);
    this.pos = this.nucleus.body.position;
    this.diameter = this.nucleus.r * 2;

    this.getNewExpressions()

    this.getNewWall();

    this.applyForce = this.mjsi.constructor
      .getApplyForceToCenter(this.nucleus.body);

    Object.assign(this, cellDefaults)

    this.setBase(); // Set the baseGene name as well as actual colors to be painted.
    // baseGene, baseColor, cytoColor, nuclColor

    // console.log(this.expressions)
  }


  static
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

    return genes;
  }

  getNewNucleus(x, y) {
    let avgGeneArea = this.genes.avgGeneArea
    let bodyRadius = avgGeneArea * 2 < minBodySize ? minBodySize : avgGeneArea;

    bodyRadius = cellScale * bodyRadius;
    this.nucleus = {
      body: this.mjsi.addCircle(
        { x: x, y: y, r: bodyRadius, options: cellBodyDefaults }
      ), 
      r: bodyRadius
    }
    // bodyRadius = cellScale * bodyRadius; // Set scale of object.
    // let body = 
    // return [bodyRadius, body];
  }

  getNewExpressions() {
    this.expressions = {};
    for (let i = 0; i < this.genes.numSegments; i++) {
      let { color, length } = this.genes.segments[i];
      if (color in this.expressions) {
        this.expressions[color].length += length;
        this.expressions[color].count += 1;
        this.expressions[color].setAvgLength();
      }
      else {
        this.expressions[color] = getExpression(color, [length, this.nucleus.body]);
      }
    }

    let maxConstraintDist = 0;
    for (const [_, exp] of Object.entries(this.expressions)) {

      let constraintDist = (this.nucleus.r + cellScale * exp.avgLength) // Distance between nucleus and gene expression.
        * (1 + cellScale * Math.random() / 3);
      
      if (constraintDist + exp.avgLength > maxConstraintDist) {
        maxConstraintDist = constraintDist + exp.avgLength;
      }

      let expBody = this.mjsi.addCircle({
        x: this.pos.x 
          + cellScale * (minBodySize * Math.random() - minBodySize / 2),
        y: this.pos.y
          + cellScale * (minBodySize * Math.random() - minBodySize / 2),
        r: cellScale * exp.avgLength,
        options: { mass: 0 }
      })
      
      let constraintOptions = {
        bodyA: this.nucleus.body,
        bodyB: expBody,
        length: constraintDist,
        stiffness: 0
      }

      // let expConstraint = this.mjsi.addConstraint(constraintOptions);

      exp.body = expBody;
      // exp.constraint = expConstraint;
    }

    if (this.wall) this.wall['r'] = maxConstraintDist;
    else (this.wall = {r: maxConstraintDist});
    
  }

  getNewWall() {
    let thickness = 10;
    let offset = thickness / 2;
    let [segments, constraints] = this.mjsi.addSoftCircle(
      { x: this.pos.x, y: this.pos.y, r: this.wall.r + offset, thickness: thickness,
        nSegs: 8, options: { mass: 1 } }
    )
    this.wall['segments'] = segments;
    this.wall['constraints'] = constraints;
  }

  setBase() {
    this.baseGene = this.genes.segments[0].color;
    this.baseColor = this.expressions[this.baseGene].color;
    this.cytoColor = [...this.baseColor, 25];
    this.nuclColor = [...this.baseColor, 10];
  }


  moveRandom() {
    let vx = this.maxCellVel * Math.random() - this.maxCellVel / 2;
    let vy = this.maxCellVel * Math.random() - this.maxCellVel / 2;
    this.applyForce({ x: vx, y: vy })
  }

  update() {
    if ("cyan" in this.expressions) {
      this.expressions["cyan"].activate();
    }

  }


  disp(p) {
    p.fill(this.cytoColor)
    p.stroke(this.baseColor)
    p.beginShape();
    for (let seg of this.wall.segments) {
      p.curveVertex(seg.position.x, seg.position.y)
    }
    p.endShape(p.CLOSE);

    p.stroke('black')
    p.fill(this.baseColor)
    p.circle(this.pos.x, this.pos.y, this.diameter)

    for (let exp in this.expressions) {
      this.expressions[exp].disp(p)
    }

  }

  removeWall() {
    this.mjsi.removeBody(this.wall.segments)
    this.mjsi.removeBody(this.wall.constraints)

  }

  removeExpressions() {
    for (let gene in this.expressions) {
      let exp = this.expressions[gene];
      this.mjsi.removeBody(exp.body, exp.constraint)
    }
  }

  removeBody() {
    this.mjsi.removeBody(this.nucleus.body);
  }



}

export default Org;