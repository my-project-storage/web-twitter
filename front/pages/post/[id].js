// next의 context 에서 useRouter 의 query id 를 context.query.id or params.id 로 가져와 쓸 수 있음
import React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';

const Post = () => {
  const router = useRouter();
  const { id } = router.query; // 동적으로 id 를 받아옴 -> post/[id].js
  const { singlePost } = useSelector((state) => state.post);

  return (
    <AppLayout>
      <Head>
        <title>{singlePost.User.nickname}님의 Bbakwitter</title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.content}님의 `} />
        <meta property="og:description" content={singlePost.content} />
        <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://bbakwitter.com/favicon.ico'} />
        <meta property="og:url" content={`https://bbaktwitter.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
  try {
    const cookie = ctx.req ? ctx.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (ctx.req && cookie) axios.defaults.headers.Cookie = cookie;
    ctx.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    ctx.store.dispatch({
      type: LOAD_POST_REQUEST,
      data: ctx.params.id,
    });
    ctx.store.dispatch(END);
    await ctx.store.sagaTask.toPromise();
  } catch (err) {
    console.error(err);
  }
});

export default Post;
