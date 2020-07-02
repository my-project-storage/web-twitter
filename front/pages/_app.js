import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';
import wrapper from '../store/configureStore';

// 공통 파일
const Root = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>NodeBird</title>
      </Head>
      <Component></Component>
    </>
  );
};

Root.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(Root);
