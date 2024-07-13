import { Link } from "react-router-dom";

import type { FC } from "react";
import type { Task } from "~/types/api";

import "./style.scss";

type Props = {
  task: Task;
  selectListId: string;
};

const Task: FC<Props> = ({ task, selectListId }) => {
  const date = task.limit ? new Date(task.limit) : null;

  const diff = date ? date.getTime() - Date.now() : 0;
  const day = diff ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;
  const hour = diff ? Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : 0;
  const minute = diff ? Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)) : 0;

  return (
    <Link className="task-item" to={`/lists/${selectListId}/tasks/${task.id}`}>
      <div className="task-title-wrapper">
        <p className="task-title">{task.title}</p>
        <p>
          {date?.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <div className="task-status">
        <p>{task.done ? "完了" : "未完了"}</p>
        {!task.done &&
          (diff > 0 ? (
            <p>
              残り:
              {day > 0 && ` ${day.toString()}日`}
              {hour > 0 && ` ${hour.toString()}時間`}
              {minute > 0 && ` ${minute.toString()}分`}
            </p>
          ) : diff < 0 ? (
            <p className="expired">期限切れ</p>
          ) : (
            <></>
          ))}
      </div>
    </Link>
  );
};

export default Task;
