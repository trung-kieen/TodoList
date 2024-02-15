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

// TODO: handle submit new task on new task box => create new task box

// TODO: handle edit old task by push to server
// TODO: handle mark complete by click checkbox button
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
      // currentVotes: [],
      isLoading: false,
    };
    this.loadTaskList = this.loadTaskList.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  // NOTE: deplicate
  loadTaskList(page = 0, size = POLL_LIST_SIZE) {
    let taskPromise;
    if (this.props.username) {
      if (this.props.type === "USER_CREATED_POLLS") {
        taskPromise = getUserCreatedTasks(
          this.props.username,
          page,
          size
        );
      } else if (this.props.type === "USER_VOTED_POLLS") {
        taskPromise = getUserVotedTasks(
          this.props.username,
          page,
          size
        );
      }
    } else {
      taskPromise = getAllTasks(page, size);
    }

    if (!taskPromise) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    taskPromise
      .then((response) => {
        const tasks = this.state.tasks.slice();
        // const currentVotes = this.state.currentVotes.slice();

        this.setState({
          tasks: tasks.concat(response.content),
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          // currentVotes: currentVotes.concat(
          // Array(response.content.length).fill(null)
          // ),
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  loadDemoTaskList() {
    this.setState({
      tasks: [{title: "first task", note: "note for first task"} , {title: "second note" , note: "note description" } , { title: "last note" , note : "last note description"}],
      page: 1,
      size: 10,
      totalElements: 3,
      totalPages: 1,
      last: true,
      // currentVotes: currentVotes.concat(
      //   Array(response.content.length).fill(null)
      // ),
      isLoading: false,
    });
  }
// )
//             .catch((error) => {
//   this.setState({
//     isLoading: false,
//   });
// });

//     }
componentDidMount() {
  // this.loadTaskList();
  this.loadDemoTaskList();
}

// NOTE: deplicate
// componentDidUpdate(nextProps) {
//   if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
//     // Reset State
//     this.setState({
//       tasks: [],
//       page: 0,
//       size: 10,
//       totalElements: 0,
//       totalPages: 0,
//       last: true,
//       // currentVotes: [],
//       isLoading: false,
//     });
//     this.loadTaskList();
//   }
// }

handleLoadMore() {
  this.loadTaskList(this.state.page + 1);
}

// handleVoteChange(event, taskIndex) {
//     const currentVotes = this.state.currentVotes.slice();
//     currentVotes[taskIndex] = event.target.value;

//     this.setState({
//         currentVotes: currentVotes
//     });
// }

// handleVoteSubmit(event, taskIndex) {
//     event.preventDefault();
//     if(!this.props.isAuthenticated) {
//         this.props.history.push("/login");
//         notification.info({
//             message: 'Tasking App',
//             description: "Please login to vote.",
//         });
//         return;
//     }

//     const task = this.state.tasks[taskIndex];
//     const selectedChoice = this.state.currentVotes[taskIndex];

//     const voteData = {
//         taskId: task.id,
//         choiceId: selectedChoice
//     };

//     castVote(voteData)
//     .then(response => {
//         const tasks = this.state.tasks.slice();
//         tasks[taskIndex] = response;
//         this.setState({
//             tasks: tasks
//         });
//     }).catch(error => {
//         if(error.status === 401) {
//             this.props.handleLogout('/login', 'error', 'You have been logged out. Please login to vote');
//         } else {
//             notification.error({
//                 message: 'Tasking App',
//                 description: error.message || 'Sorry! Something went wrong. Please try again!'
//             });
//         }
//     });
// }

render() {
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

  return (
    <div className="tasks-container">
      {taskViews}
      {!this.state.isLoading && this.state.tasks.length === 0 ? (
        <div className="no-tasks-found">
          <span>No Tasks Found.</span>
        </div>
      ) : null}
      {!this.state.isLoading && !this.state.last ? (
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
      {this.state.isLoading ? <LoadingIndicator /> : null}
    </div>
  );
}
}

export default withRouter(TaskList);
