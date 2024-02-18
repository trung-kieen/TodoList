import React, { Component } from 'react';

import { Form, Input, notification, DatePicker, Modal } from 'antd';
const FormItem = Form.Item;

class AddTask extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const AddTaskWrapper = Form.create()(AddTaskForm)
    return (
      <div className="add-task-container">
        <div className="add-task-content">
          <AddTaskWrapper handleSubmit={this.props.onCreate} {...this.props} />
        </div>
      </div>
    );
  }
}

class AddTaskForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleSubmitModal = this.handleSubmitModal.bind(this);
  }
  handleSubmitModal() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const taskRequest = Object.assign({}, values);
        console.log(taskRequest);
      }
    });
  }

  // Note: handle submit date base on modal instead because we need to
        // close modal after submit
  handleSubmitForm(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        const taskRequest = Object.assign({}, values);
        // login(taskRequest)
        //   .then(response => {
        //     localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        //     // this.props.onLogin();
        //   }).catch(error => {
        //     if (error.status === 401) {
        //       notification.error({
        //         message: 'Tasking App',
        //         description: 'Your Username or Password is incorrect. Please try again!'
        //       });
        //     } else {
        //       notification.error({
        //         message: 'Tasking App',
        //         description: error.message || 'Sorry! Something went wrong. Please try again!'
        //       });
        //     }
        //   });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmitForm} className="add-task-form">
        <Modal
          title="Add task"
          visible={this.props.show}
          okText="Add"
          onCancel={this.props.onCancel}
          onOk={this.handleSubmitModal}
        >
          <FormItem label="Task title">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please enter task title!' }],
            })(
              <Input
                size="large"
                name="title"
                placeholder="Summary task" />
            )}
          </FormItem>
          <FormItem label="Note">
            {getFieldDecorator('note', {
            })(
              <Input
                size="large"
                name="title"
                placeholder="Task description" />
            )}
          </FormItem>
          <FormItem label="Due date">
            {getFieldDecorator('due', {
            })(
              <DatePicker
                style={{ width: "100%" }}
                picker="date"
                name="due"
                placeholder="Choose due date to implement this task"
              />
            )}
          </FormItem>
        </Modal>
      </Form>
    );
  }
}


export default AddTask;
