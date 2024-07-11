import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import "./style.css";
import { Header } from "~/components";

import type { FC } from "react";
import type { APIError, List } from "~/types/api";
import type { Cookie } from "~/types/cookie";

export const NewTask: FC = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies<string, Cookie>(["tolen"]);

  const [lists, setLists] = useState<List[]>([]);
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [selectListId, setSelectListId] = useState<string>();

  const onCreateTask = async () => {
    if (title === "" || detail === "" || !selectListId || !cookies.token) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/lists/${selectListId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        title: title,
        detail: detail,
        done: false,
      }),
    });

    if (!res.ok) {
      const data = (await res.json()) as APIError;
      setErrorMessage(`タスクの作成に失敗しました。 ${data.ErrorMessageEN} / ${data.ErrorMessageJP}`);
      return;
    }

    navigate("/");
  };

  useEffect(() => {
    void (async () => {
      if (!cookies.token) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      });

      if (!res.ok) {
        const data = (await res.json()) as APIError;
        setErrorMessage(`リストの取得に失敗しました。 ${data.ErrorMessageEN} / ${data.ErrorMessageJP}`);
        return;
      }

      const data = (await res.json()) as List[];
      setLists(data);
      setSelectListId(data[0]?.id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Header />
      <main className="new-task">
        <h2>タスク新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-task-form">
          <label>リスト</label>
          <br />
          <select
            className="new-task-select-list"
            onChange={(e) => {
              setSelectListId(e.target.value);
            }}
          >
            {lists.map((list, key) => (
              <option className="list-item" key={key} value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <br />
          <label>タイトル</label>
          <br />
          <input
            className="new-task-title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
          />
          <br />
          <label>詳細</label>
          <br />
          <textarea
            className="new-task-detail"
            onChange={(e) => {
              setDetail(e.target.value);
            }}
          />
          <br />
          <button
            className="new-task-button"
            onClick={() => {
              void onCreateTask();
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
