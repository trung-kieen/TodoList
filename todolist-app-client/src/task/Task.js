import React, { Component } from 'react';
import './Task.css';
import { Avatar, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

import { Radio, Button } from 'antd';
const RadioGroup = Radio.Group;

class Task extends Component {
    calculatePercentage = (choice) => {
        if(this.props.task.totalVotes === 0) {
            return 0;
        }
        return (choice.voteCount*100)/(this.props.task.totalVotes);
    };

    isSelected = (choice) => {
        return this.props.task.selectedChoice === choice.id;
    }

    getWinningChoice = () => {
        return this.props.task.choices.reduce((prevChoice, currentChoice) => 
            currentChoice.voteCount > prevChoice.voteCount ? currentChoice : prevChoice, 
            {voteCount: -Infinity}
        );
    }

    getTimeRemaining = (task) => {
        const expirationTime = new Date(task.expirationDateTime).getTime();
        const currentTime = new Date().getTime();
    
        var difference_ms = expirationTime - currentTime;
        var seconds = Math.floor( (difference_ms/1000) % 60 );
        var minutes = Math.floor( (difference_ms/1000/60) % 60 );
        var hours = Math.floor( (difference_ms/(1000*60*60)) % 24 );
        var days = Math.floor( difference_ms/(1000*60*60*24) );
    
        let timeRemaining;
    
        if(days > 0) {
            timeRemaining = days + " days left";
        } else if (hours > 0) {
            timeRemaining = hours + " hours left";
        } else if (minutes > 0) {
            timeRemaining = minutes + " minutes left";
        } else if(seconds > 0) {
            timeRemaining = seconds + " seconds left";
        } else {
            timeRemaining = "less than a second left";
        }
        
        return timeRemaining;
    }

    render() {
        const taskChoices = [];
        if(this.props.task.selectedChoice || this.props.task.expired) {
            const winningChoice = this.props.task.expired ? this.getWinningChoice() : null;

            this.props.task.choices.forEach(choice => {
                taskChoices.push(<CompletedOrVotedTaskChoice 
                    key={choice.id} 
                    choice={choice}
                    isWinner={winningChoice && choice.id === winningChoice.id}
                    isSelected={this.isSelected(choice)}
                    percentVote={this.calculatePercentage(choice)} 
                />);
            });                
        } else {
            this.props.task.choices.forEach(choice => {
                taskChoices.push(<Radio className="task-choice-radio" key={choice.id} value={choice.id}>{choice.text}</Radio>)
            })    
        }        
        return (
            <div className="task-content">
                <div className="task-header">
                    <div className="task-creator-info">
                        <Link className="creator-link" to={`/users/${this.props.task.createdBy.username}`}>
                            <Avatar className="task-creator-avatar" 
                                style={{ backgroundColor: getAvatarColor(this.props.task.createdBy.name)}} >
                                {this.props.task.createdBy.name[0].toUpperCase()}
                            </Avatar>
                            <span className="task-creator-name">
                                {this.props.task.createdBy.name}
                            </span>
                            <span className="task-creator-username">
                                @{this.props.task.createdBy.username}
                            </span>
                            <span className="task-creation-date">
                                {formatDateTime(this.props.task.creationDateTime)}
                            </span>
                        </Link>
                    </div>
                    <div className="task-question">
                        {this.props.task.question}
                    </div>
                </div>
                <div className="task-choices">
                    <RadioGroup 
                        className="task-choice-radio-group" 
                        onChange={this.props.handleVoteChange} 
                        value={this.props.currentVote}>
                        { taskChoices }
                    </RadioGroup>
                </div>
                <div className="task-footer">
                    { 
                        !(this.props.task.selectedChoice || this.props.task.expired) ?
                        (<Button className="vote-button" disabled={!this.props.currentVote} onClick={this.props.handleVoteSubmit}>Vote</Button>) : null 
                    }
                    <span className="total-votes">{this.props.task.totalVotes} votes</span>
                    <span className="separator">•</span>
                    <span className="time-left">
                        {
                            this.props.task.expired ? "Final results" :
                            this.getTimeRemaining(this.props.task)
                        }
                    </span>
                </div>
            </div>
        );
    }
}

function CompletedOrVotedTaskChoice(props) {
    return (
        <div className="cv-task-choice">
            <span className="cv-task-choice-details">
                <span className="cv-choice-percentage">
                    {Math.round(props.percentVote * 100) / 100}%
                </span>            
                <span className="cv-choice-text">
                    {props.choice.text}
                </span>
                {
                    props.isSelected ? (
                    <Icon
                        className="selected-choice-icon"
                        type="check-circle-o"
                    /> ): null
                }    
            </span>
            <span className={props.isWinner ? 'cv-choice-percent-chart winner': 'cv-choice-percent-chart'} 
                style={{width: props.percentVote + '%' }}>
            </span>
        </div>
    );
}


export default Task;