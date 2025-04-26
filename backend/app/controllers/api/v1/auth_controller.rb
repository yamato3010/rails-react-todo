class Api::V1::AuthController < ApplicationController
  skip_before_action :authorize_request, only: :login

  # POST /auth/login
  def login
    @user = User.find_by(email: params[:email])
    if @user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: @user.id)
      time = 24.hours.from_now
      render json: {
        token: token,
        exp: time.strftime("%m-%d-%Y %H:%M"),
        user_id: @user.id,
        name: @user.name
      }, status: :ok
    else
      render json: { error: "メールアドレスまたはパスワードが間違っています" }, status: :unauthorized
    end
  end
end