import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import useSWR from 'swr';
import wrapper from '../store/configureStore';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);
  // const dispatch = useDispatch();

  const { data: followersData, error: followerError } = useSWR(`http://localhost:9000/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingError } = useSWR(`http://localhost:9000/user/followings?limit=${followingsLimit}`, fetcher);

  // useEffect(() => {
  //   dispatch({ type: LOAD_FOLLOWERS_REQUEST });
  //   dispatch({ type: LOAD_FOLLOWINGS_REQUEST });
  // }, []);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) return '내 정보 로딩중...';

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>팔로잉/팔로워 로딩 중 에러 발생</div>;
  }

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError} />
        <FollowList header="팔로워" data={followersData} onClickMore={loadMoreFollowers} loading={!followersData && !followerError} />
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
