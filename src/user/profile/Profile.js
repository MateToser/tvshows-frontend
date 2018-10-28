import React, { Component } from 'react';
import { getUserProfile } from '../../api/api';
import { Avatar } from 'antd';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import AuthRequired from '../../common/AuthRequired';


function LikedShows(props){
  const content = props.shows.map((show) =>
      <li>{show.title}</li>
  );
  return (
    <div className="user-shows">
    <h1>Liked shows:</h1>
    <ul>
        {content}
    </ul>
    </div>
  );

}

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(id) {
        this.setState({
            isLoading: true
        });

        getUserProfile(id)
        .then(response => {
            this.setState({
                user: response,
                isLoading: false
            });
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else if(error.status === 401) {
                this.setState({
                    authRequired: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.loadUserProfile(id);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.id !== nextProps.match.params.id) {
            this.loadUserProfile(nextProps.match.params.id);
        }
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.authRequired) {
            return <AuthRequired />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        return (
            <div className="profile">
                {
                    this.state.user ? (
                        <div className="user-profile">
                            <div className="user-details">
                                <div className="user-avatar">
                                    <Avatar className="user-avatar-circle">
                                        {this.state.user.firstName[0].toUpperCase()}
                                    </Avatar>
                                </div>
                                <div className="user-summary">
                                    <div className="full-name">{this.state.user.firstName + " " + this.state.user.lastName}</div>
                                    <div className="username">{this.state.user.email}</div>
                                </div>
                            </div>
                            <LikedShows shows={this.state.user.shows}/>
                        </div>
                    ): null
                }
            </div>
        );
    }
}

export default Profile;
