// Gene types, red, green, black, gray, yellow, blue, cyan, white 
import { randGeneLength, cellScale } from "./org-cfg";

class BaseGene {
  constructor(length) {
    this.length = length;
    this.color = 'purple'
    this.ef = 0;
  }

  disp(p) {
    p.fill(this.color);
    p.circle(this.body.position.x, this.body.position.y, cellScale * this.length*2)
  }

  getEnergy() {
    return this.length * this.eF;
  }
}


export class GreenGene extends BaseGene {
  constructor(length) {
    super(length);
    this.color = [98, 188, 77]; //#034d57
    this.ef = 0.5
  }
}

export class RedGene extends BaseGene {
  constructor(length) {
    super(length);
    this.color = [255, 64, 64];
    this.ef = 0.8
  }
}

export class BlackGene extends BaseGene {
  constructor(length) {
    super(length);
    this.color = [30, 30, 30]
    this.ef = 0.6
  }
}

export class WhiteGene extends BaseGene {
  constructor(length) {
    super(length);
    this.color = [200, 200, 200]
    this.ef = -0.5;
  }
}

export class GrayGene extends BaseGene {
  constructor(length) {
    super(length);
    this.color = [125, 125, 125]
    this.ef = -1.0;
  }
}

export class YellowGene extends BaseGene {
  constructor(length) {
    super(length);
    this.color = [213, 150, 44]
    this.ef = 0;
  }
}

export class CyanGene extends BaseGene {
  constructor(length) {
    super(length);
    this.color = [73, 172, 197]
    this.ef = 0;
  }
}

export class BlueGene extends BaseGene {
  constructor(length) {
    super(length);
    this.color = [8, 82, 165];
    this.ef = 0;
  }
}

export const getGene = (type) => {

  if (type == 'white') return new WhiteGene(randGeneLength())
  if (type == 'blue') return new BlueGene(randGeneLength())
  if (type == 'yellow') return new YellowGene(randGeneLength())
  if (type == 'gray') return new GrayGene(randGeneLength())
  if (type == 'black') return new BlackGene(randGeneLength())
  if (type == 'red') return new RedGene(randGeneLength())
  if (type == 'cyan') return new CyanGene(randGeneLength())
  if (type == 'green') return new GreenGene(randGeneLength())
}