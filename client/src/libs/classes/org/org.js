
import {
  randBaseGeneColor, randGeneColor, randNumGenes, minBodySize, cellScale,
  baseColors, cellBodyDefaults, randGeneLength, passiveColors,
} from "./org-cfg";
import { getExpression } from "./gene-expression";

class Org {
  constructor(x = 0, y = 0, mjsi) {
    this.mjsi = mjsi;
    this.composite = this.mjsi.createComposite({'label': 'cell'})
    this.id = this.composite.id;



    this.getNewGenes();

    this.getNewNucleus(x, y);
    this.pos = this.nucleus.body.position;
    this.diameter = this.nucleus.r * 2;

    this.getNewExpressions()

    this.getNewWall();

    this.applyForce = this.mjsi.constructor
      .getApplyForceToCenter(this.nucleus.body);

    this.setBase(); // Set the baseGene name as well as actual colors to be painted.
    // baseGene, baseColor, cytoColor, nuclColor

    console.log(this.composite.bodies)
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
    this.nucleus = {
      body: this.mjsi.addCircle(
        { x: x, y: y, r: bodyRadius, 
          options: {...cellBodyDefaults, label: 'nucleus' },
          composite: this.composite }
      ), 
      r: bodyRadius
    }
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

    let maxConstraintDist = 0, k = 0, maxK = Object.keys(this.expressions).length;
    for (const [color, exp] of Object.entries(this.expressions)) {

      let constraintDist = (this.nucleus.r + cellScale * exp.avgLength) // Distance between nucleus and gene expression.
        * (1 + cellScale * Math.random() / 3);
      
      if (constraintDist + exp.avgLength > maxConstraintDist) {
        maxConstraintDist = constraintDist + exp.avgLength;
      }

      let spawnRadius = this.nucleus.r + cellScale * exp.avgLength + 3;
      let spawnAng = 2 * Math.PI * k/maxK;
      k += 1;
      let expBody = this.mjsi.addCircle({
        x: this.pos.x 
          + spawnRadius * Math.cos(spawnAng),
        y: this.pos.y
          + spawnRadius * Math.sin(spawnAng),
        r: cellScale * exp.avgLength,
        options: { label: 'expression-' + color },
        composite: this.composite
      })

      exp.body = expBody;
    }

    if (this.wall) this.wall['r'] = maxConstraintDist;
    else (this.wall = {r: maxConstraintDist});
    
  }

  getNewWall() {
    let thickness = 10;
    let offset = 5;
    let [segments, constraints] = this.mjsi.addSoftCircle(
      { x: this.pos.x, y: this.pos.y, r: this.wall.r + offset, 
        thickness: thickness, nSegs: 8, 
        composite: this.composite, options: { mass: 1 } }
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

  updatePassive() {
    if ("cyan" in this.expressions) {
      this.expressions["cyan"].activate();
    } 
  }

  update() {
    if (this.age > this.lifespan) this.die();
  }



  disp(p) {
    p.fill(this.cytoColor)
    p.stroke(this.baseColor)
    p.beginShape();
    for (let seg of this.wall.segments) {
      p.vertex(seg.position.x, seg.position.y)
    }
    p.endShape(p.CLOSE);

    p.stroke('black')
    p.fill(this.baseColor)
    p.circle(this.pos.x, this.pos.y, this.diameter)

    for (let exp in this.expressions) {
      this.expressions[exp].disp(p)
    }

  }

  static
  die(org, composite) {
    org.removeBody(composite.bodies);
    org.removeBody(composite.constraints)
    for (let comp in composite.composites) Org.die(org, comp);
    org.removeBody(composite);
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