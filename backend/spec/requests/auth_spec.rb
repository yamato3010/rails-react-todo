require 'rails_helper'

RSpec.describe 'Auth API', type: :request do
  describe 'POST /auth/login' do
    let!(:user) { create(:user, email: 'test@example.com', password: 'password123') }

    context '正しい認証情報の場合' do
      before do
        post '/auth/login', params: { email: 'test@example.com', password: 'password123' }
      end

      it '200 OKを返すこと' do
        expect(response).to have_http_status(200)
      end

      it 'JWTトークンを返すこと' do
        json_response = JSON.parse(response.body)
        expect(json_response['token']).not_to be_nil
      end

      it 'ユーザー情報を返すこと' do
        json_response = JSON.parse(response.body)
        expect(json_response['user_id']).to eq(user.id)
        expect(json_response['name']).to eq(user.name)
      end
    end

    context '不正な認証情報の場合' do
      before do
        post '/auth/login', params: { email: 'test@example.com', password: 'wrong_password' }
      end

      it '401 Unauthorizedを返すこと' do
        expect(response).to have_http_status(401)
      end

      it 'エラーメッセージを返すこと' do
        json_response = JSON.parse(response.body)
        expect(json_response['error']).to eq('認証できません')
      end
    end
  end
end
