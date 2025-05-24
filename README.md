# シンプルTODOアプリ（仮）

このプロジェクトは、React + TypeScript + Vite を使用したフロントエンドと、Ruby on Rails を使用したバックエンドで構成されています。Docker を利用して開発環境を簡単にセットアップできるようになっています。

## バックエンド

### 必要な環境（フロントエンド）

- Ruby 3.4.3
- Rails 8.0.2
- PostgreSQL

### セットアップ手順（バックエンド）

1. 必要なGemをインストールします。

   ```bash
   bundle install
   ```

2. データベースをセットアップします。

   ```bash
   rails db:create db:migrate
   ```

3. サーバーを起動します。

   ```bash
   rails server
   ```

### テストの実行

RSpec を使用してテストを実行できます。

```bash
bundle exec rspec
```

---

## フロントエンド

### 必要な環境

- Node.js 22.14.2
- npm または yarn

### セットアップ手順

1. 必要なパッケージをインストールします。

   ```bash
   npm install
   ```

2. 開発サーバーを起動します。

   ```bash
   npm run dev
   ```

3. ブラウザで `http://localhost:3000` にアクセスします。

---

## Docker を使用した開発環境のセットアップ

1. Docker と Docker Compose をインストールします。
2. 以下のコマンドを実行してコンテナを起動します。

   ```bash
   docker-compose up --build
   ```

3. バックエンドは `http://localhost:3000`、フロントエンドは `http://localhost:5173` でアクセスできます。

---
