import React from "react";
// import p5 from "../../libs/p5";
import P5Wrapper from "react-p5-wrapper";

import orgSketch from "./sketches/orgTest";

class SketchBox extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  // componentDidMount() {
  //   const sketch = new p5(sketch)
  // }

  render() {
    return(
      <div className="sketch">
        <P5Wrapper sketch={orgSketch}></P5Wrapper>
      </div>
    )
    
  }
}

export default SketchBox;