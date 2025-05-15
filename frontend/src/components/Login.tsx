import React, { useEffect, useState } from 'react';
import { login } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      localStorage.setItem('token', response.token); // トークンを保存
      alert('ログインに成功しました！');
      navigate('/dashboard'); // ダッシュボードにリダイレクト
    } catch (err) {
      setError('ログインに失敗しました。メールアドレスまたはパスワードを確認してください。');
    }
  };

    // トークンが存在しない、または期限切れの場合はログイン画面にリダイレクト
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      navigate('/dashboard');
    } else {
      localStorage.removeItem('token'); // 期限切れの場合はトークンを削除
    }
  }, [navigate]);

  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>メールアドレス:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>パスワード:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};

export default Login;