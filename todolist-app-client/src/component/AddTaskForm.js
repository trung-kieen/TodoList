import React, { Component, useState } from 'react';

import { Form, Button, Checkbox, DatePicker, Input, Modal } from "antd";
const AddTaskForm = ({ handleClose, show, onCreate }) => {

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Custom form submission logic
    console.log('Form submitted');
  };
  const onFinish = () => {
    console.log("Finish")
  }

  const onFinishFailed = () => {
    console.log("Finish failed ")
  }
  const { getFieldDecorator } = form;
  return (
    <div>
      <Modal
        title="Add task"
        visible={show}
        okText="Add"
        onCancel={handleClose}
        onOk={onCreate}
      >


        <Form
          layout="horizontal"
          autoComplete="off"
          onSubmit={handleSubmit}

        >

          <Form.Item label="Title"
            rules={[
              {
                required: true,
                message: "Please enter task title",
              },
              { whitespace: true },
              { min: 3 },
            ]}
          >
            <Input />
          </Form.Item>


          <Form.Item label="Note" name="note">
            <Input type="textarea" />
          </Form.Item>

          <Form.Item name="due" label="Due"
            rules={[
              {
                required: true,
                message: "Please provide due date ",
              },
            ]}
            hasFeedback
          >
            <DatePicker
              style={{ width: "100%" }}
              picker="date"
              placeholder="Chose due date"
            />
          </Form.Item>

          <Button block type="primary" htmlType="submit">
            Register
          </Button>

        </Form>


      </Modal>
    </div >
  )
}

// export default AddTaskForm;


