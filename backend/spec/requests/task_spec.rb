require 'rails_helper'

RSpec.describe 'Api::V1::Tasks', type: :request do
  let(:user) { create(:user) }
  let(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:headers) { { 'Authorization' => token } }

  describe 'GET /api/v1/tasks' do
    before do
      create_list(:task, 5, user: user)
    end

    it 'ユーザーのタスク一覧を返すこと' do
      get '/api/v1/tasks', headers: headers
      expect(response).to have_http_status(200)
      json_response = JSON.parse(response.body)
      expect(json_response.length).to eq(5)
    end

    context '日付フィルタが指定されている場合' do
      before do
        # 特定の日付のタスクを作成
        create(:task, user: user, due_date: Date.parse('2023-01-01'))
      end

      it '指定された日付範囲のタスクのみを返すこと' do
        get '/api/v1/tasks', params: { start_date: '2023-01-01', end_date: '2023-01-01' }, headers: headers
        expect(response).to have_http_status(200)
        json_response = JSON.parse(response.body)
        expect(json_response.length).to eq(1)
        expect(Date.parse(json_response[0]['due_date'])).to eq(Date.parse('2023-01-01'))
      end
    end
  end

  describe 'POST /api/v1/tasks' do
    let(:valid_attributes) {
      { task: { title: 'New Task', description: 'Task description', due_date: Date.tomorrow, priority: 'high' } }
    }

    context '有効なパラメータの場合' do
      it 'タスクを作成すること' do
        expect {
          post '/api/v1/tasks', params: valid_attributes, headers: headers
        }.to change(Task, :count).by(1)
      end

      it '201 Createdを返すこと' do
        post '/api/v1/tasks', params: valid_attributes, headers: headers
        expect(response).to have_http_status(:created)
      end
    end

    context '無効なパラメータの場合' do
      let(:invalid_attributes) {
        { task: { description: 'Missing title' } }
      }

      it '422 Unprocessable Entityを返すこと' do
        post '/api/v1/tasks', params: invalid_attributes, headers: headers
        expect(response).to have_http_status(422)
      end
    end
  end

  describe 'GET /api/v1/tasks/:id' do
    let!(:task) { create(:task, user: user) }

    it '指定されたタスクの詳細を返すこと' do
      get "/api/v1/tasks/#{task.id}", headers: headers
      expect(response).to have_http_status(200)
      json_response = JSON.parse(response.body)
      expect(json_response['id']).to eq(task.id)
      expect(json_response['title']).to eq(task.title)
    end
  end

  describe 'PUT /api/v1/tasks/:id' do
    let!(:task) { create(:task, user: user) }

    context '有効なパラメータの場合' do
      let(:update_attributes) {
        { task: { title: 'Updated Task', completed: true } }
      }

      it 'タスクを更新すること' do
        put "/api/v1/tasks/#{task.id}", params: update_attributes, headers: headers
        expect(response).to have_http_status(200)
        task.reload
        expect(task.title).to eq('Updated Task')
        expect(task.completed).to be_truthy
      end
    end
  end

  describe 'DELETE /api/v1/tasks/:id' do
    let!(:task) { create(:task, user: user) }

    it 'タスクを削除すること' do
      expect {
        delete "/api/v1/tasks/#{task.id}", headers: headers
      }.to change(Task, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end
