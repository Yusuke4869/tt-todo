import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

import "./style.scss";
import { Header } from "~/components";

import type { FC } from "react";
import type { APIError, TaskResponse } from "~/types/api";
import type { Cookie } from "~/types/cookie";

export const EditTask: FC = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies<string, Cookie>(["token"]);
  const { listId, taskId } = useParams();

  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [isDone, setIsDone] = useState<boolean>(false);
  const [limit, setLimit] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();

  const onUpdateTask = async () => {
    if (!listId || !taskId || !cookies.token) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/lists/${listId}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        title: title,
        detail: detail,
        done: isDone,
        limit: limit ? new Date(limit).toISOString().replace(".000", "") : null,
      }),
    });

    if (!res.ok) {
      const data = (await res.json()) as APIError;
      setErrorMessage(`更新に失敗しました。 ${data.ErrorMessageEN} / ${data.ErrorMessageJP}`);
      return;
    }

    navigate("/");
  };

  const onDeleteTask = async () => {
    if (!listId || !taskId || !cookies.token) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/lists/${listId}/tasks/${taskId}`, {
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
      if (!listId || !taskId || !cookies.token) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      });

      if (!res.ok) {
        const data = (await res.json()) as APIError;
        setErrorMessage(`タスク情報の取得に失敗しました。 ${data.ErrorMessageEN} / ${data.ErrorMessageJP}`);
        return;
      }

      const task = (await res.json()) as TaskResponse;
      setTitle(task.title);
      setDetail(task.detail);
      setIsDone(task.done);
      if (task.limit)
        setLimit(
          new Date(new Date(task.limit).getTime() - new Date().getTimezoneOffset() * 60 * 1000)
            .toISOString()
            .replace(".000Z", "")
        );
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="edit-task-form">
          <div className="form-block">
            <label>タイトル</label>
            <input
              className="input"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              type="text"
              value={title}
            />
          </div>
          <div className="form-block">
            <label>詳細</label>
            <textarea
              className="input"
              onChange={(e) => {
                setDetail(e.target.value);
              }}
              value={detail}
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
          <div className="radios-wapper">
            <div className="radio-wapper">
              <input
                checked={!isDone}
                id="todo"
                name="status"
                onChange={(e) => {
                  setIsDone(e.target.value === "done");
                }}
                type="radio"
                value="todo"
              />
              <label>未完了</label>
            </div>
            <div className="radio-wapper">
              <input
                checked={isDone}
                id="done"
                name="status"
                onChange={(e) => {
                  setIsDone(e.target.value === "done");
                }}
                type="radio"
                value="done"
              />
              <label>完了</label>
            </div>
          </div>
          <div className="buttons-wapper">
            <button
              className="delete-task-button"
              onClick={() => {
                void onDeleteTask();
              }}
              type="button"
            >
              削除
            </button>
            <button
              className="edit-task-button"
              onClick={() => {
                void onUpdateTask();
              }}
              type="button"
            >
              更新
            </button>
          </div>
        </form>
      </main>
    </>
  );
};
