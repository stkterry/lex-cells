// Gene types, red, green, black, gray, yellow, blue, cyan, white 
import { cellScale, GeneDefaults, colorCodes } from "./org-cfg";
import { MJSWrapper } from "../matterHelpers";

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

function RedExpression({ length = 0 }) {
  // i need active/passive
  // function or value assignment

  let activation = {
    active: {
      energy: GeneDefaults.redMult * length
    },
    passive: {}
  }

  return activation;
}

function GreenExpression({ length = 0 }) {
  
  let activation = {
    active: {}, 
    passive: {
      energy: GeneDefaults.greenMult * length
    }
  }

  return activation;
}

function BlackExpression({ length = 0 }) {
  let activation = {
    active: {},
    passive: {}
  }
  return activation;
}

function WhiteExpression({ length = 0 }) {
  let activation = {
    active: {},
    passive: {}
  }
  return activation;
}

function GrayExpression({ length = 0 }) {
  let activation = {
    active: {},
    passive: {}
  }
  return activation;
}

function YellowExpression({ length = 0 }) {
  let activation = {
    active: {},
    passive: {}
  }
  return activation;
}

function CyanExpression({length = 0, parentCell = null }) {
  var lim = GeneDefaults.maxVel * (length / (1 + length));
  const applyForce = MJSWrapper.getApplyForceToCenter(parentCell.nucleus.body)
  let activation = {
    active: {},
    passive: {
      applyForce: function() {
        let vx = lim * prng() - lim / 2;
        let vy = lim * prng() - lim / 2;
        applyForce({x: vx, y: vy});
      }
    }
  }

  return activation;
}


function BlueExpression({ length = 0 }) {
  let activation = {
    active: {},
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