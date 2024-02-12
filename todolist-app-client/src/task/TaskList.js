import React, { Component } from 'react';
import { getAllTasks, getUserCreatedTasks, getUserVotedTasks } from '../util/APIUtils';
import Task from './Task';
import { castVote } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
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
            currentVotes: [],
            isLoading: false
        };
        this.loadTaskList = this.loadTaskList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadTaskList(page = 0, size = POLL_LIST_SIZE) {
        let promise;
        if(this.props.username) {
            if(this.props.type === 'USER_CREATED_POLLS') {
                promise = getUserCreatedTasks(this.props.username, page, size);
            } else if (this.props.type === 'USER_VOTED_POLLS') {
                promise = getUserVotedTasks(this.props.username, page, size);                               
            }
        } else {
            promise = getAllTasks(page, size);
        }

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise            
        .then(response => {
            const tasks = this.state.tasks.slice();
            const currentVotes = this.state.currentVotes.slice();

            this.setState({
                tasks: tasks.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }

    componentDidMount() {
        this.loadTaskList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                tasks: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            });    
            this.loadTaskList();
        }
    }

    handleLoadMore() {
        this.loadTaskList(this.state.page + 1);
    }

    handleVoteChange(event, taskIndex) {
        const currentVotes = this.state.currentVotes.slice();
        currentVotes[taskIndex] = event.target.value;

        this.setState({
            currentVotes: currentVotes
        });
    }


    handleVoteSubmit(event, taskIndex) {
        event.preventDefault();
        if(!this.props.isAuthenticated) {
            this.props.history.push("/login");
            notification.info({
                message: 'Tasking App',
                description: "Please login to vote.",          
            });
            return;
        }

        const task = this.state.tasks[taskIndex];
        const selectedChoice = this.state.currentVotes[taskIndex];

        const voteData = {
            taskId: task.id,
            choiceId: selectedChoice
        };

        castVote(voteData)
        .then(response => {
            const tasks = this.state.tasks.slice();
            tasks[taskIndex] = response;
            this.setState({
                tasks: tasks
            });        
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login to vote');    
            } else {
                notification.error({
                    message: 'Tasking App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });                
            }
        });
    }

    render() {
        const taskViews = [];
        this.state.tasks.forEach((task, taskIndex) => {
            taskViews.push(<Task 
                key={task.id} 
                task={task}
                currentVote={this.state.currentVotes[taskIndex]} 
                handleVoteChange={(event) => this.handleVoteChange(event, taskIndex)}
                handleVoteSubmit={(event) => this.handleVoteSubmit(event, taskIndex)} />)            
        });

        return (
            <div className="tasks-container">
                {taskViews}
                {
                    !this.state.isLoading && this.state.tasks.length === 0 ? (
                        <div className="no-tasks-found">
                            <span>No Tasks Found.</span>
                        </div>    
                    ): null
                }  
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-tasks"> 
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }              
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        );
    }
}

export default withRouter(TaskList);