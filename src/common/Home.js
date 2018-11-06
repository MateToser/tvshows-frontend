import React, { Component } from 'react';
import { Carousel, Steps, Popover, Icon, Row, Col, Progress, Collapse } from 'antd';
import './Home.css';

const Step = Steps.Step;
const Panel = Collapse.Panel;

const customDot = (dot, { status, index }) => (
  <Popover content={<span>Episode {index}'s status: {status}</span>}>
    {dot}
  </Popover>
);

class Home extends Component {
    constructor() {
      super();
    }

    render() {
        return (
            <div className="home-page">
              <h1 className="home-header">Home page</h1>
              <Carousel autoplay>
                <div><h3>1</h3></div>
                <div><h3>2</h3></div>
                <div><h3>3</h3></div>
                <div><h3>4</h3></div>
              </Carousel>
              <div>
              <h2>Track your favourite TV Shows</h2>
              <Collapse bordered={false} defaultActiveKey={['2']}>
                <Panel header="Season 1" key="1">
                  <Col xs={24} sm={6} md={6} lg={6}>
                    <h1>Season 1</h1>
                  </Col>
                  <Col xs={24} sm={14} md={14} lg={14}>
                    <Steps className="season-steps" initial={1} direction="vertical" size="small" current={8}>
                      <Step title="Episode 1" description="2017-02-01" icon={<Icon type="check-circle" />} />
                      <Step title="Episode 2" description="2017-02-08" icon={<Icon type="check-circle" />}/>
                      <Step title="Episode 3" description="2017-02-15" icon={<Icon type="check-circle" />}/>
                      <Step title="Episode 4" description="2017-02-22" icon={<Icon type="check-circle" />} />
                      <Step title="Episode 5" description="2017-03-01" icon={<Icon type="check-circle" />}/>
                      <Step title="Episode 6" description="2017-03-08" icon={<Icon type="check-circle" />}/>
                      <Step title="Episode 7" description="2017-03-15" icon={<Icon type="check-circle" />} />
                      <Step title="Episode 8" description="2017-03-22" icon={<Icon type="check-circle" />}/>
                    </Steps>
                  </Col>
                  <Col xs={24} sm={4} md={4} lg={4}>
                    <Progress type="circle" percent={100} width={100}/>
                  </Col>
                </Panel>
                <Panel header="Season 2" key="2">
                <Col xs={24} sm={6} md={6} lg={6}>
                <h1>Season 2</h1>
                </Col>
                <Col xs={24} sm={14} md={14} lg={14}>
                  <Steps className="season-steps" initial={1} direction="vertical" size="small" current={2}>
                    <Step title="Episode 1" description="2018-02-01" icon={<Icon type="check-circle" />} />
                    <Step title="Episode 2" description="2018-02-08" icon={<Icon type="clock-circle" />}/>
                    <Step title="Episode 3" description="2018-02-15" icon={<Icon type="clock-circle" />}/>
                  </Steps>
                </Col>
                <Col xs={24} sm={4} md={4} lg={4}>
                  <Progress type="circle" percent={33} width={100}/>
                </Col>
                </Panel>
                </Collapse>
              </div>
            </div>
        );
    }
}


export default Home;
