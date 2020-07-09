import axios from 'axios';
// effects 앞에는 항상 yield를 붙여야함
import { all, fork } from 'redux-saga/effects';

import postSaga from './post';
import userSaga from './user';

// axios 공통
axios.defaults.baseURL = 'http://localhost:9000';
axios.defaults.withCredentials = true;

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

export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}
