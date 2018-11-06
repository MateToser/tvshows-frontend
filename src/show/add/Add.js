import React, { Component } from 'react';
import { Icon, Input } from 'antd';
import './Add.css';
import { addShowByTitle } from '../../api/api';
import LoadingIndicator  from '../../common/LoadingIndicator';
import NotFound from '../../common/NotFound';
import AuthRequired from '../../common/AuthRequired';
import ServerError from '../../common/ServerError';

const Search = Input.Search;

class Add extends Component {
  constructor(props) {
      super(props);
      this.state = {
          showId: null,
          isLoading: false
      }
      this.addShow = this.addShow.bind(this);
  }

  addShow(title) {
      this.setState({
          isLoading: true
      });

      addShowByTitle(title)
      .then(response => {
          this.setState({
              showId: response,
              isLoading: false
          });
          window.location.href = '/show/id/' + this.state.showId;
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
      })
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
            <div className="add-page">
              <h1>Add a TV Show</h1>
              <Search
                className="add-input"
                placeholder="Enter the title"
                enterButton={<Icon type="plus" className="nav-icon" />}
                size="large"
                onSearch={value => this.addShow(value)}
              />
            </div>
        );
    }
}


export default Add;
