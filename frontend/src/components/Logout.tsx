import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token'); // トークンを削除
    navigate('/'); // ログイン画面にリダイレクト
  }, [navigate]);

  return <p>ログアウト中...</p>;
};

export default Logout;