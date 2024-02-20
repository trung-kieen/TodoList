import React, { Component, useState } from 'react';
import './Task.css';
import { Checkbox } from 'antd';
import { getTimeRemaining } from '../util/Helpers';
class Task extends Component {
  constructor(props) {
    super(props);
    this.task = this.props.task;
    this.handleTooggle = this.handleTooggle.bind(this);
    this.handleClickDetail = this.handleClickDetail.bind(this);

  }



  handleTooggle(event) {
    this.task.completed = event.target.checked;
    this.props.handleUpdateTask(this.task);
    event.stopPropagation();

  }
  handleUpdateTask(taskData) {
    this.props.handleUpdateTask(taskData)
  }
  handleClickDetail() {
    this.props.handleClickDetail(this.task);
  }
  render() {

    return (
      <div key={this.task.id} className="task-content" onClick={this.handleClickDetail}>
        <div>
          <span className="task-title" onClick={this.handleTooggle}>
            {this.checkBoxTitle()}
          </span>
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
      <Checkbox className="task-completed" defaultChecked={this.task.completed}>
        {
          this.task.completed ? (<del>{this.task.title}</del>) : (<span> {this.task.title}</span>)
        }
      </Checkbox>
    )

  }

}


export default Task;
