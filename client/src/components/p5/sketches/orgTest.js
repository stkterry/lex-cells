import OrgEnv from "../../../libs/classes/org-env/orgEnv";
import { CS } from "./orgConfig";
import MJSW from "../../../libs/classes/MJSWrapper";

import CCapture from "ccapture.js";

const testSketch = (p) => {
  var capturer = new CCapture({ flags:"--expose-gc", format: 'webm', framrate: 60, timeLimit: 59, display: true });
  var recordB;
  var recording = false;
  var startRecording = false;

  var canvas;

  var orgEnv;

  var fpsP;
  var pDiv;
  var debugNextFrameB;
  var startStopEngine;
  var startStopEngineBool = true;

  var framesContainer = new Array(15).fill(60);

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
    startStopEngine = p.createButton('Stop');
    startStopEngine.mousePressed(start_stop);
    startStopEngine.parent(pDiv);

    recordB = p.createButton("Record");
    recordB.style('background-color', 'white')
    recordB.parent(pDiv);
    recordB.mousePressed(capture);

    p.noStroke();


    orgEnv = new OrgEnv(p, CS.w, CS.h);
    orgEnv.addNOrgs(50);

  }

  p.draw = () => {
    if (startRecording) {
      capturer.start();
      startRecording = false;
    }

    if (startStopEngineBool) {
      MJSW.smoothUpdate(1100 / avgFrameRate())
      orgEnv.updateEnv();
      p.background(0);
      orgEnv.drawOrgs();
    }

  
    if (orgEnv.organisms == 0) orgEnv.addNOrgs(50);

    fpsP.html("FPS: " + avgFrameRate().toFixed() 
        + " | UpTime: " + Math.floor(p.millis() / 1000) + 's'
        + " | Num Alive: " + orgEnv.organisms.length);

    if (recording) {
      capturer.capture(document.getElementById("defaultCanvas0"))
    }

  }

  function debugNextFrame() {
    MJSW.smoothUpdate(1100 / avgFrameRate())
    orgEnv.updateEnv();
    p.background(0);
    orgEnv.drawOrgs();
  }

  function start_stop() {
    if (startStopEngineBool) {
      startStopEngineBool = false;
      startStopEngine.html("Start");
    } else {
      startStopEngineBool = true;
      startStopEngine.html("Stop");
    }
  }

  function avgFrameRate() {
    framesContainer[p.frameCount % 15] = p.frameRate();
    return framesContainer.reduce((a, b) => a + b, 0) / 15;
  }


  function capture() {
    if (recording) {
      recordB.style('background-color', 'white')
      recordB.html("Record");
      capturer.stop();
      capturer.save();
      recording = false;
    } else {
      recordB.style('background-color', 'red');
      recordB.html("Recording");
      startRecording = true;
      recording = true;
    }
  }


}




export default testSketch;