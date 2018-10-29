import React, { Component } from 'react';
import { getShowById, likeShow } from '../../api/api';
import { Card, Row, Col, BackTop, Icon, Tag } from 'antd';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Show.css';
import NotFound from '../../common/NotFound';
import AuthRequired from '../../common/AuthRequired';
import ServerError from '../../common/ServerError';

const { Meta } = Card;

function DisplayShow(props) {
  const categories = props.show.show.categories.map((category) =>
  <Tag color="blue">{category.type}</Tag>
  );
  return (
    <div className="show-details">
      <Row className="show-row">
        <Col span={12} xs={24} sm={12} md={6} lg={6}>
            <Card
            hoverable cover={<img alt="" src={props.show.show.posterUrl} />}
            actions={[<div>{props.show.isLiked ? <span className="show-dislike" onClick={LikeShow.bind(this, props.show.show.id)}><Icon type="dislike"/> Dislike</span>
                                         : <span className="show-like" onClick={LikeShow.bind(this, props.show.show.id)}><Icon type="like"/> Like</span>}</div>]}>
              <Meta title={props.show.show.title}/>
            </Card>
        </Col>
        <Col className="show-details-col" span={12} xs={24} sm={12} md={18} lg={18}>
          <div className="show-description">
            <p>{props.show.show.description}</p>
          </div>
          <div className="show-writer">
            <p>Writer: {props.show.show.writer}</p>
          </div>
          <div className="show-released">
            <p>Released: {props.show.show.released}</p>
          </div>
          <div className="show-seasons">
            <p>Seasons: {props.show.show.seasons}</p>
          </div>
          <div className="show-awards">
            <p>Awards: {props.show.show.awards}</p>
          </div>
          <div className="show-rating">
            <p>Imdb rating: <a href={"https://imdb.com/title/" +props.show.show.imdbId}>{props.show.show.imdbRating}/10</a> by {props.show.show.imdbVotes} votes</p>
          </div>
          <div className="show-categories">
              {categories}
          </div>
        </Col>
      </Row>
    </div>
  );
}

function LikeShow(id){
  likeShow(id);
  //window.location.reload();
  this.state.show.isLiked = false;
}

class Show extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: null,
            isLoading: false
        }
        this.loadShow = this.loadShow.bind(this);
    }

    loadShow(id) {
        this.setState({
            isLoading: true
        });

        getShowById(id)
        .then(response => {
            this.setState({
                show: response,
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
        this.loadShow(this.props.match.params.id);
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
            <BackTop/>
            {
                this.state.show ? (
                  <DisplayShow show={this.state.show}/>
                ): null
            }
          </div>
        );
    }
}

export default Show;
