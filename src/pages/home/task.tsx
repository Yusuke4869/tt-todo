import { Link } from "react-router-dom";

import type { FC } from "react";
import type { Task } from "~/types/api";

type Props = {
  tasks: Task[] | null;
  selectListId: string | undefined;
  isDoneDisplay: string;
};

const Tasks: FC<Props> = ({ tasks, selectListId, isDoneDisplay }) => {
  if (!selectListId || !tasks) return null;

  return isDoneDisplay === "done" ? (
    <ul>
      {tasks
        .filter((task) => task.done)
        .map((task, key) => (
          <li className="task-item" key={key}>
            <Link className="task-item-link" to={`/lists/${selectListId}/tasks/${task.id}`}>
              {task.title}
              <br />
              {task.done ? "完了" : "未完了"}
            </Link>
          </li>
        ))}
    </ul>
  ) : (
    <ul>
      {tasks
        .filter((task) => !task.done)
        .map((task, key) => (
          <li className="task-item" key={key}>
            <Link className="task-item-link" to={`/lists/${selectListId}/tasks/${task.id}`}>
              {task.title}
              <br />
              {task.done ? "完了" : "未完了"}
            </Link>
          </li>
        ))}
    </ul>
  );
};

export default Tasks;
