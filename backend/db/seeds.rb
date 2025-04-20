# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
# テスト用ユーザー
user = User.find_or_create_by!(
  email: "testuser@example.com"
) do |u|
  u.name = "テストユーザー"
  u.password = "password123"
end

# タスク作成
10.times do |i|
  user.tasks.create!(
    title: "タスク #{i+1}",
    description: "これはタスク #{i+1} の説明です",
    due_date: Date.today + i.days,
    completed: i.even?,
    priority: Task.priorities.keys.sample
  )
end
