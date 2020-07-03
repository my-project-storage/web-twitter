export const initialState = {
  isLoggedIn: false,
  me: null,
  signUpData: {},
  loginData: {},
};

// ? 리덕스 thunk 를 쓰면 비동기 크리에이터액션을 추가할 수 있다
// ? 한 번에 여러 개의 디스패치를 할 수 있다

// ? saga 에선 딜레이를 제공한다
// ? 실수로 두 번 눌렀을 때 가장 마지막 요청만 보내도록 한다
// ? 쓰로틀 같은 경우, 1초에 몇 번 까지 허용해주는 기능을 쓸 수 있음
export const loginAction = (data) => {
  return (dispatch, getState) => {
    const state = getState(); // initialState가 나올것임
    dispatch(loginRequestAction());
    axios
      .post('/api/login')
      .then((res) => {
        dispatch(loginSuccessAction(res.data));
      })
      .catch((err) => {
        dispatch(loginFailureAction(err));
      });
  };
};

// ! action 생성 함수
export const loginRequestAction = (data) => {
  return {
    type: 'LOG_IN',
    data,
  };
};
export const loginSuccessAction = (data) => {
  return {
    type: 'LOG_IN_SUCCESS',
    data,
  };
};
export const loginFailureAction = (data) => {
  return {
    type: 'LOG_IN_FAILURE',
    data,
  };
};
export const logoutRequestAction = () => {
  return {
    type: 'LOG_OUT',
  };
};
export const logoutSuccessAction = () => {
  return {
    type: 'LOG_OUT_SUCCESS',
  };
};
export const logoutFailureAction = () => {
  return {
    type: 'LOG_OUT_FAILURE',
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...state,
        isLoggedIn: true,
        me: action.data,
      };
    case 'LOG_OUT':
      return {
        ...state,
        isLoggedIn: false,
        me: null,
      };
    default:
      return state;
  }
};

export default reducer;
