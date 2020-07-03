import { all, fork, delay, put, takeLatest } from 'redux-saga/effects';

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

function* watchAddPost() {
  yield takeLatest('ADD_POST_REQUEST', addPost);
}

export default function* postSaga() {
  yield all([fork(watchAddPost)]);
}
