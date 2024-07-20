import Card from "@/components/Card";

import { getTasks, getTodoListInfo } from "@/lib/db/todos";

import NewTaskForm from "./NewTaskForm";
import Task from "./Task";

interface Params {
  params: {
    familyId: string;
    todoId: string;
  };
}

export default async function TodoList({ params }: Params) {
  const familyId = +params.familyId;
  const todoId = +params.todoId;

  const todoListInfo = await getTodoListInfo(familyId, todoId);
  const tasks = await getTasks(familyId, todoId);

  const showTasks = () => {
    if (tasks.length) {
      return (
        <table className="flex flex-col text-base lg:text-lg">
          <thead>
            <tr className="border-b-2 border-neutral-400 flex justify-between">
              <th>Title</th>
              <th>Due</th>
              <th>Assigned to</th>
              <th>Done</th>
            </tr>
          </thead>
          <tbody className="flex flex-col">
            {tasks.map((task, index) => {
              return <Task index={index} key={task.id} task={task} />;
            })}
          </tbody>
        </table>
      );
    }
    return <p>No tasks to show. Start adding some!</p>;
  };

  return (
    <main className="p-2 text-lg">
      <Card heading={todoListInfo.title} headingColor="bg-emerald-200">
        <NewTaskForm
          familyId={familyId}
          todoId={todoId}
          todoTitle={todoListInfo.title}
        />
        {todoListInfo.description ? <p>{todoListInfo.description}</p> : null}
        {showTasks()}
      </Card>
    </main>
  );
}
