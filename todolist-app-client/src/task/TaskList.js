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
        task: EMPTY_TASK,
        add: { show: false },
        edit: { show: false },
      }
    };

    this.loadTaskList = this.loadTaskList.bind(this);
    this.showModalAdd = this.showModalAdd.bind(this);
    this.hideModalAdd = this.hideModalAdd.bind(this);
    this.showModalEdit = this.showModalEdit.bind(this);
    this.hideModalEdit = this.hideModalEdit.bind(this);
    this.handleAddTask = this.handleAddTask.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickAdd = this.handleClickAdd.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
    this.updateTaskState = this.updateTaskState.bind(this);

    notification.config(NOTIFICATION_CONFIG);
  }


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
            <Button className="add-task-button" type="button" onClick={this.handleClickAdd}>
              Add task
            </Button>
            <TaskModal show={this.state.modal.add.show} showCheckbox={false} okText="Add" onCancel={this.hideModalAdd} onOk={this.handleAddTask} task={EMPTY_TASK} />
          </div>
          <div className="edit-task-container">
            <TaskModal show={this.state.modal.edit.show} showCheckbox={true} okText="Save" onCancel={this.hideModalEdit} onOk={this.handleUpdateTask} task={this.state.modal.task} />
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

  showModalAdd() {
    this.setState({ ...this.state, modal: { ...this.state.modal, add: { show: true } } });
  };

  showModalEdit() {
    this.setState({ ...this.state, modal: { ...this.state.modal, edit: { show: true } } });
  };
  hideModalAdd() {
    this.setState({ ...this.state, modal: { ...this.state.modal, add: { show: false } } });
  };
  hideModalEdit() {
    this.setState({ ...this.state, modal: { ...this.state.modal, edit: { show: false } } });
  };
  handleClickAdd() {
    this.showModalAdd();
  }
  handleClickEdit(taskData) {
    this.setState({
      ...this.state, modal: {
        ... this.state.modal,
        task: taskData,
        edit: { show: true }
      }
    })
  }

  // TODO copy cat with deleted task
  async handleUpdateTask(newTask) {
    try {
      let taskResponse = await updateTask(newTask);
      this.updateTaskState(taskResponse);
    } catch (e) {
      notification.error({ message: APP_TITLE, description: toString(e) })

    }
  }

  async handleAddTask(taskData) {
    try {
      console.log(taskData);
      let respTask = await createTask(taskData)
      this.addTaskState(respTask);
      notification.success({ message: APP_TITLE, description: "Create task success" })
    } catch (e) {
      notification.error({ message: APP_TITLE, description: toString(e) })
    }
  }
  // ====================> Helper function <=======================
  updateTaskState(newTask) {
    let newTasks = this.state.tasks.slice();
    newTasks = [newTask, ...newTasks.filter((task) => task.id !== newTask.id)];
    this.setState({
      // Copy old property value of this object
      ...this.state,
      // Update value of single change task
      tasks: newTasks,
    })
    this.hideModalEdit();
    this.forceUpdate();
    this.forceUpdate();
  }

  addTaskState(newTask) {
    const newTasks = this.state.tasks.slice();
    this.setState({ ...this.state, tasks: newTasks.concat(newTask), modal: { ... this.state.modal, show: false } });
    this.hideModalAdd();
    this.forceUpdate();
  }

}

export default withRouter(TaskList);
