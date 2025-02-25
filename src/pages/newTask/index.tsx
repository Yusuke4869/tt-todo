import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import "./style.scss";
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
  const [limit, setLimit] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [selectListId, setSelectListId] = useState<string>();

  const onCreateTask = async () => {
    if (!selectListId || !cookies.token) return;
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
        limit: limit ? new Date(limit).toISOString().replace(".000", "") : null,
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
    <>
      <Header />
      <main className="new-task">
        <h2>タスク新規作成</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="new-task-form">
          <div className="form-block">
            <label>リスト</label>
            <select
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
          </div>
          <div className="form-block">
            <label>タイトル</label>
            <input
              className="input"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              type="text"
            />
          </div>
          <div className="form-block">
            <label>詳細</label>
            <textarea
              className="input"
              onChange={(e) => {
                setDetail(e.target.value);
              }}
            />
          </div>
          <div className="form-block">
            <label>期限</label>
            <input
              className="input"
              onChange={(e) => {
                setLimit(e.target.value);
              }}
              type="datetime-local"
              value={limit}
            />
          </div>
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
    </>
  );
};
