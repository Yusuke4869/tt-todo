import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

import "./style.css";
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
  const [errorMessage, setErrorMessage] = useState<string>();

  const onUpdateTask = async () => {
    if (title === "" || detail === "" || !listId || !taskId || !cookies.token) return;
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
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label>タイトル</label>
          <br />
          <input
            className="edit-task-title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            value={title}
          />
          <br />
          <label>詳細</label>
          <br />
          <textarea
            className="edit-task-detail"
            onChange={(e) => {
              setDetail(e.target.value);
            }}
            value={detail}
          />
          <br />
          <div>
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
            未完了
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
            完了
          </div>
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
        </form>
      </main>
    </div>
  );
};
