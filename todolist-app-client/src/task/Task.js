import React, { Component } from 'react';

import './Task.css';
import { Avatar, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';
import { Radio, Button } from 'antd';
import CustomCheckbox from '../component/CustomCheckbox';
const RadioGroup = Radio.Group;


class Task extends Component {

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="task-content">
        <div className="task-header">
          <CustomCheckbox  content={this.task.title} />
          <div className="task-title">
            {this.task.title}
          </div>
        </div>
        <div className="task-note">
          {this.task.note}
        </div>
      </div>
    );
  }
}



export default Task;
