import React, { Component } from "react";
import { Checkbox } from "@nextui-org/react";

class CustomCheckbox extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
    <Checkbox defaultSelected radius="md" lineThrough>{this.content}</Checkbox>
    )
  }
}

export default CustomCheckbox;
