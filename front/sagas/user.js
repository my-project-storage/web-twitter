import axios from 'axios';
import { all, fork, delay, put, takeLatest, call } from 'redux-saga/effects';
import {
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_IN_REQUEST,
  LOG_OUT_REQUEST,
  SIGN_UP_REQUEST,
  SIGN_UP_FAILURE,
  SIGN_UP_SUCCESS,
  FOLLOW_REQUEST,
  UNFOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
} from '../reducers/user';

function loginAPI(data) {
  // api 호출
  return axios.post('/user/login', data);
}
function followAPI(data) {
  // api 호출
  return axios.post('/follow', data);
}
function unfollowAPI(data) {
  // api 호출
  return axios.post('/unfollow', data);
}
function signUpAPI(data) {
  // api 호출
  return axios.post('/user', data);
}
function logOutAPI() {
  return axios.post('/user/logout');
}
function addPostAPI(data) {
  return axios.post('/posts', data);
}

function* login(action) {
  try {
    const result = yield call(loginAPI, action.data);
    // pust은 dispatch
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data, // 요청에 실패하면 err.response.data 에 담겨있음
    });
  }
}
function* follow(action) {
  try {
    yield delay(1000);
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data, // 요청에 실패하면 err.response.data 에 담겨있음
    });
  }
}
function* unfollow(action) {
  try {
    yield delay(1000);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data, // 요청에 실패하면 err.response.data 에 담겨있음
    });
  }
}
function* logout() {
  try {
    const result = yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}
function* signUp(action) {
  try {
    // yield delay(1000);
    const result = yield call(signUpAPI, action.data);
    console.log(result);

    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLogin() {
  // take 는 액션이 실행될 때 까지 기다림
  yield takeLatest(LOG_IN_REQUEST, login);
}
function* watchFollow() {
  // take 는 액션이 실행될 때 까지 기다림
  yield takeLatest(FOLLOW_REQUEST, follow);
}
function* watchUnfollow() {
  // take 는 액션이 실행될 때 까지 기다림
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}
function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logout);
}
function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchFollow), fork(watchUnfollow), fork(watchLogOut), fork(watchSignUp)]);
}
