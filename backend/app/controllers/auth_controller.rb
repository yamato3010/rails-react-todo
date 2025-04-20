class AuthController < ApplicationController
  skip_before_action :authorize_request, only: :login

  # POST /auth/login
  def login
    @user = User.find_by_email(params[:email])
    if @user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: @user.id)
      time = Time.now + 24.hours.to_i
      render json: { token: token, exp: time.strftime("%m-%d-%Y %H:%M"),
      user_id: @user.id, name: @user.name }, status: :ok
    else
      render json: { error: "認証できません" }, status: :unauthorized
    end
  end
end
