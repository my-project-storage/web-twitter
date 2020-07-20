// ! 페이지 공통 파일
import React from 'react';
import { NextComponentType } from 'next';
import { AppContext, AppProps, AppInitialProps } from 'next/app';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';

const App: NextComponentType<AppContext, AppInitialProps, AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Layout className="layout">
        <Layout.Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Layout.Header>
        <Layout.Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-content">
            <Component {...pageProps} />
          </div>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Layout.Footer>
      </Layout>
    </>
  );
};

App.getInitialProps = async ({ Component, ctx }: AppContext): Promise<AppInitialProps> => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};

export default App;
