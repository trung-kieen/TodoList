import React, { Component } from 'react';
import { getAllTasks, getUserCreatedTasks, getUserVotedTasks } from '../util/APIUtils';
import Task from './Task';
import { castVote } from '../util/APIUtils';
import LoadingIndicator from '../common/LoadingIndicator';
import { Button, Icon, notification } from 'antd';
import { POLL_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './TaskList.css';

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      isLoading: false
    };
    this.loadTaskList = this.loadTaskList.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  loadTaskList(page = 0, size = POLL_LIST_SIZE) {
    let promise = getAllTasks(page, size);

    if (!promise) {
      return;
    }

    try {

      let respPage = getAllTasks(page, size);
      const tasks = this.state.tasks.slice();
      this.setState({
        isLoading: true
      });
      this.setState({
        tasks: tasks.concat(respPage.content),
        page: respPage.page,
        size: respPage.size,
        totalElements: respPage.totalElements,
        totalPages: respPage.totalPages,
        last: respPage.last,
        isLoading: false
      })
    }
    finally {
      this.setState({
        isLoading: false
      });

    }


  }

  componentDidMount() {
    this.loadTaskList();
  }

  componentDidUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      // Reset State
      this.setState({
        tasks: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        isLoading: false
      });
      this.loadTaskList();
    }
  }

  handleLoadMore() {
    this.loadTaskList(this.state.page + 1);
  }


  render() {
    const taskViews = [];
    this.state.tasks.forEach((task, taskIndex) => {
      taskViews.push(<Task
        key={task.id}
        task={task}
        />)
    });

    return (
      <div className="tasks-container">
        {taskViews}
        {
          !this.state.isLoading && this.state.tasks.length === 0 ? (
            <div className="no-tasks-found">
              <span>No Tasks Found.</span>
            </div>
          ) : null
        }
        {
          !this.state.isLoading && !this.state.last ? (
            <div className="load-more-tasks">
              <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                <Icon type="plus" /> Load more
              </Button>
            </div>) : null
        }
        {
          this.state.isLoading ?
            <LoadingIndicator /> : null
        }
      </div>
    );
  }
}

export default withRouter(TaskList);
