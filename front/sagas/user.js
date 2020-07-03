import { all, fork, delay, put, takeLatest } from 'redux-saga/effects';

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
      type: 'LOG_IN_SUCCESS',
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: 'LOG_IN_FAILURE',
      data: err.response.data, // 요청에 실패하면 err.response.data 에 담겨있음
    });
  }
}
function* logout() {
  try {
    // const result = yield call(logOutAPI);
    yield delay(1000);
    yield put({
      type: 'LOG_OUT_SUCCESS',
      //   data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'LOG_OUT_FAILURE',
      data: err.response.data,
    });
  }
}

function* watchLogin() {
  // take 는 액션이 실행될 때 까지 기다림
  yield takeLatest('LOG_IN_REQUEST', login);
}
function* watchLogOut() {
  yield takeLatest('LOG_OUT_REQUEST', logout);
}

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchLogOut)]);
}
