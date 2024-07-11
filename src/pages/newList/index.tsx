import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import "./style.css";
import { Header } from "~/components";

import type { FC } from "react";
import type { APIError } from "~/types/api";
import type { Cookie } from "~/types/cookie";

export const NewList: FC = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies<string, Cookie>(["token"]);

  const [title, setTitle] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();

  const onCreateList = async () => {
    if (title === "" || !cookies.token) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        title: title,
      }),
    });

    if (!res.ok) {
      const data = (await res.json()) as APIError;
      setErrorMessage(`リストの作成に失敗しました。 ${data.ErrorMessageEN} / ${data.ErrorMessageJP}`);
      return;
    }

    navigate("/");
  };

  return (
    <div>
      <Header />
      <main className="new-list">
        <h2>リスト新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-list-form">
          <label>タイトル</label>
          <br />
          <input
            className="new-list-title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
          />
          <br />
          <button
            className="new-list-button"
            onClick={() => {
              void onCreateList();
            }}
            type="button"
          >
            作成
          </button>
        </form>
      </main>
    </div>
  );
};
