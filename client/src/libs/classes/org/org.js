
import { randBaseGeneColor, randGeneColor, randNumGenes,
  geneColors, baseColors } from "./org-cfg";
import { getGene } from "./gene";

class Org {
  constructor(x=0, y=0, mjsi) {
    this.mjsi = mjsi; // matter.js wrapper instance.

    this.numGeneSegments = randNumGenes(); // pick random segment total
    let [genes, geneBodies] = this.collectGenes(x, y); // get total expression length and genes!
    this.genes = genes;
    this.geneBodies = geneBodies;
    
    this.r = this.bodySize(this.genes); // requires genes to be known...
    this.body = this.mjsi.addCircle({x: x, y: y, r: this.r}); // requires genes to be known...
    this.geneConstraints = this.constrainGenesToBody(); // Needs this.r to constrain bodies...

    let [wall, wallConstraints] = this.mjsi.addSoftCircle({ 
      x: x, y: y, r: this.r*2.5, thickness: 5, 
      nSegs: 16, options: { isStatic: false, mass: 0 } })
    this.wall = wall;
    this.wallConstraints = wallConstraints;

    this.applyForce = this.mjsi.constructor
      .getApplyForceToCenter(this.body);

    this.maxCV = 0.01;
    this.body.mass = 10;
    this.body.frictionAir = 0.01;
    
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

    // console.log(this.body)
    // this.mjsi.Body.scale(this.body, 0.25, 0.25)
    // this.body.mass = 10;
    // this.body.frictionAir = 0.01;
    // console.log(this.body)
  }

  moveRandom(){
    let vx = this.maxCV * Math.random() - this.maxCV / 2;
    let vy = this.maxCV * Math.random() - this.maxCV / 2;
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
    let genes = [];
    let geneBodies = [];
    let gene;
    genes[0] = randBaseGeneColor();
    while (genes.length < this.numGeneSegments) {
      gene = randGeneColor();
      if (gene == genes[0] || !baseColors.has(gene)) genes.push(gene);
    }
    for (let i = 0; i < genes.length; i++) {
      genes[i] = getGene(genes[i]);
      genes[i].body = this.mjsi.addCircle({
        x: x + diff*Math.random() - diff/2,
        y: y + diff*Math.random() - diff/2,
        r: genes[i].length,
        options: {mass: 0}
      })
      geneBodies.push(genes[i].body);
    }
    this.totalExpressionLength = Object.values(genes)
      .reduce((t, gene) => t + gene.length, 0)

    return [genes, geneBodies];
  }

  constrainGenesToBody() {
    let geneConstraints = [];
    for (let gene of this.genes) {
      let options = {
        bodyA: this.body,
        bodyB: gene.body,
        length: (this.r + gene.length) * (1 + Math.random() / 2),
        stiffness: 0
      }
      let constraint = this.mjsi.Constraint.create(options)

      geneConstraints.push(constraint);
      this.mjsi.World.add(this.mjsi.world, constraint)
    }
    return geneConstraints;
  }


  bodySize() {
    let geneArea = Object.values(this.genes)
      .reduce((t, gene) => t + gene.length * gene.length, 0)

    let gA = Math.sqrt(geneArea)
    return gA*2 < 10 ? 10 : gA
  }


}

export default Org;