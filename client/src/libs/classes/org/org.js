
import {
  randBaseGeneColor, randGeneColor, randNumGenes, minBodySize, cellScale,
  baseColors, cellBodyDefaults, randGeneLength, passiveColors,
} from "./org-cfg";
import { getExpression } from "./gene-expression";

class Org {
  constructor(x = 0, y = 0, mjsi, uniqueId) {
    this.mjsi = mjsi;
    this.matter = {nucleus: null, expressions: null, wall: null}
    this.id = uniqueId;

    this.getNewGenes();

    this.matter.nucleus = this.getNewNucleus(x, y)
    this.matter.expressions = this.getNewExpressions()
    this.matter.wall = this.getNewWall();

    this.pos = this.matter.nucleus.body.position;
    this.diameter = this.matter.nucleus.r * 2;

    this.applyForce = this.mjsi.constructor
      .getApplyForceToCenter(this.matter.nucleus.body);

    this.setBase(); // Set the baseGene name as well as actual colors to be painted.
    // baseGene, baseColor, cytoColor, nuclColor
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
          options: {...cellBodyDefaults, label: 'nucleus' }
        }
      ), 
      r: bodyRadius
    }
  }

  getNewExpressions() {
    let expressions = {};
    for (let i = 0; i < this.genes.numSegments; i++) {
      let { color, length } = this.genes.segments[i];
      if (color in expressions) {
        expressions[color].length += length;
        expressions[color].count += 1;
        expressions[color].setAvgLength();
      }
      else {
        expressions[color] = getExpression(color, [length, this.matter.nucleus.body]);
      }
    }

    for (const [color, exp] of Object.entries(expressions)) {
      let expBody = this.mjsi.addCircle({
        x: this.matter.nucleus.body.position.x,
        y: this.matter.nucleus.body.position.y,
        r: cellScale * exp.avgLength,
        options: { mass: 0, label: 'expression-' + color }
      })
      exp.body = expBody;
    }
        
    return expressions;
  }

  getNewWall() {
    let thickness = 10;
    let offset = 5;
    let r = Math.max(...Object.values(this.matter.expressions)
      .map(exp => exp.avgLength)) + this.matter.nucleus.r + offset + 5;

    let [segments, constraints] = this.mjsi.addSoftCircle(
      { x: this.matter.nucleus.body.position.x, 
        y: this.matter.nucleus.body.position.y, 
        r: r, 
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
    this.baseColor = this.matter.expressions[this.baseGene].color;
    this.cytoColor = [...this.baseColor, 25];
    this.nuclColor = [...this.baseColor, 10];
  }

  updatePassive() {
    if ("cyan" in this.matter.expressions) {
      this.matter.expressions["cyan"].activate();
    } 
  }

  update() {
    if (this.age > this.lifespan) this.die();
  }



  disp(p) {
    p.fill(this.cytoColor)
    p.stroke(this.baseColor)
    p.beginShape();
    for (let seg of this.matter.wall.segments) {
      p.vertex(seg.position.x, seg.position.y)
    }
    p.endShape(p.CLOSE);

    p.stroke('black')
    p.fill(this.baseColor)
    p.circle(this.pos.x, this.pos.y, this.diameter)

    for (let exp in this.matter.expressions) {
      this.matter.expressions[exp].disp(p)
    }

  }



  static
  die(org) {
    org.mjsi.removeBody(org.matter.nucleus.body);
    org.mjsi.removeBody(Object.values(org.matter.expressions).map(exp => exp.body));
    org.mjsi.removeBody(org.matter.wall.constraints);
    org.mjsi.removeBody(org.matter.wall.segments);
  }
}

export default Org;