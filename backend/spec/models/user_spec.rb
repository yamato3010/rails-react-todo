require 'rails_helper'

RSpec.describe User, type: :model do
  # アソシエーションのテスト
  it { should have_many(:tasks).dependent(:destroy) }

  # バリデーションのテスト
  it { should validate_presence_of(:email) }
  it { should validate_uniqueness_of(:email) }
  it { should allow_value('user@example.com').for(:email) }
  it { should_not allow_value('invalid_email').for(:email) }

  describe 'パスワードのバリデーション' do
    it '新規作成時にパスワードが6文字未満だとエラーになること' do
      user = User.new(name: 'Test User', email: 'test@example.com', password: '12345')
      expect(user).not_to be_valid
      expect(user.errors[:password]).to include('is too short (minimum is 6 characters)')
    end

    it '新規作成時にパスワードが6文字以上だと有効になること' do
      user = User.new(name: 'Test User', email: 'test@example.com', password: '123456')
      expect(user).to be_valid
    end
  end

  describe 'has_secure_password' do
    it 'パスワード認証が機能すること' do
      user = User.create(name: 'Test User', email: 'test@example.com', password: 'password123')
      expect(user.authenticate('password123')).to eq(user)
      expect(user.authenticate('wrong_password')).to be_falsey
    end
  end
end
