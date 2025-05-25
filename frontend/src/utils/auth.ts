export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // トークンのペイロード部分をデコード
    const exp = payload.exp * 1000; // 有効期限をミリ秒に変換
    return Date.now() > exp; // 現在時刻と比較して期限切れか確認
  } catch (error) {
    console.error('トークンのデコードに失敗しました:', error);
    return true; // トークンが無効な場合は期限切れとみなす
  }
};