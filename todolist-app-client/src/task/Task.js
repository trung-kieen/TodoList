import React, { Component } from 'react';
import './Task.css';
import { Avatar, Checkbox, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

import { Radio, Button } from 'antd';
const RadioGroup = Radio.Group;

class Task extends Component {
  constructor(props) {
    super(props);
  }
  onChange (e) {
    console.log(`checked = ${e.target.checked}`);
  };

  render() {
    return (
      <div className="task-content">
        <div className="task-title">
          <Checkbox onChange={this.onChange} defaultChecked={this.props.task.completed}>{this.props.task.title}</Checkbox>

        </div>
        <div className="task-note">
          {this.props.task.note}
        </div>
      </div>

    )
  }
}


export default Task;
