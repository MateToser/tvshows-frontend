import React, { Component } from 'react';
import { signup, checkEmailAvailability } from '../../api/api';
import './Signup.css';
import { Link } from 'react-router-dom';
import {
    FIRSTNAME_MIN_LENGTH, FIRSTNAME_MAX_LENGTH,
    LASTNAME_MIN_LENGTH, LASTNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constant';

import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: {
                value: ''
            },
            lastName: {
                value: ''
            },
            email: {
                value: ''
            },
            password: {
                value: ''
            }
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const signupRequest = {
            firstName: this.state.firstName.value,
            lastName: this.state.lastName.value,
            email: this.state.email.value,
            password: this.state.password.value
        };
        signup(signupRequest)
        .then(response => {
            notification.success({
                message: 'TV Shows',
                description: "Thank you! You're successfully registered. Please Login to continue!",
            });
            this.props.history.push("/login");
        }).catch(error => {
            notification.error({
                message: 'TV Shows',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    isFormInvalid() {
        return !(this.state.firstName.validateStatus === 'success' &&
            this.state.lastName.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className="signup-container">
                <h1 className="page-title">Sign Up</h1>
                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem
                            validateStatus={this.state.firstName.validateStatus}
                            help={this.state.firstName.errorMsg}>
                            <Input
                                size="large"
                                name="firstName"
                                autoComplete="off"
                                placeholder="First name"
                                value={this.state.firstName.value}
                                onChange={(event) => this.handleInputChange(event, this.validateFirstName)} />
                        </FormItem>
                        <FormItem
                            validateStatus={this.state.lastName.validateStatus}
                            help={this.state.lastName.errorMsg}>
                            <Input
                                size="large"
                                name="lastName"
                                autoComplete="off"
                                placeholder="Last name"
                                value={this.state.lastName.value}
                                onChange={(event) => this.handleInputChange(event, this.validateLastName)} />
                        </FormItem>
                        <FormItem
                            hasFeedback
                            validateStatus={this.state.email.validateStatus}
                            help={this.state.email.errorMsg}>
                            <Input
                                size="large"
                                name="email"
                                type="email"
                                autoComplete="off"
                                placeholder="Email"
                                value={this.state.email.value}
                                onBlur={this.validateEmailAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateEmail)} />
                        </FormItem>
                        <FormItem
                            validateStatus={this.state.password.validateStatus}
                            help={this.state.password.errorMsg}>
                            <Input
                                size="large"
                                name="password"
                                type="password"
                                autoComplete="off"
                                placeholder="Password"
                                value={this.state.password.value}
                                onChange={(event) => this.handleInputChange(event, this.validatePassword)} />
                        </FormItem>
                        <FormItem>
                            <Button type="primary"
                                htmlType="submit"
                                size="large"
                                className="signup-form-button"
                                disabled={this.isFormInvalid()}>Sign up</Button>
                            Already registed? <Link to="/login">Login now!</Link>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    validateFirstName = (firstName) => {
        if(firstName.length < FIRSTNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `First name is too short (Minimum ${FIRSTNAME_MIN_LENGTH} characters needed.)`
            }
        } else if (firstName.length > FIRSTNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `First name is too long (Maximum ${FIRSTNAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };
        }
    }

    validateLastName = (lastName) => {
        if(lastName.length < LASTNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Last name is too short (Minimum ${LASTNAME_MIN_LENGTH} characters needed.)`
            }
        } else if (lastName.length > LASTNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Last name is too long (Maximum ${LASTNAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };
        }
    }

    validateEmail = (email) => {
        if(!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email may not be empty'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email not valid'
            }
        }

        if(email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateEmailAvailability() {
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if(emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'error',
                        errorMsg: 'This Email is already registered'
                    }
                });
            }
        }).catch(error => {
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validatePassword = (password) => {
        if(password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

}

export default Signup;
