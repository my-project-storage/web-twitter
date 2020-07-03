import { all, fork, delay, put, takeLatest } from 'redux-saga/effects';
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
} from '../reducers/user';

function loginAPI(data) {
  // api 호출
  return axios.post('/api/login', data);
}
function logOutAPI() {
  return axios.post('/api/logout');
}
function addPostAPI(data) {
  return axios.post('/api/posts', data);
}

function* login(action) {
  try {
    // const result = yield call(loginAPI, action.data);
    yield delay(1000);
    // pust은 dispatch
    yield put({
      type: LOG_IN_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data, // 요청에 실패하면 err.response.data 에 담겨있음
    });
  }
}
function* logout() {
  try {
    // const result = yield call(logOutAPI);
    yield delay(1000);
    yield put({
      type: LOG_OUT_SUCCESS,
      //   data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}
function* signUp() {
  try {
    yield delay(1000);
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
function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logout);
}
function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchLogOut), fork(watchSignUp)]);
}
