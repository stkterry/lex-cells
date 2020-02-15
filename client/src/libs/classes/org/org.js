
import { randBaseGeneColor, randGeneColor, randNumGenes, minBodySize,
  geneColors, baseColors, cellBodyDefaults, cellDefaults } from "./org-cfg";
import { getGene } from "./gene";

class Org {
  constructor(x=0, y=0, mjsi) {
    this.mjsi = mjsi; // matter.js wrapper instance.

    this.numGenes = randNumGenes(); // pick random segment total
    Object.assign(this, this.collectGenes(x, y));

    this.r = this.bodySize(this.genes); // requires genes to be known...
    this.body = this.mjsi.addCircle(
      { x: x, y: y, r: this.r, options: cellBodyDefaults }
    );

    Object.assign(this, this.constrainGenesToBody()); // Needs this.r to constrain bodies...
    
    let [wall, wallConstraints] = this.mjsi.addSoftCircle(
      { x: x, y: y, r: this.wallR+3, thickness: 6, 
        nSegs: 16, options: { mass: 0 } }
    )
    this.wall = wall;
    this.wallConstraints = wallConstraints;

    this.applyForce = this.mjsi.constructor
      .getApplyForceToCenter(this.body);

    Object.assign(this, cellDefaults);

    this.baseColor = [...this.genes[0].color, 100];
    this.wallColor = [...this.genes[0].color, 25];


    // this.composite = this.mjsi.Composite.create({ label: 'cell' });
    // this.geneComposite = this.mjsi.Composite.create({ label: 'genes' });
    // this.wallComposite = this.mjsi.Composite.create({ label: 'cellWall' });
    // this.mjsi.Composite.add(this.composite, 
    //   [...geneBodies, ...this.geneConstraints]);
    // this.mjsi.Composite.add(this.wallComposite,
    //   [...wall, ...this.wallConstraints]);
    // this.mjsi.Composite.add(this.composite,
    //   [this.body, this.geneComposite, this.wallComposite]);
  }

  moveRandom(){
    let vx = this.maxCellVel * Math.random() - this.maxCellVel / 2;
    let vy = this.maxCellVel * Math.random() - this.maxCellVel / 2;
    this.applyForce({x: vx, y: vy})
  }

  disp(p) {
    p.fill(this.wallColor)
    p.stroke(this.genes[0].color)
    p.beginShape();
    for (let seg of this.wall) {
      p.vertex(seg.position.x, seg.position.y)
    }
    p.vertex(this.wall[0].position.x, this.wall[0].position.y)
    p.endShape();
  
    p.stroke('black')
    p.fill(this.baseColor)
    p.circle(this.body.position.x, this.body.position.y, this.r * 2)

    for (let gene of this.genes) gene.disp(p);

  }

  removeWall() {
    this.mjsi.removeBody(this.wall)
    this.mjsi.removeBody(this.wallConstraints)
    this.wall = [];
    this.wallConstraints = [];
  }

  removeGenes() {
    this.mjsi.removeBody(this.geneBodies);
    this.mjsi.removeBody(this.geneConstraints);
    this.genes = [];
    this.geneBodies = [];
    this.geneConstraints = [];
  }

  removeBody() {
    this.mjsi.removeBody(this.body);
    this.body = []; 
  }

  collectGenes(x, y) {
    let diff = 10;
    let genes = [], geneBodies = [];
    let gene;
    genes[0] = randBaseGeneColor();
    while (genes.length < this.numGenes) {
      gene = randGeneColor();
      if (gene == genes[0] || !baseColors.has(gene)) genes.push(gene);
    }
    for (let i = 0; i < genes.length; i++) {
      genes[i] = getGene(genes[i]);
      genes[i].body = this.mjsi.addCircle({
        x: x + minBodySize*Math.random() - minBodySize/2,
        y: y + minBodySize*Math.random() - minBodySize/2,
        r: genes[i].length,
        options: {mass: 0}
      })
      geneBodies.push(genes[i].body);
    }
    this.totalExpressionLength = Object.values(genes)
      .reduce((t, gene) => t + gene.length, 0)

    return {genes, geneBodies};
  }

  constrainGenesToBody() {
    let geneConstraints = [];
    let wallR = 0, len = 0;
    for (let gene of this.genes) {
      len = (this.r + gene.length) * (1 + Math.random() / 2);
      wallR = (len + gene.length > wallR) ? (len + gene.length) : wallR;
      let options = {
        bodyA: this.body,
        bodyB: gene.body,
        length: len,
        stiffness: 0
      }
      let constraint = this.mjsi.Constraint.create(options)

      geneConstraints.push(constraint);
      this.mjsi.World.add(this.mjsi.world, constraint)
    }
    return {geneConstraints, wallR};
  }

  bodySize() {
    let geneArea = Object.values(this.genes)
      .reduce((t, gene) => t + gene.length * gene.length, 0)

    let gA = Math.sqrt(geneArea)
    return gA*2 < minBodySize ? minBodySize : gA
  }


}

export default Org;