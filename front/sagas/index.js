import axios from 'axios';
// effects 앞에는 항상 yield를 붙여야함
import { all, fork, take, call, put, takeEvery, takeLatest, takeLeading, throttle, delay, debounce } from 'redux-saga/effects';

/**
 * @description saga를 사용하는 방법
 * todo: 루트 사가 만들기
 * todo: 만들고 싶은 비동기 액션을 넣어줌
 * @effect
 *  ? call : 동기적으로 함수를 호출
 *  ? fork : 비동기적으로 함수를 호출(Non-blocking)
 *  ? put : dispatch
 *  ? take : 마치 이벤트 리스너처럼 실행되지만 일회용으로 실행
 *  ? takeEvery : take의 일회성을 모두 사용할 수 있게 해줌
 *  ? takeLatest : 사용자가 실수로 클릭을 두 번 했을 때 마지막 이벤트에 반응, 응답을 취소하는거라 요청은 여러 번 보냄
 *  ? takeLeading : 첫 번째 이벤트에만 반응
 *  ? throttle : 타임을 정해서 그 안에 요청을 한 번만 보내도록 제한함. 보통 스크롤 동작 시 사용. 즉, 마지막 함수가 호출된 후 일정 시간이 지나기 전에 다시 호출되지 않도록 하는 것
 *  ? debounce : 연이어 호출되는 함수들 중 마지막 함수(또는 가장 처음)만 호출하도록 하는 것
 */

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
      data: result.data,
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
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'LOG_OUT_FAILURE',
      data: err.response.data,
    });
  }
}
function* addPost(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    yield delay(1000);
    yield put({
      type: 'ADD_POST_SUCCESS',
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'ADD_POST_FAILURE',
      data: err.resonse.data,
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
function* watchAddPost() {
  yield takeLatest('ADD_POST_REQUEST', addPost);
}
export default function* rootSaga() {
  // all 은 배열을 받음, 동시에 실행할 수 있도록 해줌
  yield all([fork(watchLogin), fork(watchLogOut), fork(watchAddPost)]);
}
