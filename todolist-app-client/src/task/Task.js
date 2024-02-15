import React, { Component } from 'react';

import './Task.css';
import { Avatar,  Icon } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';
import Checkbox from '../component/Checkbox';
import { Radio, Button } from 'antd';
const RadioGroup = Radio.Group;


class Task extends Component {



    task = {"title" : "Hell world", "note": "This task is over due"};
    render() {
        return (
            <div className="task-content">
                <div className="task-header">
                    <div className="task-title">
                        {this.task.title}
                    </div>
                </div>
                <div className="task-note">
                        {this.task.note}
                </div>
                <div className="task-footer">
                  <Checkbox />
                </div>
            </div>
        );
    }
}



export default Task;
