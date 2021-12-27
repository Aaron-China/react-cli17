import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

// 一个加载状态组件
const CLoading = ({ 
  visible = false    // 是否显示
}) => {
  return visible ? (<div className="c-loading" ></div>) : ''
}

CLoading.propTypes = {
  visible: PropTypes.bool,
}

export default CLoading;
