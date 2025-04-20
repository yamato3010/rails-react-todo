class Api::V1::TasksController < ApplicationController
  before_action :set_task, only: [:show, :update, :destroy]

  # GET /api/v1/tasks
  def index
    @tasks = current_user.tasks

    # カレンダー用にタスクを日付でフィルタリングできるようにする
    if params[:start_date] && params[:end_date]
      start_date = Date.parse(params[:start_date])
      end_date = Date.parse(params[:end_date])
      @tasks = @tasks.where(due_date: start_date.beginning_of_day..end_date.end_of_day)
    end

    render json: @tasks
  end

  # GET /api/v1/tasks/:id
  def show
    render json: @task
  end

  # POST /api/v1/tasks
  def create
    @task = current_user.tasks.new(task_params)

    if @task.save
      render json: @task, status: :created
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/tasks/:id
  def update
    if @task.update(task_params)
      render json: @task
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/tasks/:id
  def destroy
    @task.destroy
    head :no_content
  end

  def calendar
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.today.beginning_of_month
    end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.today.end_of_month
    
    @tasks = current_user.tasks.where(due_date: start_date.beginning_of_day..end_date.end_of_day)
    
    render json: @tasks
  end

  private

  def set_task
    @task = current_user.tasks.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :description, :due_date, :completed, :priority)
  end
end
