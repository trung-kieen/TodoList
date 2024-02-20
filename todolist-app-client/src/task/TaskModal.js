import React, { Component } from 'react';
import { Form, Input, notification, DatePicker, Modal, Select } from 'antd';
import { EMPTY_TASK } from '../constants';
const FormItem = Form.Item;

class TaskModal extends Component {
  constructor(props, okText, onOk, task, onCancel, show) {
    super(props, okText, onOk, task, onCancel, show);
    if (!this.props.hasOwnProperty("task")) {
      this.props = {
        ... this.props,
        initTask: { ...EMPTY_TASK },
      }
    }

  }
  render() {
    const AddTaskWrapper = Form.create()(TaskForm)
    return (
      <div className="add-task-container">
        <div className="add-task-content">
          <AddTaskWrapper  {...this.props} />
        </div>
      </div>
    );
  }
}

// TODO: Add flag icon to select option priority
class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
  }
  handleOk() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // const taskRequest = Object.assign({}, values);
        this.props.onOk(values);
      }
    });
  }

  loadTaskContent() {
    // Object.entries(this.props.task).forEach(([key, value]) => {
    //   if (undefined !== this.props.form.getFieldValue[key]){
    //     this.props.form.setFieldsValue({ [key]: value });
    //   }
    // });
    this.props.form.setFieldsValue(this.props.task);
  }
  componentDidMount() {
    this.loadTaskContent();
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="add-task-form">

        <Modal
          title={this.props.formTitle}
          visible={this.props.show}
          okText={this.props.okText}
          onCancel={this.props.onCancel}
          onOk={this.handleOk}
        >
          <FormItem >
            {getFieldDecorator('id', {
              initialValue: {}
            })(
              <Input type='hidden' />
            )}
          </FormItem>
          <FormItem >
            {getFieldDecorator('completed', {
              initialValue: {}
            })(
              <Input type='hidden' />
            )}
          </FormItem>
          <FormItem label="Task title">
            {getFieldDecorator('title', {
              initialValue: {},
              rules: [{ required: true, message: 'Please enter task title!' }],
            })(
              <Input
                autoFocus={true}
                size="large"
                name="title"
                placeholder="Summary task" />
            )}
          </FormItem>
          <FormItem label="Note">
            {getFieldDecorator('note', {
              initialValue: {},
            })(
              <Input
                size="large"
                name="title"
                placeholder="Task description" />
            )}
          </FormItem>
          <FormItem label="Due date">
            {getFieldDecorator('due', {
              initialValue: {},
            })(
              <DatePicker
                style={{ width: "100%" }}
                picker="date"
                name="due"
                placeholder="Choose due date to implement this task"
              />
            )}
          </FormItem>

          <FormItem label="Priority">
            {getFieldDecorator('priority', {
              initialValue: {},
              valuePropName: 'value',
            })(
              <Select
                style={{ width: 120 }}
                defaultActiveFirstOption={true}

              >
                <Select.Option value="1">Normal</Select.Option>
                <Select.Option value="2">High</Select.Option>
                <Select.Option value="3">Urgent</Select.Option>
              </Select>

            )}
          </FormItem>
        </Modal>
      </Form>
    );
  }
}


export default TaskModal;
