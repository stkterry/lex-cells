import React from "react";

class Form extends React.Component {
  constructor() {
    super();

    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState(() => {return { value }});
  }

  render() {
    return (
      <form>
        <label>Some Text</label>
        <input 
          type="text" 
          value={this.state.value} 
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

export default Form;