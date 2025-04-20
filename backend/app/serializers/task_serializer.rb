class TaskSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :due_date, :completed, :priority, :created_at, :updated_at
end