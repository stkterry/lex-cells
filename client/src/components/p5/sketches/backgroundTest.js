import OrgEnv from "../../../libs/classes/org-env/orgEnv";
import { CS } from "./orgConfig";


const testSketch = (p) => {
  var canvas;

  var orgEnv;

  var fpsP;
  var pDiv;
  var debugNextFrameB;
  var start_stopB;
  var start_stop_cond = false;

  p.setup = () => {
    p.disableFriendlyErrors = true;
    canvas = p.createCanvas(CS.w, CS.h);
    pDiv = p.createDiv();
    pDiv.style('color', 'white');
    fpsP = p.createP();
    fpsP.parent(pDiv);
    debugNextFrameB = p.createButton('Next Frame');
    debugNextFrameB.parent(pDiv);
    debugNextFrameB.mousePressed(debugNextFrame);
    start_stopB = p.createButton('Start/Stop');
    start_stopB.mousePressed(start_stop);
    start_stopB.parent(pDiv);
    
    p.noStroke();


    orgEnv = new OrgEnv(p, CS.w, CS.h);
    orgEnv.addNOrgs(50);

    orgEnv.mjsi.run();
  }

  p.draw = () => {
    p.background(0);

    orgEnv.drawOrgs();
    orgEnv.updateEnv();
    // if (start_stop_cond) {
    //   orgEnv.mjsi.nextTick(p.frameRate() / 60)
    // }

    if (orgEnv.orgsArray == 0) orgEnv.addNOrgs(50);

    fpsP.html(p.getFrameRate().toFixed(2));
  }

  function debugNextFrame() {
    orgEnv.updateEnv();
    orgEnv.mjsi.nextTick(p.frameRate() / 60)
  }

  function start_stop() {
    start_stop_cond = start_stop_cond ? false : true;
  }
}




export default testSketch;