import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  // // todo: 새로고침 시 로그인 상태였다면 유저 정보 받아오기
  // // todo: post들 가져오기
  // useEffect(() => {
  //   dispatch({ type: LOAD_USER_REQUEST });
  //   dispatch({
  //     type: LOAD_POSTS_REQUEST,
  //   });
  // }, []);
  useEffect(() => {
    function onScroll() {
      // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, mainPosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

// home 보다 먼저 실행됨
// 프론트 서버에서 실행됨
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // ! ----------------서버에서 서버로 쿠키 보내기------------------
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = ''; // 일단 쿠키를 비워주고나서
  if (context.req && cookie) axios.defaults.headers.Cookie = cookie; // 있다면 새로 넣어줌
  // ! -----------------------------------------------------------

  context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
  context.store.dispatch({ type: LOAD_POSTS_REQUEST });

  // saga를 ssr 로 이용하기 위한 기본 셋팅
  context.store.dispatch(END); // 디스패치의 success를 기다려줌
  await context.store.sagaTask.toPromise(); // store index에 등록되어있음

  // 실행된 결과를 HYDRATE 가 받아줌
});

export default Home;
