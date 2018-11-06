import React, { Component } from 'react';
import { getOrderedShows, getAllShow, likeShow, searchShows } from '../../api/api';
import { Card, Row, Col, BackTop, Icon, Divider, Input } from 'antd';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Shows.css';
import NotFound from '../../common/NotFound';
import AuthRequired from '../../common/AuthRequired';
import ServerError from '../../common/ServerError';
import { Link } from 'react-router-dom';

const { Meta } = Card;
const Search = Input.Search;

function ListShows(props) {
  const content = props.shows.map((show) =>
  <div key={show.show.id}>
    <Row className="show-row">
      <Col span={12} xs={24} sm={12} md={6} lg={6}>
          <Card
          hoverable cover={<img alt="" src={show.show.posterUrl} />}
          actions={[<div>{show.isLiked ? <span className="show-dislike" onClick={LikeShow.bind(this, show.show.id)}><Icon type="dislike"/> Dislike</span>
                                       : <span className="show-like" onClick={LikeShow.bind(this, show.show.id)}><Icon type="like"/> Like</span>}</div>,
                                       <Link to={"/show/id/" + show.show.id}><span className="show-more"><Icon type="info-circle"/> More</span></Link>]}>
            <Meta title={show.show.title}/>
          </Card>
      </Col>
      <Col className="show-details-col" span={12} xs={24} sm={12} md={18} lg={18}>
        <div className="show-description">
          <p>{show.show.description}</p>
        </div>
        <div className="show-writer">
          <p>Writer: {show.show.writer}</p>
        </div>
        <div className="show-released">
          <p>Released: {show.show.released}</p>
        </div>
        <div className="show-seasons">
          <p>Seasons: {show.show.totalSeasons}</p>
        </div>
        <div className="show-awards">
          <p>Awards: {show.show.awards}</p>
        </div>
        <div className="show-rating">
          <p>Imdb rating: <a href={"https://imdb.com/title/" +show.show.imdbId}>{show.show.imdbRating}/10</a> by {show.show.imdbVotes} votes</p>
        </div>
      </Col>
    </Row>
    <Divider />
    </div>
  );
  return (
    <div className="show-details">
        {content}
    </div>
  );
}

function LikeShow(id){
  likeShow(id);
  window.location.reload();
}

function onSelect(value) {
  console.log('onSelect', value);
}

class Shows extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shows: null,
            search: [],
            isLoading: false
        }
        this.loadShows = this.loadShows.bind(this);
    }

    search(title){
      if(title){
          searchShows(title)
          .then(response => {
              this.setState({
                  search: response
              });
              window.location.href = '/show/id/' + this.state.search[0].showId;
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
      }


    loadShows() {
        this.setState({
            isLoading: true
        });

        getAllShow()
        .then(response => {
            this.setState({
                shows: response,
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
        })
    }

    componentDidMount() {
        this.loadShows();
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
          <div className="show">
            <div className="search-box">
              <Search
                className="search-show"
                placeholder="Search by title"
                onSearch={title => this.search(title)}
              />
            </div>
            <BackTop/>
              {
                  this.state.shows ? (
                    <ListShows shows={this.state.shows}/>
                  ): null
              }
          </div>
        );
    }
}

export default Shows;
