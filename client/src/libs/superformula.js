import * as mjs from "matter-js";
import decomp from "poly-decomp"
window.decomp = decomp;

const Bodies = mjs.Bodies;


export const superFormula = (theta, a, b, m1, m2, n1, n2, n3) => {
  let cx = Math.cos(m1 * theta / 4) / a;
  let cy = Math.sin(m2 * theta / 4) / b;

  let cxN2 = Math.pow(Math.abs(cx), n2);
  let cyN2 = Math.pow(Math.abs(cy), n3);

  return Math.pow(cxN2 + cyN2, -1 / n1);
}

export const sFToVerts = (opts) => {
  const { numPoints, a, b, m1, m2, n1, n2, n3, scale} = opts;
  let theta_del = Math.PI * 2 / numPoints;
  let rhos = [];
  let thetas = [];
  let theta = 0;
  
  while (theta < Math.PI * 2) {
    rhos.push(scale * superFormula(theta, a, b, m1, m2, n1, n2, n3));

    thetas.push(theta)
    theta += theta_del;
  }

  let verts = [];
  for (let i = 0; i < rhos.length; i++) {
    let xx = rhos[i] * Math.cos(thetas[i]);
    let yy = rhos[i] * Math.sin(thetas[i])
    verts.push([xx, yy]);
  }
  return verts;
}

export const vertsToBody = (x, y, verts, options) => {

  let vertexGroups = new Array(verts.length);
  for (let i = 0; i < verts.length; i++) {
    vertexGroups[i] = {x: verts[i][0], y: verts[i][1]}
  }

  let body = Bodies.fromVertices(x, y, vertexGroups, options)
  
  return body;
}
