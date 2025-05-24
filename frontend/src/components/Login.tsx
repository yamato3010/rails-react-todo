import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/axios';
import { isTokenExpired } from '../utils/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('ログイン試行中...', { email });
      const response = await login({ email, password });
      console.log('ログイン成功:', response);

      localStorage.setItem('token', response.token);
      console.log('トークン保存完了');

      // 少し待ってからナビゲート
      setTimeout(() => {
        console.log('ダッシュボードに遷移中...');
        navigate('/dashboard', { replace: true });
      }, 100);

    } catch (err: any) {
      console.error('ログインエラー:', err);
      setError('ログインに失敗しました。メールアドレスまたはパスワードを確認してください。');
      setIsLoading(false);
    }
  };

  // トークンが存在する場合はダッシュボードにリダイレクト
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Login認証チェック:', { token: token ? 'あり' : 'なし' });

    if (token && !isTokenExpired(token)) {
      console.log('有効なトークンあり - ダッシュボードにリダイレクト');
      navigate('/dashboard', { replace: true });
    } else if (token) {
      console.log('期限切れトークンを削除');
      localStorage.removeItem('token');
    }
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* メインのログインカード */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e1e8ed',
        position: 'relative'
      }}>
        {/* ヘッダー */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            📋
          </div>
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '8px'
          }}>
            タスク管理システム
          </h1>
          <p style={{
            margin: 0,
            color: '#7f8c8d',
            fontSize: '16px'
          }}>
            アカウントにログインしてください
          </p>
        </div>

        {/* ログインフォーム */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* エラーメッセージ */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(238, 90, 82, 0.3)'
            }}>
              {error}
            </div>
          )}

          {/* メールアドレス入力 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2c3e50',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              📧 メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e8ed',
                borderRadius: '10px',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                outline: 'none',
                backgroundColor: isLoading ? '#f8f9fa' : 'white',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
              placeholder="your@email.com"
            />
          </div>

          {/* パスワード入力 */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2c3e50',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              🔒 パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e8ed',
                borderRadius: '10px',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                outline: 'none',
                backgroundColor: isLoading ? '#f8f9fa' : 'white',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
              placeholder="パスワードを入力"
            />
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              background: isLoading
                ? 'linear-gradient(135deg, #bdc3c7, #95a5a6)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isLoading
                ? 'none'
                : '0 4px 15px rgba(102, 126, 234, 0.4)',
              transform: isLoading ? 'none' : 'translateY(0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                ログイン中...
              </>
            ) : (
              <>
                🚀 ログイン
              </>
            )}
          </button>
        </form>

        {/* フッター */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e1e8ed'
        }}>
          <p style={{
            margin: 0,
            color: '#7f8c8d',
            fontSize: '14px'
          }}>
            アカウントをお持ちでない場合は{' '}
            <span
              onClick={() => navigate('/signup')}
              style={{
                color: '#667eea',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontWeight: '600'
              }}
            >
              新規登録
            </span>
          </p>
        </div>
      </div>

      {/* CSSアニメーション */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        input:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default Login;