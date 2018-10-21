import React, { Component } from 'react';
import { getShowByTitle } from '../../api/api';
import { Card } from 'antd';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Show.css';
import NotFound from '../../common/NotFound';

const { Meta } = Card;

class Show extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: null,
            isLoading: false
        }
        this.loadShow = this.loadShow.bind(this);
    }

    loadShow(title) {
        this.setState({
            isLoading: true
        });

        getShowByTitle(title)
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
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    componentDidMount() {
        //const title = this.props.match.params.title;
        const title = "Mr Robot";
        this.loadShow(title);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.title !== nextProps.match.params.title) {
            this.loadShow(nextProps.match.params.title);
        }
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
                {
                    this.state.show ? (
                        <div className="show">
                            <div className="show-details">
                                <Card hoverable style={{ width: 240 }} cover={<img alt="example" src={this.state.show.posterUrl} />}>
                                  <Meta title={this.state.show.title} description={this.state.show.description}/>
                                </Card>
                            </div>
                        </div>
                    ): null
                }
            </div>
        );
    }
}

export default Show;
