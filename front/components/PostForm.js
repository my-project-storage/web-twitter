import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addPost } from '../reducers/post';
import useInput from '../hooks/useInput';

const PostForm = () => {
  const dispatch = useDispatch();
  const imageInput = useRef();
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const [text, onChangeText, setText] = useInput('');

  useEffect(() => {
    if (addPostDone) setText('');
  }, [addPostDone]);

  const onClickImageUpload = useCallback(
    (e) => {
      imageInput.current.click();
    },
    [imageInput.current]
  );
  const onSubmit = useCallback(() => {
    dispatch(addPost(text));
  }, [text]);
  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea value={text} onChange={onChangeText} maxLength={140} placeholder="적어라" />
      <div>
        <input type="file" multiple hidden ref={imageInput}></input>
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={v} style={{ width: '200px' }} alt={v}></img>
            <div>
              <Button>재거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
