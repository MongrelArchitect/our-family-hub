import Card from "@/components/Card";

import { getTodoListInfo } from "@/lib/db/todos";
import NewTaskForm from "./NewTaskForm";

interface Params {
  params: {
    familyId: string;
    todoId: string;
  };
}

export default async function TodoList({ params }: Params) {
  const familyId = +params.familyId;
  const todoId = +params.todoId;

  const todoListInfo = await getTodoListInfo(+familyId, todoId);

  return (
    <main className="p-2 text-lg">
      <Card
        heading={todoListInfo.title}
        headingColor="bg-emerald-200"
      >
        <NewTaskForm 
          familyId={familyId}
          todoId={todoId}
          todoTitle={todoListInfo.title}
        />
        {todoListInfo.description ? <p>{todoListInfo.description}</p> : null}
        <p>No tasks to show. Start adding some!</p>
      </Card>
    </main>
  );
}
