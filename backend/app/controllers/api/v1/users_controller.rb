class Api::V1::UsersController < ApplicationController
  skip_before_action :authorize_request, only: [ :create ]
  before_action :set_user, only: [ :show, :update, :destroy ]

  # GET /api/v1/users/:id
  def show
    render json: @user
  end

  # POST /signup
  def create
    @user = User.new(user_params)
    if @user.save
      token = JsonWebToken.encode(user_id: @user.id)
      time = 24.hours.from_now
      render json: {
        token: token,
        exp: time.strftime("%m-%d-%Y %H:%M"),
        user_id: @user.id,
        name: @user.name
      }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/users/:id
  def update
    unless @user.id == current_user.id
      return render json: { error: "権限がありません" }, status: :forbidden
    end

    if @user.update(user_params)
      render json: @user, status: :ok
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/users/:id
  def destroy
    unless @user.id == current_user.id
      return render json: { error: "権限がありません" }, status: :forbidden
    end

    @user.destroy
    head :no_content
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.permit(:name, :email, :password, :password_confirmation)
  end
end
