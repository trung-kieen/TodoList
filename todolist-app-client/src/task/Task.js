import React, { Component, useState } from 'react';
import './Task.css';
import { Checkbox, Modal } from 'antd';
// import { Link } from 'react-router-dom';
import { getTimeRemaining } from '../util/Helpers';
import { Radio, Button } from 'antd';
class Task extends Component {
  constructor(props) {
    super(props);
    this.task = this.props.task;

  }


  handleTooggle(event) {
    this.task.completed = event.target.checked;
    this.props.handleUpdateTask(this.task);

  }
  render() {

    return (
      <div key={this.task.id} className="task-content">
        <div className="task-title">
          {this.checkBoxTitle()}
        </div>
        <div className="task-note">
          {this.task.note}
        </div>
        {this.dueDate()}
      </div>

    )
  }
  dueDate() {
    return (
      <div className="task-due">
        {this.task.due ? getTimeRemaining(this.task.due) : null}
      </div>
    )
  }
  checkBoxTitle() {
    return (
      <Checkbox className="task-completed" onChange={event => this.handleTooggle(event)} defaultChecked={this.task.completed}>
        {
          this.task.completed ? (<del>{this.task.title}</del>) : (<span> {this.task.title}</span>)
        }
      </Checkbox>
    )

  }

}


export default Task;
