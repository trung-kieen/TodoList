import React, { Component } from "react";
import {
  getAllTasks,
  getUserCreatedTasks,
  getUserVotedTasks,
} from "../util/APIUtils";
import Task from "./Task";
import { castVote } from "../util/APIUtils";
import LoadingIndicator from "../common/LoadingIndicator";
import { Button, Icon, notification } from "antd";
import { POLL_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import "./TaskList.css";
import { notificationError } from "../util/Helpers";

// TODO: handle submit new task on new task box => create new task box

// TODO: handle edit old task by push to server
// TODO: handle mark complete by click checkbox button


const initPage = {
  tasks: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  last: true,
  isLoading: false,
}

class TaskList extends Component {

  constructor(props) {
    super(props);
    this.state = initPage;
    this.loadTaskList = this.loadTaskList.bind(this);
  }
  async loadTaskList() {
    // TODO
    try {
      const respPage = await getAllTasks();
      // Copy current task data to a buffer variable
      const currentTaskList = this.state.tasks.slice();
      // Append new task fetch from page to currennt task (state) array
      respPage.content = currentTaskList.concat(respPage.content);

      this.setTasksState(respPage);
    } catch (e) {
      notificationError(e);
    }
  }

  loadSampleTaskList() {
    const respPage = initPage;
    respPage.tasks.push({ title: "First task", note: "First task description" });
    respPage.tasks.push({ title: "Second task", note: "Second task description" });
    this.setTasksState(respPage);

  }

  // Helper method for set stage
  setTasksState(page, isLoading = false) {
    this.setState({
      tasks: page.content,
      page: page.page,
      size: page.size,
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      last: page.last,
      isLoading: isLoading,
    })
  }

  componentDidUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      // Reset State
      this.setTasksState(initPage)
      this.loadTaskList();
    }
  }


  componentDidMount() {
    // this.loadTaskList;
    this.loadSampleTaskList;
  }
  handleLoadMore() {
    this.loadTaskList(this.state.page + 1);
  }
  renderTasks() {
    const taskViews = [];
    this.state.tasks.forEach((task, taskIndex) => {
      taskViews.push(
        <Task
          key={task.id}
          task={task}
        // Handle self update complete
        // currentVote={this.state.currentVotes[taskIndex]}
        // handleVoteChange={(event) => this.handleVoteChange(event, taskIndex)}
        // handleVoteSubmit={(event) => this.handleVoteSubmit(event, taskIndex)}
        />
      );
    });
    return taskViews;
  }


  render() {
    return (
      // Task
      <div className="tasks-container">
        {
          !this.state.tasks.isLoading && this.state.tasks.length === 0 ? (
            <div className="no-tasks-found">
              <span>No tasks found.</span>
            </div>
          ) : this.renderTasks
        }
        {
          !this.state.isLoading && !this.state.last ? (
            <div className="load-more-tasks">
              <Button
                type="dashed"
                onClick={this.handleLoadMore}
                disabled={this.state.isLoading}
              >
                <Icon type="plus" /> Load more
              </Button>
            </div>
          ) : null}
        {this.state.isLoading ? <LoadingIndicator /> : null
        }

      </div>

    )
  }
}

export default withRouter(TaskList);
