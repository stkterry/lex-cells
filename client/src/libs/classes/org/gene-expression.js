// Gene types, red, green, black, gray, yellow, blue, cyan, white 
import { cellScale, cellDefaults } from "./org-cfg";

const maxCellVel = cellDefaults['maxCellVel'];

import { MJSWrapper } from "../matterHelpers";

class BaseExpression {
  constructor(length) {
    this.body = null;
    this.constraint = null;
    this.length = length;
    this.count = 1;
    this.avgLength = length;
    this.color = 'purple'
    this.ef = 0;


    this.diameter = cellScale * this.avgLength * 2;
  }

  setAvgLength() {
    this.avgLength = this.length / this.count;
    this.diameter = cellScale * this.avgLength * 2;
  }

  disp(p) {
    p.fill(this.color);
    p.circle(this.body.position.x, this.body.position.y, this.diameter)
  }

  getEnergy() {
    return this.length * this.eF;
  }
}


export class GreenExpression extends BaseExpression {
  constructor(length) {
    super(length);
    this.color = [98, 188, 77]; //#034d57
    this.ef = 0.5
  }
}

export class RedExpression extends BaseExpression {
  constructor(length) {
    super(length);
    this.color = [255, 64, 64];
    this.ef = 0.8
  }
}

export class BlackExpression extends BaseExpression {
  constructor(length) {
    super(length);
    this.color = [30, 30, 30]
    this.ef = 0.6
  }
}

export class WhiteExpression extends BaseExpression {
  constructor(length) {
    super(length);
    this.color = [200, 200, 200]
    this.ef = -0.5;
  }
}

export class GrayExpression extends BaseExpression {
  constructor(length) {
    super(length);
    this.color = [125, 125, 125]
    this.ef = -1.0;
  }
}

export class YellowExpression extends BaseExpression {
  constructor(length) {
    super(length);
    this.color = [213, 150, 44]
    this.ef = 0;
  }
}

export class CyanExpression extends BaseExpression {
  constructor(length, body) {
    super(length);
    this.color = [73, 172, 197]
    this.ef = 0;

    // Movement!
    this.lim = maxCellVel * (this.length / (1 + this.length));
    console.log(this.lim)
    this.applyForce = MJSWrapper.getApplyForceToCenter(body);
  }

  activate() {
    let vx = this.lim * Math.random() - this.lim / 2;
    let vy = this.lim * Math.random() - this.lim / 2;
    this.applyForce({ x: vx, y: vy })
  }

}

export class BlueExpression extends BaseExpression {
  constructor(length) {
    super(length);
    this.color = [8, 82, 165];
    this.ef = 0;
  }
}

export const getExpression = (type, kwargs) => {

  if (type == 'white') return new WhiteExpression(...kwargs)
  if (type == 'blue') return new BlueExpression(...kwargs)
  if (type == 'yellow') return new YellowExpression(...kwargs)
  if (type == 'gray') return new GrayExpression(...kwargs)
  if (type == 'black') return new BlackExpression(...kwargs)
  if (type == 'red') return new RedExpression(...kwargs)
  if (type == 'cyan') return new CyanExpression(...kwargs)
  if (type == 'green') return new GreenExpression(...kwargs)
}