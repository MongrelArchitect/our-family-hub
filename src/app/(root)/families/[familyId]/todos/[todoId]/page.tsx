import Card from "@/components/Card";

interface Params {
  params: {
    familyId: string;
    todoId: string;
  };
}

export default function TodoList({ params }: Params) {
  const { familyId, todoId } = params;
  return (
    <main className="p-2">
      <Card
        heading="Todo List"
        headingColor="bg-emerald-200"
      >
        <p>
          {familyId}
        </p>
        <p>
          {todoId}
        </p>
      </Card>
    </main>
  );
}
