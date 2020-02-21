import React from "react";
import P5Wrapper from "react-p5-wrapper";

import orgSketch from "./sketches/backgroundTest";

class SketchBox extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="sketch">
        <P5Wrapper sketch={orgSketch}></P5Wrapper>
      </div>
    )

  }
}

export default SketchBox;