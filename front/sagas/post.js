import { all, fork, delay, put, takeLatest, throttle, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_FAILURE,
  REMOVE_POST_SUCCESS,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  RETWEET_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_FAILURE,
  LOAD_POST_SUCCESS,
  LOAD_USER_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`);
}
function addPostAPI(data) {
  return axios.post('/post', data);
}
function loadPostsAPI(lastId) {
  return axios.get(`/posts?lastId=${lastId || 0}`);
}
function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}
function loadHashtagPostsAPI(data, lastId) {
  return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
}
function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}
function removePostAPI(data) {
  return axios.delete(`/post/${data}`);
}
function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}
function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}
function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`);
}
function uploadImagesAPI(data) {
  return axios.post('/post/images', data);
}

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: RETWEET_FAILURE,
      error: err.resonse.data,
    });
  }
}
function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      error: err.resonse.data,
    });
  }
}
function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.lastId);
    // console.log('saga:', result.data);

    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.resonse.data,
    });
  }
}
function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);
    // console.log('saga:', result.data);

    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error('여기 에러있습니다.', err);

    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.resonse.data,
    });
  }
}
function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);

    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: err.resonse.data,
    });
  }
}
function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_POST_FAILURE,
      error: err.resonse.data,
    });
  }
}
function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.resonse.data,
    });
  }
}
function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.resonse.data,
    });
  }
}
function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.resonse.data,
    });
  }
}
function* unLikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.resonse.data,
    });
  }
}
function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.resonse.data,
    });
  }
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}
function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}
function* watchLoadPosts() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}
function* watchLoadUserPosts() {
  yield throttle(5000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}
function* watchLoadHashtagPosts() {
  yield throttle(5000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}
function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}
function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}
function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}
function* watchUnLikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unLikePost);
}
function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

export default function* postSaga() {
  yield all([
    fork(watchRetweet),
    fork(watchAddPost),
    fork(watchUploadImages),
    fork(watchLoadPosts),
    fork(watchLoadPost),
    fork(watchLoadUserPosts),
    fork(watchLoadHashtagPosts),
    fork(watchRemovePost),
    fork(watchAddComment),
    fork(watchLikePost),
    fork(watchUnLikePost),
  ]);
}
