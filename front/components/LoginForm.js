import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import useInput from '../hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequestAction } from '../reducers/user';

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const { logInLoading } = useSelector((state) => state.user);

  const onSubmitForm = useCallback(() => {
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-id">이메일</label>
        <br></br>
        <Input name="user-id" type="email" value={email} onChange={onChangeEmail} required></Input>
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br></br>
        <Input.Password name="user-password" value={password} onChange={onChangePassword} required></Input.Password>
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={logInLoading}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;
