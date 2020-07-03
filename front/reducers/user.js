export const initialState = {
  isLoggingIn: false, // 로그인 시도중
  isLoggedIn: false,
  isLoggingOut: false, // 로그아웃 시도중
  me: null,
  signUpData: {},
  loginData: {},
};

// ? 리덕스 thunk 를 쓰면 비동기 크리에이터액션을 추가할 수 있다
// ? 한 번에 여러 개의 디스패치를 할 수 있다

// ? saga 에선 딜레이를 제공한다
// ? 실수로 두 번 눌렀을 때 가장 마지막 요청만 보내도록 한다
// ? 쓰로틀 같은 경우, 1초에 몇 번 까지 허용해주는 기능을 쓸 수 있음

// ! action 생성 함수
export const loginRequestAction = (data) => {
  return {
    type: 'LOG_IN_REQUEST',
    data,
  };
};
export const logoutRequestAction = () => {
  return {
    type: 'LOG_OUT_REQUEST',
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOG_IN_REQUEST':
      return {
        ...state,
        isLoggingIn: true,
        me: action.data,
      };
    case 'LOG_IN_SUCCESS':
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        me: { ...action.data, nickname: 'bbak' },
      };
    case 'LOG_IN_FAILURE':
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
      };
    case 'LOG_OUT_REQUEST':
      return {
        ...state,
        isLoggingOut: true,
      };
    case 'LOG_OUT_SUCCESS':
      return {
        ...state,
        isLoggingOut: false,
        isLoggedIn: false,
        me: null,
      };
    case 'LOG_OUT_FAILURE':
      return {
        ...state,
        isLoggingOut: false,
      };
    default:
      return state;
  }
};

export default reducer;
