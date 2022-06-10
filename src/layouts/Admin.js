/*!

=========================================================
* Now UI Dashboard React - v1.4.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// reactstrap components
import {Redirect, Route, Switch} from "react-router-dom";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import {dashRoutes as routes, internalRoutes} from "routes.js";
import 'assets/css/custom/admin-global.css';
import {USER_KEY} from "../variables/constants";
import Memory from "../variables/memory";

var ps;

class Dashboard extends React.Component {
  state = {
    backgroundColor: "orange",
    filteredRoutes: this.getFilteredRoutes()
  };
  mainPanel = React.createRef();
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.mainPanel.current.scrollTop = 0;
    }
  }
  handleColorClick = (color) => {
    this.setState({ backgroundColor: color });
  };
  render() {

    const filteredRoutes = this.state.filteredRoutes;

    return (
      <div className="wrapper">
        <Sidebar
          {...this.props}
          routes={filteredRoutes}
          backgroundColor={this.state.backgroundColor}
        />
        <div className="main-panel" ref={this.mainPanel}>
          <DemoNavbar {...this.props} />
          <Switch>
            {filteredRoutes.map((prop, key) => {
              return (
                <Route
                  path={prop.layout + prop.path}
                  component={prop.component}
                  key={key}
                />
              );
            })}
            {internalRoutes.map((prop, key) => {
              return (
                  <Route
                      path={prop.layout + prop.path}
                      component={prop.component}
                      key={filteredRoutes.length + key + 1}
                  />
              );
            })}
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
          <Footer fluid />
        </div>
        {/*<FixedPlugin*/}
        {/*  bgColor={this.state.backgroundColor}*/}
        {/*  handleColorClick={this.handleColorClick}*/}
        {/*/>*/}
      </div>
    );
  }

  getFilteredRoutes () {
    const loggedUserRole = Memory.getValue(USER_KEY).userRole;

    return routes.reduce(function (filtered, route) {
      if (route.roles.includes(loggedUserRole)) filtered.push(route);
      return filtered;
    }, []);
  }
}

export default Dashboard;
