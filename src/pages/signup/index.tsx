import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";

import "./style.scss";
import { Header } from "~/components";
import { signIn } from "~/stores/authSlice";
import { useSelector } from "~/stores/store";

import type { FC } from "react";
import type { APIError, SignInResponse } from "~/types/api";

export const SignUp: FC = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, setCookie] = useCookies();

  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [errorMessage, setErrorMessge] = useState<string>();

  const onSignUp = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        password: password,
      }),
    });

    if (!res.ok) {
      const data = (await res.json()) as APIError;
      setErrorMessge(`サインアップに失敗しました。 ${data.ErrorMessageEN} / ${data.ErrorMessageJP}`);
      return;
    }

    const data = (await res.json()) as SignInResponse;
    setCookie("token", data.token);
    dispatch(signIn());
    navigate("/");
  };

  if (auth) return <Navigate to="/" />;

  return (
    <>
      <Header />
      <main className="signup">
        <h2>新規作成</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="signup-form">
          <div className="form-block">
            <label>メールアドレス</label>
            <input
              className="input"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
            />
          </div>
          <div className="form-block">
            <label>ユーザ名</label>
            <input
              className="input"
              onChange={(e) => {
                setName(e.target.value);
              }}
              type="text"
            />
          </div>
          <div className="form-block">
            <label>パスワード</label>
            <input
              className="input"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
            />
          </div>
          <button
            className="signup-button"
            onClick={() => {
              void onSignUp();
            }}
            type="button"
          >
            作成
          </button>
        </form>
      </main>
    </>
  );
};
