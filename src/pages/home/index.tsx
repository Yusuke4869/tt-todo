import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

import "./style.scss";
import { Header } from "~/components";

import TaskComponent from "./task";

import type { FC, KeyboardEvent } from "react";
import type { APIError, List, TaskList, Task } from "~/types/api";
import type { Cookie } from "~/types/cookie";

export const Home: FC = () => {
  const [cookies] = useCookies<string, Cookie>(["token"]);

  const [lists, setLists] = useState<List[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectListId, setSelectListId] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isDoneDisplay, setIsDoneDisplay] = useState<string>("todo"); // todo: 未完了, done: 完了

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
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectList = async (id: string) => {
    setSelectListId(id);
    if (!cookies.token) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/lists/${id}/tasks`, {
      headers: {
        authorization: `Bearer ${cookies.token}`,
      },
    });

    if (!res.ok) {
      const data = (await res.json()) as APIError;
      setErrorMessage(`タスクの取得に失敗しました。 ${data.ErrorMessageEN} / ${data.ErrorMessageJP}`);
      return;
    }

    const data = (await res.json()) as TaskList;
    setTasks(data.tasks ?? []);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>, id: string) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    void handleSelectList(id);
  };

  useEffect(() => {
    const listId = lists[0]?.id;
    if (typeof listId !== "undefined") void handleSelectList(listId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists]);

  return (
    <>
      <Header />
      <main className="list-task">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="lists">
          <div className="list-header">
            <h2>リスト一覧</h2>
            <div className="list-menu">
              <Link to="/list/new">リスト新規作成</Link>
              {selectListId && <Link to={`/lists/${selectListId}/edit`}>選択中のリストを編集</Link>}
            </div>
          </div>
          <ul className="list-tab" role="tablist">
            {lists.map((list, key) => (
              <li
                className={`list-tab-item ${list.id === selectListId ? "active" : ""}`}
                key={key}
                onClick={() => {
                  void handleSelectList(list.id);
                }}
                onKeyDown={(e) => {
                  handleKeyDown(e, list.id);
                }}
                role="tab"
                tabIndex={0}
              >
                {list.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="tasks">
          <div className="tasks-header">
            <h2>タスク一覧</h2>
            <Link to="/task/new">タスク新規作成</Link>
          </div>
          <select
            onChange={(e) => {
              setIsDoneDisplay(e.target.value);
            }}
          >
            <option value="todo">未完了</option>
            <option value="done">完了</option>
          </select>
          <div>
            {selectListId &&
              tasks
                .filter((task) => (isDoneDisplay === "done" ? task.done : !task.done))
                .map((task, key) => <TaskComponent key={key} selectListId={selectListId} task={task} />)}
          </div>
        </div>
      </main>
    </>
  );
};
