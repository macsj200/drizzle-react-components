import React, { Component } from "react";
import PropTypes from "prop-types";

class ContractForm extends Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.contracts = props.drizzle.contracts;

    // Get the contract ABI
    const abi = this.contracts[this.props.contract].abi;

    this.inputs = [];
    var initialState = {};

    // Iterate over abi for correct function.
    for (var i = 0; i < abi.length; i++) {
      if (abi[i].name === this.props.method) {
        this.inputs = abi[i].inputs;

        for (var j = 0; j < this.inputs.length; j++) {
          initialState[this.inputs[j].name] = "";
        }

        break;
      }
    }

    this.state = initialState;
  }

  handleSubmit() {
    if (this.props.sendArgs) {
      return this.contracts[this.props.contract].methods[
        this.props.method
      ].cacheSend(...Object.values(this.state), this.props.sendArgs);
    }

    this.contracts[this.props.contract].methods[this.props.method].cacheSend(
      ...Object.values(this.state),
    );
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  translateType(type) {
    switch (true) {
      case /^uint/.test(type):
        return "number";
      case /^string/.test(type) || /^bytes/.test(type):
        return "text";
      case /^bool/.test(type):
        return "checkbox";
      default:
        return "text";
    }
  }

  render() {
    return (
      <form className="pure-form pure-form-stacked">
        {this.inputs.map((input, index) => {
          var inputType = this.translateType(input.type);
          var inputLabel = this.props.labels
            ? this.props.labels[index]
            : input.name;
          // check if input type is struct and if so loop out struct fields as well
          return (
            <input
              key={input.name}
              type={inputType}
              name={input.name}
              value={this.state[input.name]}
              placeholder={inputLabel}
              onChange={this.handleInputChange}
            />
          );
        })}
        <button
          key="submit"
          className="pure-button"
          type="button"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      </form>
    );
  }
}

ContractForm.propTypes = {
  drizzle: PropTypes.object.isRequired,
  contract: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  sendArgs: PropTypes.object,
  labels: PropTypes.arrayOf(PropTypes.string),
};

export default ContractForm;
