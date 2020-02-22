// Gene types, red, green, black, gray, yellow, blue, cyan, white 
import { cellScale, GeneDefaults, colorCodes } from "./org-cfg";
import MJSW from "../MJSWrapper";

import xorshiro128 from "../../PRNG/xoshiro128";
const prng = xorshiro128('gene-func');

export default function newExpression(color, exp, body, parentCell) {

  let expObj = {
    color: color,
    drawColor: colorCodes[color],
    length: exp.length,
    n: exp.n,
    avgLength: exp.avgLength,
    diameter: cellScale * exp.avgLength * 2,
    body: body,
    pos: body.position,
    activation: ActivationTables(color, {length: exp.length, parentCell: parentCell})
  };

  return expObj;
}

function RedExpression({ length, parentCell }) {
  const expectedEnergy = GeneDefaults.redMult * length;
  let activation = {
    active: {
      red: {
        activation: function () {
          parentCell.dEvents.red = 10;
          if (!this.isActive) return;

          let energy = (this.otherCell.energy - expectedEnergy < 0) ? 
            this.otherCell.energy : expectedEnergy;
          parentCell.energy += energy;
          this.otherCell.energy -= energy;
        },
        isActive: true,
        setup: function(otherCell, state) {
          this.otherCell = otherCell;
        }
      }

    },
    passive: {}
  }

  return activation;
}

function GreenExpression({ length, parentCell }) {
  
  let activation = {
    active: {}, 
    passive: {
      green: function() {parentCell.energy += GeneDefaults.greenMult * length}
    }
  }

  return activation;
}

function BlackExpression({ length }) {
  let activation = {
    active: {},
    passive: {}
  }
  return activation;
}

function WhiteExpression({ length }) {
  let activation = {
    active: {},
    passive: {}
  }
  return activation;
}

function GrayExpression({ length }) {
  let activation = {
    active: {},
    passive: {}
  }
  return activation;
}

function YellowExpression({ length }) {
  let activation = {
    active: {},
    passive: {}
  }
  return activation;
}

function CyanExpression({ length, parentCell }) {
  var lim = GeneDefaults.maxVel * (length / (1 + length));
  const applyForce = MJSW.getApplyForceToCenter(parentCell.nucleus.body)
  let activation = {
    active: {
      cyan: {
        activation() {
          if (!this.isActive) return;          
          let dx = parentCell.pos.x - this.otherCell.pos.x;
          let dy = parentCell.pos.y - this.otherCell.pos.y;
          let fNorm = GeneDefaults.recoilVel / Math.sqrt(dx * dx + dy * dy);
          let vecV = { x: dx * fNorm, y: dy * fNorm };
          MJSW.setVelocity(parentCell.nucleus.body, vecV);

          parentCell.dEvents.cyan = 10;
        },
        isActive: false,
        setup(otherCell, otherState) {
          if (otherState.hasOwnProperty('red') 
              && !parentCell.expressions.hasOwnProperty('blue')) {
                this.isActive = true;
                this.otherCell = otherCell;
              }
        }
      }
    },
    passive: {
      cyan: function() {
        let vx = lim * prng() - lim / 2;
        let vy = lim * prng() - lim / 2;
        applyForce({x: vx, y: vy});
      }
    }
  }

  return activation;
}


function BlueExpression({ length, parentCell }) {
  let activation = {
    active: {
      blue: {
        activation() {},
        isActive: true,
        setup(otherCell, otherState) { 
          if (otherState.hasOwnProperty('red')) { 
            otherState.red.isActive = false;
            parentCell.dEvents.blue = 10;
          }
          if (otherState.hasOwnProperty('white')) {
            otherState.white.isActive = false;
            parentCell.dEvents.blue = 10;
          }
        }
      }
    },
    passive: {}
  }
  return activation;
}

function ActivationTables(type, args) {

  if (type == 'white') return new WhiteExpression(args)
  if (type == 'blue') return new BlueExpression(args)
  if (type == 'yellow') return new YellowExpression(args)
  if (type == 'gray') return new GrayExpression(args)
  if (type == 'black') return new BlackExpression(args)
  if (type == 'red') return new RedExpression(args)
  if (type == 'cyan') return new CyanExpression(args)
  if (type == 'green') return new GreenExpression(args)
}