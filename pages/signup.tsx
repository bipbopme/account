import React from "react";
import { Alert, Form, Input, Button, Result, Typography } from "antd";
import { Store } from "antd/lib/form/interface";
import { SmileOutlined } from "@ant-design/icons";
import Layout from "../components/layout";

interface SignupPageState {
  loading: boolean;
  complete: boolean;
  errorMessage: string | undefined;
}

export default class SignupPage extends React.Component<
  unknown,
  SignupPageState
> {
  state = {
    loading: false,
    complete: false,
    errorMessage: undefined,
  };

  async handleFinish(values: Store) {
    if (!values.errorFields) {
      this.setState({ loading: true });

      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const json = await response.json();

      if (response.ok) {
        this.setState({ complete: true, loading: false });
      } else {
        this.setState({ errorMessage: json.message, loading: false });
      }
    }
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 18,
          offset: 6,
        },
      },
    };

    if (this.state.complete) {
      return (
        <Layout title="Your account has been created!">
          <Result
            icon={<SmileOutlined />}
            title="Your account has been created!"
            extra={
              <div>
                You can send an{" "}
                <a href="https://zimbra.bipbop.me/" target="_blank">
                  email
                </a>{" "}
                or have a{" "}
                <a href="https://riot.bipbop.me/" target="_blank">
                  riot
                </a>{" "}
                with your friends.
              </div>
            }
          />
        </Layout>
      );
    } else {
    }
    return (
      <Layout title="Create your bipbop account">
        <Typography.Title level={2} className="logo">
          bipbop
        </Typography.Title>
        <Typography.Title level={3}>Create your account</Typography.Title>
        {this.state.errorMessage && (
          <Alert message={this.state.errorMessage} type="error" />
        )}
        <Form {...formItemLayout} onFinish={this.handleFinish.bind(this)}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please choose a username" },
              {
                pattern: /^[a-z0-9\.]+$/,
                message: "Lowercase letters, numbers, and periods only",
              },
            ]}
          >
            <Input autoCapitalize="off" autoCorrect="off" />
          </Form.Item>
          <Form.Item
            label="First name"
            name="firstName"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="Last name"
            name="lastName"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter a password",
              },
              {
                min: 8,
                message: "Please must be at least 8 characters",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password",
              },
              ({ getFieldValue }) => ({
                validator(_rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Passwords entered don't match");
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              loading={this.state.loading}
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>
      </Layout>
    );
  }
}
