import React, {Component} from "react";
import 'assets/css/custom/login.css';
import {Form} from "react-bootstrap";
import Joi from "joi-browser";
import axios from "axios";
import Functions from "../variables/functions";
import INTERCEPTOR from "../variables/global/interceptor";
import {SERVER_URL, USER_KEY} from "../variables/constants";
import {dashRoutes, internalRoutes} from "../routes";
import Memory from "../variables/memory";

class Login extends Component {
    state = {
        interceptor: INTERCEPTOR, // added this line to avoid unused import warning for INTERCEPTOR
        loginUrl: SERVER_URL.concat(`/user/auth`),
        loginData: {
            username: '',
            password: ''
        },
        loginDataErrors: {
            username: '',
            password: ''
        },
        processing: false
    };

    loginValidateSchema = {
        username: Joi.string().required(),
        password: Joi.string().required()
    }

    render() {
        return (
            <React.Fragment>

                <div className="login-body">

                    <div className="login-wrap">
                        <div className="login-html">
                            <input id="tab-1" type="radio" name="tab" className="sign-in"/>
                            <label htmlFor="tab-1" className="tab">Sign In</label>

                            <Form className="login-form" onSubmit={this.login}>
                                <div className="sign-in-htm">
                                    <div className="group">
                                        <label htmlFor="user" className="label">Username</label>
                                        <input id="username"
                                               type="text"
                                               className="input"
                                               value={this.state.username}
                                               name="username"
                                               onChange={this.handleLoginFormChange}
                                        />
                                        {this.state.loginDataErrors.username ?
                                            <div
                                                className="alert alert-danger">{this.state.loginDataErrors.username}</div> : ''}
                                    </div>
                                    <div className="group">
                                        <label htmlFor="pass" className="label">Password</label>
                                        <input id="password"
                                               type="password"
                                               className="input"
                                               value={this.state.password}
                                               name="password"
                                               onChange={this.handleLoginFormChange}/>
                                        {this.state.loginDataErrors.password ?
                                            <div
                                                className="alert alert-danger">{this.state.loginDataErrors.password}</div> : ''}
                                    </div>

                                    <div className="group">
                                        <input type="submit"
                                               style={this.state.processing ? {backgroundColor: "lightsteelblue"} : {}}
                                               disabled={this.state.processing}
                                               className="button" value="Sign In"/>
                                    </div>
                                    <div className="login-hr"/>
                                    <div className="foot-lnk">
                                        <a className="login-a" href="#forgot">Forgot Password?</a>
                                    </div>
                                </div>

                            </Form>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    handleLoginFormChange = ({currentTarget: input}) => {
        const loginData = {...this.state.loginData};
        loginData[input.name] = input.value;
        this.setState({loginData});
    }

    login = async (event) => {
        event.preventDefault();
        const loginDataErrors = this.loginDataErrors();
        this.setState({loginDataErrors});
        if (Object.keys(loginDataErrors).length > 0)
            return;
        this.setProcessing(true);
        try {
            const response = await axios.post(this.state.loginUrl, this.state.loginData);
            if (!response.data.userRole) Functions.errorSwal('Invalid login response');
            Memory.setValue(USER_KEY, response.data);
            this.redirectToDash();
        } catch (e) {
        }
        this.setProcessing(false);
    }

    loginDataErrors = () => {
        const errors = {};
        const {loginData} = this.state;
        const options = {abortEarly: false};
        let validate = Joi.validate(loginData, this.loginValidateSchema, options);

        if (!validate.error) return errors;

        for (const detail of validate.error.details)
            errors[detail.path] = detail.message;
        return errors;
    }

    redirectToDash = () => {
        const path = dashRoutes[0].layout;
        this.props.history.push(path);
    }

    setProcessing = (processing) => {
        this.setState({processing: processing});
    }
}

export default Login;