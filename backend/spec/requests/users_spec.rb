require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do
  describe 'POST /api/v1/users' do
    let(:valid_attributes) {
      { name: 'New User', email: 'newuser@example.com', password: 'password123' }
    }

    context '有効なパラメータの場合' do
      it 'ユーザーを作成すること' do
        expect {
          post '/api/v1/users', params: valid_attributes
        }.to change(User, :count).by(1)
      end

      it '201 Createdを返すこと' do
        post '/api/v1/users', params: valid_attributes
        expect(response).to have_http_status(201)
      end

      it 'JWTトークンを返すこと' do
        post '/api/v1/users', params: valid_attributes
        json_response = JSON.parse(response.body)
        expect(json_response['token']).not_to be_nil
      end
    end

    context '無効なパラメータの場合' do
      it '422 Unprocessable Entityを返すこと' do
        post '/api/v1/users', params: { email: 'invalid', password: '123' }
        expect(response).to have_http_status(422)
      end
    end
  end

  describe 'GET /api/v1/users/:id' do
    let(:user) { create(:user) }
    let(:token) { JsonWebToken.encode(user_id: user.id) }
    let(:headers) { { 'Authorization' => token } }

    context '認証済みの場合' do
      it 'ユーザー情報を返すこと' do
        get "/api/v1/users/#{user.id}", headers: headers
        expect(response).to have_http_status(200)
        json_response = JSON.parse(response.body)
        expect(json_response['id']).to eq(user.id)
        expect(json_response['email']).to eq(user.email)
      end
    end

    context '認証なしの場合' do
      it '401 Unauthorizedを返すこと' do
        get "/api/v1/users/#{user.id}"
        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'PUT /api/v1/users/:id' do
    let(:user) { create(:user) }
    let(:token) { JsonWebToken.encode(user_id: user.id) }
    let(:headers) { { 'Authorization' => token } }

    context '自分自身の情報を更新する場合' do
      it 'ユーザー情報を更新すること' do
        put "/api/v1/users/#{user.id}", params: { name: 'Updated Name' }, headers: headers
        expect(response).to have_http_status(200)
        expect(user.reload.name).to eq('Updated Name')
      end
    end

    context '他のユーザーの情報を更新しようとする場合' do
      let(:other_user) { create(:user) }

      it '403 Forbiddenを返すこと' do
        put "/api/v1/users/#{other_user.id}", params: { name: 'Hacked Name' }, headers: headers
        expect(response).to have_http_status(403)
      end
    end
  end
end
