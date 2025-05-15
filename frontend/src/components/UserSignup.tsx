import React, { useState } from 'react';
import { signup } from '../api/axios';
import { useNavigate } from 'react-router-dom';

const UserSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await signup({ name, email, password, password_confirmation: passwordConfirmation });
      setMessage('ユーザー登録に成功しました！');
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
      setTimeout(() => {
        navigate('/'); // ログイン画面に遷移
      }, 1000); // 1秒後に遷移
    } catch (err: any) {
      setError(err.response?.data?.errors?.join(', ') || 'ユーザー登録に失敗しました。');
    }
  };

  return (
    <div>
      <h1>ユーザー登録</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>名前:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div>
          <label>パスワード確認:</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">登録</button>
      </form>
    </div>
  );
};

export default UserSignup;