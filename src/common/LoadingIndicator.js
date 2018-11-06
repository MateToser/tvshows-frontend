import React from 'react';
import { Spin, Icon } from 'antd';
import './LoadingIndicator.css';

export default function LoadingIndicator(props) {
    const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;
    return (
        <Spin className="loading" indicator={antIcon} style = {{display: 'block', textAlign: 'center', marginTop: 30}} />
    );
}
