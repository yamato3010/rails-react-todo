class Task < ApplicationRecord
  belongs_to :user

  validates :title, presence: true
  validates :due_date, presence: true

  enum :priority, { low: 0, medium: 1, high: 2 }
end
