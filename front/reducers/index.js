import { HYDRATE } from 'next-redux-wrapper';
import { bindActionCreators, combineReducers } from 'redux';
import user from './user';
import post from './post';

const initialState = {
  user: {},
  post: {},
};

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

// ! SSR 이전 코드
// const rootReducer = combineReducers({
//   // ssr 를 위해 넣어줌
//   index: (state = initialState, action) => {
//     switch (action.type) {
//       case HYDRATE:
//         return { ...state, ...action.payload };

//       default:
//         return state;
//     }
//   },
//   user,
//   post,
// });

export default rootReducer;
