import React, { Component } from 'react';
import { getShowById, likeShow, addComment, trackEpisode, trackSeason } from '../../api/api';
import { Card, Row, Col, BackTop, Icon, Tag, Input, Button, List, Steps, Popover, Progress, Collapse, Divider } from 'antd';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Show.css';
import NotFound from '../../common/NotFound';
import AuthRequired from '../../common/AuthRequired';
import ServerError from '../../common/ServerError';
import Moment from 'react-moment';

const { TextArea } = Input;
const { Meta } = Card;

const Step = Steps.Step;
const Panel = Collapse.Panel;

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
            <p>Seasons: {props.show.show.totalSeasons}</p>
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
      <Row className="add-comment-row">
        <div>
            <h1>Add a comment <Button className="add-comment-button" type="primary" icon="message" size={'large'} onClick={AddComment.bind(this, props.show.show.id)}> Send</Button></h1>
            <TextArea id="comment-text" />
        </div>
      </Row>
      <Row className="comment-row">
        <div>
          <List
            locale={{ emptyText: "No comments yet." }}
            itemLayout="horizontal"
            dataSource={props.show.comments}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.user.firstName + " " + item.user.lastName + " " + item.date}
                  description={item.message}
                />
              </List.Item>
            )}
          />
        </div>
      </Row>
    </div>
  );
}

function DisplaySeasons(props) {
  const seasons = props.show.seasons.map((season) =>
  season.episodes.length !== 0 ?
    <Panel header={"Season " + season.season.season} key={season.season.season}>
      <Col xs={24} sm={6} md={6} lg={6}>
      <h1>Season {season.season.season}</h1>
      <Button onClick={TrackSeason.bind(this, season.season.id)}>Track the whole season</Button>
      </Col>
      <Col xs={24} sm={14} md={14} lg={14}>
      {
        season.episodes.map((episode) =>
            <Row>
            {
              episode.isWatched ?
              <div>
              <Col  xs={4} sm={2} md={2} lg={2}><Icon style={{ fontSize: '32px', color: '#1890ff' }} type="check-circle" /></Col>
              <Button onClick={TrackEpisode.bind(this, episode.episode.id)}>Untrack</Button>
              </div>
              :
              <div>
              <Col  xs={4} sm={2} md={2} lg={2}><Icon style={{ fontSize: '32px', color: '#bfbfbf' }} type="clock-circle" /></Col>
              <Button onClick={TrackEpisode.bind(this, episode.episode.id)}>Track</Button>
              </div>
            }
              <Col  xs={20} sm={22} md={22} lg={22}>
                <h3>{episode.episode.title}</h3>
                <p>{episode.episode.released}</p>
              </Col>
              <Divider style={{ width: '80%'}}/>
            </Row>
          )
      }
    </Col>
    <Col xs={24} sm={4} md={4} lg={4}>
      <Progress type="circle" percent={season.percent} width={100}/>
    </Col>
    </Panel>
    : null
  );
  return (
    <div className="show-episodes">
      <Collapse bordered={false}>
      {seasons}
      </Collapse>
    </div>
  );
}

function AddComment(showId){
  addComment(showId, document.getElementById("comment-text").value);
  window.location.reload();
}

function LikeShow(id){
  likeShow(id);
  window.location.reload();
}

function TrackEpisode(episodeId){
  trackEpisode(episodeId);
  window.location.reload();
}

function TrackSeason(seasonId){
  trackSeason(seasonId);
  window.location.reload();
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
            {
                this.state.show ? (
                  <DisplaySeasons show={this.state.show}/>
                ): null
            }
          </div>
        );
    }
}

export default Show;
