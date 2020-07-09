import React, { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import useInput from '../hooks/useInput';
import { SIGN_UP_REQUEST, SIGN_UP_INITIAL } from '../reducers/user';
import AppLayout from '../components/AppLayout';

const ErrorMessage = styled.div`
  color: red;
`;

const SignUp = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);

  useEffect(() => {
    if (me && me.id) {
      Router.replace('/'); // 뒤로가기 기록이 사라짐
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signUpDone) {
      Router.replace('/');
      dispatch({
        type: SIGN_UP_INITIAL,
      });
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [nick, onChangeNick] = useInput('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [term, setTerm] = useState('');
  const [termError, setTermError] = useState(false);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      console.log(e.target.value);
      console.log(password);

      setPasswordError(e.target.value !== password);
    },
    [password]
  );
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);
  const onsubmit = useCallback(() => {
    if (password !== passwordCheck) return setPasswordError(true);
    if (!term) return setTermError(true);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nick },
    });
  }, [email, password, passwordCheck, term]);
  return (
    <AppLayout>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <Form onFinish={onsubmit}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <Input name="user-email" type="email" value={email} required onChange={onChangeEmail} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input name="user-nick" value={nick} required onChange={onChangeNick} />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호체크</label>
          <br />
          <Input name="user-password-check" type="password" value={passwordCheck} required onChange={onChangePasswordCheck} />
        </div>
        <div>{passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}</div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            약관 동의 합니다.
          </Checkbox>
          {termError && <ErrorMessage>약관 동의가 필요합니다.</ErrorMessage>}
        </div>
        <div>
          <div style={{ marginTop: 10 }}>
            <Button type="primary" loading={signUpLoading} htmlType="submit">
              가입하기
            </Button>
          </div>
        </div>
      </Form>
    </AppLayout>
  );
};

export default SignUp;
