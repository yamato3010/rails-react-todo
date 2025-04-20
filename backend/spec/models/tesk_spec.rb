require 'rails_helper'

RSpec.describe Task, type: :model do
  # アソシエーションのテスト
  it { should belong_to(:user) }
  
  # バリデーションのテスト
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:due_date) }
  
  # enumのテスト
  it { should define_enum_for(:priority).with_values(low: 0, medium: 1, high: 2) }
  
  describe '基本的な機能' do
    let(:user) { User.create(name: 'Test User', email: 'test@example.com', password: 'password123') }
    
    it 'タスクが作成できること' do
      task = user.tasks.build(
        title: 'Test Task',
        description: 'This is a test task',
        due_date: Date.today,
        priority: 'medium',
        completed: false
      )
      expect(task).to be_valid
      expect(task.save).to be_truthy
    end
    
    it 'タスクのプロパティにアクセスできること' do
      task = user.tasks.create(
        title: 'Test Task',
        description: 'This is a test task',
        due_date: Date.today,
        priority: 'high',
        completed: false
      )
      
      expect(task.title).to eq('Test Task')
      expect(task.description).to eq('This is a test task')
      expect(task.due_date.to_date).to eq(Date.today)
      expect(task.priority).to eq('high')
      expect(task.completed).to be_falsey
    end
  end
end