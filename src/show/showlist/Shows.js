import React, { Component } from 'react';
import { getAllShow } from '../../api/api';
import { Card, Row, Col } from 'antd';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Shows.css';
import NotFound from '../../common/NotFound';

const { Meta } = Card;

function ListShows(props) {
  const content = props.shows.map((show) =>
    <Col span={8}>
        <Card key={show.id} hoverable style={{ width: 240 }} cover={<img alt="" src={show.posterUrl} />}>
          <Meta title={show.title} description={show.description}/>
        </Card>
    </Col>
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
          <Row>
          {
              this.state.shows ? (
                <ListShows shows={this.state.shows}/>
              ): null
          }
          </Row>
          </div>
        );
    }
}

export default Show;
