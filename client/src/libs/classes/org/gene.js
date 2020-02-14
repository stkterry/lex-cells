// Gene types, red, green, black, gray, yellow, blue, cyan, white 
import { randRate } from "./org-cfg";

class BaseGene {
  constructor(rate) {
    this.rate = rate;
    this.ef = 0;
  }

  getEnergy() {
    return this.rate * this.eF;
  }
}


export class GreenGene extends BaseGene {
  constructor(rate) {
    super(rate);
    this.ef = 0.5
  }
}

export class RedGene extends BaseGene {
  constructor(rate) {
    super(rate);
    this.ef = 0.8
  }
}

export class BlackGene extends BaseGene {
  constructor(rate) {
    super(rate);
    this.ef = 0.6
  }
}

export class WhiteGene extends BaseGene {
  constructor(rate) {
    super(rate);
    this.ef = -0.5;
  }
}

export class GrayGene extends BaseGene {
  constructor(rate) {
    super(rate);
    this.ef = -1.0;
  }
}

export class YellowGene extends BaseGene {
  constructor(rate) {
    super(rate);
    this.ef = 0;
  }
}

export class CyanGene extends BaseGene {
  constructor(rate) {
    super(rate);
    this.ef = 0;
  }
}

export class BlueGene extends BaseGene {
  constructor(rate) {
    super(rate);
    this.ef = 0;
  }
}

export const getGene = (type) => {

  if (type == 'white') return new WhiteGene(randRate())
  if (type == 'blue') return new WhiteGene(randRate())
  if (type == 'yellow') return new WhiteGene(randRate())
  if (type == 'gray') return new WhiteGene(randRate())
  if (type == 'black') return new WhiteGene(randRate())
  if (type == 'red') return new WhiteGene(randRate())
  if (type == 'cyan') return new WhiteGene(randRate())
  if (type == 'green') return new WhiteGene(randRate())
}