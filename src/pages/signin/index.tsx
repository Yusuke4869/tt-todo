import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate, Link } from "react-router-dom";

import "./style.scss";
import { Header } from "~/components";
import { signIn } from "~/stores/authSlice";
import { useSelector } from "~/stores/store";

import type { FC } from "react";
import type { APIError, SignInResponse } from "~/types/api";

export const SignIn: FC = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, setCookie] = useCookies();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const onSignIn = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!res.ok) {
      const data = (await res.json()) as APIError;
      setErrorMessage(`サインインに失敗しました。 ${data.ErrorMessageEN} / ${data.ErrorMessageJP}`);
      return;
    }

    const data = (await res.json()) as SignInResponse;
    setCookie("token", data.token);
    dispatch(signIn());
    navigate("/");
  };

  if (auth) return <Navigate to="/" />;

  return (
    <div>
      <Header />
      <main className="signin">
        <h2>サインイン</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signin-form">
          <label className="email-label">メールアドレス</label>
          <br />
          <input
            className="email-input"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
          />
          <br />
          <label className="password-label">パスワード</label>
          <br />
          <input
            className="password-input"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
          />
          <br />
          <button
            className="signin-button"
            onClick={() => {
              void onSignIn();
            }}
            type="button"
          >
            サインイン
          </button>
        </form>
        <Link to="/signup">新規作成</Link>
      </main>
    </div>
  );
};
