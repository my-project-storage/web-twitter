import React, { useEffect } from 'react';
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import wrapper from '../store/configureStore';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: LOAD_FOLLOWERS_REQUEST });
    dispatch({ type: LOAD_FOLLOWINGS_REQUEST });
  }, []);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me]);
  if (!me) return null;
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={me.Followings} />
        <FollowList header="팔로워" data={me.Followers} />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // ! ----------------서버에서 서버로 쿠키 보내기------------------
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = ''; // 일단 쿠키를 비워주고나서
  if (context.req && cookie) axios.defaults.headers.Cookie = cookie; // 있다면 새로 넣어줌
  // ! -----------------------------------------------------------

  context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });

  // saga를 ssr 로 이용하기 위한 기본 셋팅
  context.store.dispatch(END); // 디스패치의 success를 기다려줌
  await context.store.sagaTask.toPromise(); // store index에 등록되어있음

  // 실행된 결과를 HYDRATE 가 받아줌
});

export default Profile;
