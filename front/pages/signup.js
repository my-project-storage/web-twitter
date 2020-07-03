import React, { useCallback, useState } from 'react';
import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { SIGN_UP_REQUEST } from '../reducers/user';
import AppLayout from '../components/AppLayout';

const ErrorMessage = styled.div`
  color: red;
`;

const SignUp = () => {
  const dispatch = useDispatch();
  const { signUpLoading } = useSelector((state) => state.post);

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
    console.log(email, nick, password);
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
            <Button type="primary" htmlType="submit" loading={signUpLoading}>
              가입하기
            </Button>
          </div>
        </div>
      </Form>
    </AppLayout>
  );
};

export default SignUp;
