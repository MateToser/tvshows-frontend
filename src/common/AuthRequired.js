import React, { Component } from 'react';
import './AuthRequired.css';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

class AuthRequired extends Component {
    render() {
        return (
            <div className="auth-required">
                <h1 className="title">
                    401
                </h1>
                <div className="desc">
                    "The Page you're looking for needs authentication."
                </div>
                <Link to="/login"><Button className="login-btn" type="primary" size="large">Log in!</Button></Link>
            </div>
        );
    }
}

export default AuthRequired;
