export const initialState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: '빡',
      },
      content: '하이루 #해시태그',
      Images: [
        {
          src:
            'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2F5FVJy%2FbtqudtFLZeO%2FKNpY4Y1RtFpFFqbF3YvJKk%2Fimg.png',
        },
        {
          src:
            'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2F5FVJy%2FbtqudtFLZeO%2FKNpY4Y1RtFpFFqbF3YvJKk%2Fimg.png',
        },
        {
          src:
            'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2F5FVJy%2FbtqudtFLZeO%2FKNpY4Y1RtFpFFqbF3YvJKk%2Fimg.png',
        },
      ],
      Comments: [
        {
          User: {
            nickname: 'nero',
          },
          content: 'ㅎㅇㄹ',
        },
        {
          User: {
            nickname: '빡',
          },
          content: 'ㅎㅇㄹ2',
        },
      ],
    },
  ],
  imagePaths: [],
  postAdded: false,
};

const ADD_POST = 'ADD_POST';
export const addPost = {
  type: ADD_POST,
};
const dummyPost = {
  id: 2,
  content: '더미데이터',
  User: {
    id: 1,
    nickname: '빡',
  },
  Images: [],
  Conments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts],
      };
    default:
      return state;
  }
};

export default reducer;
