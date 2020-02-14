import * as mjs from "matter-js";

import { randBaseGene, randGeneType, baseRepCost,
  geneRepCost, minGeneLength, maxGeneLength } from "./org-cfg";
import { getGene } from "./gene";

const Bodies = mjs.Bodies;
const Body = mjs.Body;
const World = mjs.World;
const Constraint = mjs.Constraint;


class Org {
  constructor(x=0, y=0, world) {
    this.world = world;
    this.geneLength = Math.floor(minGeneLength + (maxGeneLength-minGeneLength) * Math.random());
    this.genes = this.constructor.getNewGenes(this.geneLength);
    this.totalRate = 0;
    
    for (let gene of this.genes) this.totalRate += gene.rate;
    this.repoductiveCost = baseRepCost + this.totalRate * geneRepCost;
    
    this.constructor.getStructure(this, x, y);
    console.log(this.body)
    // this.body = Bodies.circle(x, y, 8);
    World.add(this.world, this.body);
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
    p.circle(this.body.position.x, this.body.position.y, this.r * 2)

    p.fill(100)
    for (let body of this.geneBodies) {
      p.circle(body.position.x, body.position.y, body.circleRadius)
    }
  }

  static
  getNewGenes(geneLength) {
    let geneTypes = new Array(geneLength);
    geneTypes[0] = randBaseGene();
    for (let i = 1; i < geneLength; i++) {
      geneTypes[i] = randGeneType();
    }
    let genes = new Array(geneLength)
    for (let i = 0; i < geneLength; i++) {
      genes[i] = getGene(geneTypes[i]);
    }

    return genes;
  }

  static
  getStructure(org, x, y) {
    let area = 0;
    let geneBodies = [];
    for (let gene of org.genes) {
      area += Math.PI * (8 * gene.rate * gene.rate)
      geneBodies.push(Bodies.circle(
        x + gene.rate * Math.sin(Math.random() * 2 * Math.PI),
        y + gene.rate * Math.sin(Math.random() * 2 * Math.PI), 
        gene.rate,
        { mass: 0 }
      ));
    }
    let R = Math.sqrt((area) / Math.PI)
    
    org.r = R;
    org.body = Bodies.circle(x, y, R);
    org.geneBodies = geneBodies;
    // for (let body of geneBodies) {
    //   let constraint = Constraint.create({
    //     bodyA: org.body,
    //     bodyB: body,
    //     length: org.r/4,
    //     stiffness: 0
    //   })
      World.add(org.world, geneBodies)
    // }

  }

}

export default Org;