import React, { Component } from 'react';
import { createTask, getAllTasks, updateTask } from '../util/APIUtils';
import Task from './Task';
import LoadingIndicator from '../common/LoadingIndicator';
import { Button, Icon, notification } from 'antd';
import { APP_TITLE, DEFAULT_PAGE, DEMO_PAGE, EMPTY_TASK, NOTIFICATION_CONFIG, POLL_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './TaskList.css';
import TaskModal from './TaskModal';

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...DEFAULT_PAGE,
      modal: {
        show: false, task: EMPTY_TASK,
        type: "add",
      }
    };

    this.loadTaskList = this.loadTaskList.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleAddTask = this.handleAddTask.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickAdd = this.handleClickAdd.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
    this.updateTaskState = this.updateTaskState.bind(this);

    notification.config(NOTIFICATION_CONFIG);
  }

  showModal() {
    this.setState({ ...this.state, modal: { ...this.state.modal, show: true } });
  };

  hideModal() {
    this.setState({ ...this.state, modal: { ...this.state.modal, show: false } });
  };

  async loadTaskList(page = 0, size = POLL_LIST_SIZE) {
    try {
      this.setState({
        ... this.state,
        isLoading: true
      });
      let respPage = await getAllTasks(page, size);
      const tasks = this.state.tasks.slice();
      this.setState({
        ...respPage,
        tasks: tasks.concat(respPage.content),
        isLoading: false,
        modal: { ... this.state.modal }
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
    this.setState(DEMO_PAGE)

  }

  async handleAddTask(taskData) {
    try {
      let respTask = await createTask(taskData)
      this.addTaskState(respTask);
      this.hideModal();
      notification.success({ message: APP_TITLE, description: "Create task success" })
    } catch (e) {
      notification.error({ message: APP_TITLE, description: toString(e) })
    }
  }
  componentDidMount() {
    this.loadTaskList();
  }

  componentDidUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      // Reset State
      this.setState(DEFAULT_PAGE);
      this.loadTaskList();
    }
  }

  handleLoadMore() {
    this.loadTaskList(this.state.page + 1);
  }

  handleClickAdd() {
    this.setState({
      ...this.state, modal: {
        show: true,
        type: "add",
      }
    })
  }
  handleClickEdit(taskData) {
    this.setState({
      ...this.state, modal: {
        task: taskData,
        show: true,
        type: "edit"
      }
    })
  }

  // TODO copy cat with deleted task
  async handleUpdateTask(newTask) {
    try {
      let taskResponse = await updateTask(newTask);
      this.updateTaskState(taskResponse);
      this.hideModal();
      notification.success({ message: APP_TITLE, description: "Update task success" })
    } catch (e) {
      notification.error({ message: APP_TITLE, description: toString(e) })

    }
  }
  render() {
    const taskViews = [];
    this.state.tasks.forEach((task) => {
      taskViews.push(<Task
        task={task}
        key={task.id}
        handleUpdateTask={this.handleUpdateTask}
        handleClickDetail={this.handleClickEdit}
      />)
    });


    return (
      <div>
        <div>
        </div>
        <div className="tasks-container">
          <div className="add-task-container">
            <Button className="add-task-button" type="button" onClick={this.showModal}>
              Add task
            </Button>
            {this.state.modal.type === "add" ?
              <TaskModal show={this.state.modal.show} okText="Add" onCancel={this.hideModal} onOk={this.handleAddTask} task={EMPTY_TASK} /> :
              <TaskModal show={this.state.modal.show} okText="Save" onCancel={this.hideModal} onOk={this.handleUpdateTask} task={this.state.modal.task} />
            }
          </div>
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
      </div>
    );

  }

  // ====================> Helper function <=======================
  updateTaskState(newTask) {
    let newTasks = this.state.tasks.map(oldTask => {
      return oldTask.id === newTask.id ? newTask : oldTask
    })
    this.setState({
      // Copy old property value of this object
      ...this.state,
      // Update value of single change task
      tasks: newTasks,
    })
    return newTasks;
  }

  addTaskState(newTask) {
    this.setState({ ...this.state, tasks: [newTask, ... this.state.tasks] });
  }
}

export default withRouter(TaskList);
