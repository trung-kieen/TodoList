import React, { Component } from 'react';
import './Task.css';
import { Avatar, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

import { Radio, Button } from 'antd';
const RadioGroup = Radio.Group;

class Task extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="task-container">
        <div className="task-title">
          {this.props.task.title}
        </div>
        <div className="task-note">
          {this.props.task.note}
        </div>
      </div>

    )
  }
}


export default Task;
