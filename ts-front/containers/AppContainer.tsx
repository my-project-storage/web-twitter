import React from 'react';
import Link from 'next/link';
import { Menu } from 'antd';

const AppContainer: React.FC = ({ children }) => {
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>빡위터</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      {children}
    </div>
  );
};

export default AppContainer;
