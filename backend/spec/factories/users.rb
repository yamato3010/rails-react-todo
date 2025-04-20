FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    email { Faker::Internet.unique.email }
    password { 'password123' }
  end
end

# spec/factories/tasks.rb
FactoryBot.define do
  factory :task do
    title { Faker::Lorem.sentence(word_count: 3) }
    description { Faker::Lorem.paragraph }
    due_date { Faker::Date.between(from: Date.today, to: 1.month.from_now) }
    completed { false }
    priority { Task.priorities.keys.sample }
    association :user
  end
end
