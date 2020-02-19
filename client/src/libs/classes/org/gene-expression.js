// Gene types, red, green, black, gray, yellow, blue, cyan, white 
import { cellScale, GeneDefaults, colorCodes } from "./org-cfg";


import { MJSWrapper } from "../matterHelpers";

class BaseExpression {
  constructor(length, parentCell) {
    this.parentCell = parentCell;
    this.body = null;
    this.pos = null;
    this.constraint = null;
    this.length = length;
    this.count = 1;
    this.avgLength = length;
    this.color = colorCodes.purple;

    Object.assign(this, GeneDefaults);

    this.diameter = cellScale * this.avgLength * 2;

  }

  setBody(body) {
    this.body = body;
    this.pos = body.position;
  }

  setAvgLength() {
    this.avgLength = this.length / this.count;
    this.diameter = cellScale * this.avgLength * 2;
  }

  draw(p) {
    p.fill(this.color);
    p.circle(this.pos.x, this.pos.y, this.diameter)
  }

}


export class GreenExpression extends BaseExpression {
  constructor(...args) {
    super(...args);
    this.color = colorCodes.green; //#034d57
    this.ef = 0.5
  }
}

export class RedExpression extends BaseExpression {
  constructor(...args) {
    super(...args);
    this.color = colorCodes.red;
  }

  activate(otherOrg) {
    if (otherOrg.expressions.hasOwnProperty('blue')) {
      if (otherOrg.eventPaint != null) otherOrg.eventPaint.timer += 2;
      else {
        let eventPaint = {
          timer: 10,
          baseColor: [...colorCodes.blue, 100],
          cytoColor: [...colorCodes.blue, 100]
        }
        otherOrg.eventPaint = eventPaint;
      } 
      return;
    } 

    let energy = this.redMult * this.length;
    if (otherOrg.energy < energy) energy = otherOrg.energy;
    otherOrg.energy -= energy;

    this.parentCell.energy += energy;
  }
}

export class BlackExpression extends BaseExpression {
  constructor(...args) {
    super(...args);
    this.color = colorCodes.black;
    this.ef = 0.6
  }
}

export class WhiteExpression extends BaseExpression {
  constructor(...args) {
    super(...args);
    this.color = colorCodes.white;
    this.ef = -0.5;
  }
}

export class GrayExpression extends BaseExpression {
  constructor(...args) {
    super(...args);
    this.color = colorCodes.gray;
    this.ef = -1.0;
  }
}

export class YellowExpression extends BaseExpression {
  constructor(...args) {
    super(...args);
    this.color = colorCodes.yellow;
    this.ef = 0;
  }
}

export class CyanExpression extends BaseExpression {
  constructor(...args) {
    super(...args);
    this.color = colorCodes.cyan;
    this.ef = 0;
    // Movement!
    this.lim = this.maxVel * (this.length / (1 + this.length));
    this.applyForce = MJSWrapper.getApplyForceToCenter(this.parentCell.nucleus.body);
  }

  activate() {
    let vx = this.lim * Math.random() - this.lim / 2;
    let vy = this.lim * Math.random() - this.lim / 2;
    this.applyForce({ x: vx, y: vy })
  }

}

export class BlueExpression extends BaseExpression {
  constructor(...args) {
    super(...args);
    this.color = colorCodes.blue;
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