import React, { Component } from 'react';
import { getAllTasks } from '../util/APIUtils';
import Task from './Task';
import LoadingIndicator from '../common/LoadingIndicator';
import { Button, Icon } from 'antd';
import { POLL_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './TaskList.css';
import AddTask from './AddTask';

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
      isLoading: false,
      show: false,
    };
    this.loadTaskList = this.loadTaskList.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal() {
    this.setState({ ...this.state, show: true });
  };

  hideModal() {
    this.setState({ ...this.state, show: false });
  };

  async loadTaskList(page = 0, size = POLL_LIST_SIZE) {

    try {
      let respPage = await getAllTasks(page, size);
      const tasks = this.state.tasks.slice();
      this.setState({
        ... this.state,
        isLoading: true
      });
      this.setState({
        tasks: tasks.concat(respPage.content),
        page: respPage.page,
        size: respPage.size,
        totalElements: respPage.totalElements,
        totalPages: respPage.totalPages,
        last: respPage.last,
        isLoading: false,
        show: false

      })
    }
    finally {
      this.setState({
        ... this.state,
        isLoading: false
      });

    }
  }

  loadDemoTaskList() {
    this.setState({
      tasks: [{ id: 1, title: "Get up early", note: "before 10pm", completed: true },
      { id: 2, title: "Learn new language", note: "have a good plan", completed: false }],
      page: 1,
      size: 10,
      totalElements: 2,
      totalPages: 1,
      last: true,
      isLoading: false
    })

  }
  componentDidMount() {
    // this.loadTaskList();
    this.loadDemoTaskList();
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

  // TODO copy cat with deleted task
  handleUpdateTask(newTask) {
    // TODO: request update to server => Push result at notification
    let newTasks = this.state.tasks.map(oldTask => {
      return oldTask.id === newTask.id ? newTask : oldTask
    })
    console.log(this.state.tasks);
    this.setState({
      // Copy old property value of this object
      ...this.state,
      // Update value of single change task
      tasks: newTasks,
    })
  }
  render() {
    const taskViews = [];
    this.state.tasks.forEach((task) => {
      taskViews.push(<Task
        task={task}
        key={task.id}
        handleUpdateTask={this.handleUpdateTask}
      />)
    });


    return (
      <div>
        <div>
        </div>
        <div className="tasks-container">
          <Button type="button" onClick={this.showModal}>
            Add task
          </Button>
          {taskViews}
          <AddTask show={this.state.show} onCancel={() => { this.hideModal() }} onCreate={() => { console.log("create") }}  />

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
      </div>
    );

  }

}

export default withRouter(TaskList);
