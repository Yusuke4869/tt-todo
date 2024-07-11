import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

import "./style.css";
import { Header } from "~/components";

import type { FC } from "react";
import type { APIError, List } from "~/types/api";
import type { Cookie } from "~/types/cookie";

export const EditList: FC = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies<string, Cookie>(["token"]);
  const { listId } = useParams();

  const [title, setTitle] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();

  const onUpdateList = async () => {
    if (title === "" || !listId || !cookies.token) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/lists/${listId}`, {
      method: "PUT",
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
      setErrorMessage(`更新に失敗しました。 ${data.ErrorMessageEN} / ${data.ErrorMessageJP}`);
      return;
    }

    navigate("/");
  };

  const onDeleteList = async () => {
    if (!listId || !cookies.token) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/lists/${listId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${cookies.token}`,
      },
    });

    if (!res.ok) {
      const data = (await res.json()) as APIError;
      setErrorMessage(`削除に失敗しました。 ${data.ErrorMessageEN} / ${data.ErrorMessageJP}`);
      return;
    }

    navigate("/");
  };

  useEffect(() => {
    void (async () => {
      if (!listId || !cookies.token) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/lists/${listId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      });

      if (!res.ok) {
        const data = (await res.json()) as APIError;
        setErrorMessage(`リスト情報の取得に失敗しました。 ${data.ErrorMessageEN} / ${data.ErrorMessageJP}`);
        return;
      }

      const data = (await res.json()) as List;
      setTitle(data.title);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Header />
      <main className="edit-list">
        <h2>リスト編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-list-form">
          <label>タイトル</label>
          <br />
          <input
            className="edit-list-title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            value={title}
          />
          <br />
          <button
            className="delete-list-button"
            onClick={() => {
              void onDeleteList();
            }}
            type="button"
          >
            削除
          </button>
          <button
            className="edit-list-button"
            onClick={() => {
              void onUpdateList();
            }}
            type="button"
          >
            更新
          </button>
        </form>
      </main>
    </div>
  );
};
