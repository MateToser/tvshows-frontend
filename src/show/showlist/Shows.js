import React, { Component } from 'react';
import { getAllShow } from '../../api/api';
import { Card, Row, Col, BackTop } from 'antd';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Shows.css';
import NotFound from '../../common/NotFound';

const { Meta } = Card;

function ListShows(props) {
  const content = props.shows.map((show) =>
    <Row>
      <Col span={12} xs={24} sm={12} md={6} lg={6}>
          <Card key={show.id} hoverable cover={<img alt="" src={show.posterUrl} />}>
            <Meta title={show.title}/>
          </Card>
      </Col>
      <Col className="show-details-col" span={12} xs={24} sm={12} md={18} lg={18}>
        <div className="show-description">
          <p>{show.description}</p>
        </div>
        <div className="show-writer">
          <p>Writer: {show.writer}</p>
        </div>
        <div className="show-released">
          <p>Released: {show.released}</p>
        </div>
        <div className="show-seasons">
          <p>Seasons: {show.seasons}</p>
        </div>
        <div className="show-awards">
          <p>Awards: {show.awards}</p>
        </div>
        <div className="show-rating">
          <p>Imdb rating: <a href={"https://imdb.com/title/" +show.imdbId}>{show.imdbRating}/10</a> by {show.imdbVotes} votes</p>
        </div>
      </Col>
    </Row>
  );
  return (
    <div className="show-details">
        {content}
    </div>
  );
}

class Show extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shows: null,
            isLoading: false
        }
        this.loadShows = this.loadShows.bind(this);
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
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        })
    }

    componentDidMount() {;
        this.loadShows();
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        return (
          <div className="show">
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

export default Show;
