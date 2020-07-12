import React from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { END } from 'redux-saga';

import { Avatar, Card } from 'antd';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_USER_REQUEST } from '../reducers/user';

const About = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <AppLayout>
      <Head>
        <title>About | Bbakwitter</title>
      </Head>
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts.length}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Followings.length}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers.length}
            </div>,
          ]}
        >
          <Card.Meta avatar={<Avatar>{userInfo.nickname[0]}</Avatar>} title={userInfo.nickname} description="Bbak!!!" />
        </Card>
      ) : null}
    </AppLayout>
  );
};

export const getStaticProps = wrapper.getStaticProps(async (ctx) => {
  ctx.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: 1,
  });
  ctx.store.dispatch(END);
  await ctx.store.sagaTask.toPromise();
});

export default About;
