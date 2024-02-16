import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, withRouter } from "react-router-dom";

import { getCurrentUser } from "../util/APIUtils";
import { ACCESS_TOKEN } from "../constants";

import TaskList from "../task/TaskList";
import NewTask from "../task/NewTask";
import Login from "../user/login/Login";
import Signup from "../user/signup/Signup";
import Profile from "../user/profile/Profile";
import AppHeader from "../common/AppHeader";
import NotFound from "../common/NotFound";
import LoadingIndicator from "../common/LoadingIndicator";
import PrivateRoute from "../common/PrivateRoute";

import { Layout, notification } from "antd";
import { notificationError, notificationSuccess } from "../util/Helpers";
const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: true,
    }
    // Bind class method pass in class constructor with new context this
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogout(
    redirectTo = "/",
    description = "You're successfully logout."
  ) {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      currentUser: null,
      isAuthenticated: false,

    })
    this.props.history.push(redirectTo);
    notificationSuccess(description);
  }


  loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      this.setState({
        currentUser: user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (e) {
      notificationError(e);
    }
  }
  handleLogin(description = "You're successfully login.") {
    notificationSuccess(description);
    this.loadCurrentUser();
    this.props.history.push("/");

  }

  // TODO: implement router
  render() {
    if (this.props.isLoading) {

      return <LoadingIndicator />
    }

    return (
      <Layout className="app-container" >
        <AppHeader
          isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          onLogout={this.handleLogout}
        />
        <Content className="app-content">
          <div className="container">
            <BrowserRouter>
              <Routes>
                <Route
                  // TODO: change private route in prod
                  // <PrivateRoute
                  exact
                  path="/"
                  render={(props) => (
                    <TaskList
                      isAuthenticated={this.state.isAuthenticated}
                      currentUser={this.state.currentUser}
                      handleLogout={this.handleLogout}
                      {...props}
                    />
                  )}
                // ></PrivateRoute>
                ></Route>

                <Route
                  path="/login"
                  render={(props) => (
                    <Login onLogin={this.handleLogin} {...props} />
                  )}
                ></Route>
                <Route path="/signup" component={Signup}></Route>
                <Route
                  path="/users/:username"
                  render={(props) => (
                    <Profile
                      isAuthenticated={this.state.isAuthenticated}
                      currentUser={this.state.currentUser}
                      {...props}
                    />
                  )}
                ></Route>
                <PrivateRoute
                  authenticated={this.state.isAuthenticated}
                  path="/task/new"
                  component={NewTask}
                  handleLogout={this.handleLogout}
                ></PrivateRoute>


              </Routes>

            </BrowserRouter>

          </div>

        </Content>
      </Layout>
    )
  }
}

export default withRouter(App);
