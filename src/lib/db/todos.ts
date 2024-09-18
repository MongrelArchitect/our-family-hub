"use server";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";
import { isDate, isEmpty, isInt, isLength, trim } from "validator";

import pool from "./pool";

import getUserId from "../auth/user";

import TodoListInterface, {
  TaskInterface,
  TodoListSummary,
} from "@/types/TodoList";

export async function createNewTask(
  familyId: number,
  todoId: number,
  offset: number | null,
  formData: FormData,
) {
  try {
    const userId = await getUserId();

    // title required
    let title = formData.get("title");
    if (!title || typeof title !== "string") {
      throw new Error("Missing or invalid title");
    }
    title = trim(title);
    if (isEmpty(title) || !isLength(title, { min: 1, max: 255 })) {
      throw new Error("Title required - 255 characters max");
    }

    // details optional
    let details = formData.get("details");
    if (details) {
      if (typeof details !== "string") {
        throw new Error("Invalid details");
      }
      details = trim(details);
      if (!isLength(details, { min: 0, max: 255 })) {
        throw new Error("Details 255 characters max");
      }
    }

    // due date optional
    const dueDate = formData.get("due");
    if (dueDate) {
      if (typeof dueDate !== "string" || !isDate(dueDate)) {
        throw new Error("Invalud due date");
      }
    }

    // we need to standarize any timestamps coming from the user by first
    // converting them into UTC, so that any conversions back to user's time zone
    // in client components is accurate.
    let dueDateUTC = "";
    if (dueDate && offset && typeof dueDate === "string") {
      const date = new Date(dueDate);
      // adding offset ensures that all db timestamps are correct relative to user
      date.setMinutes(date.getMinutes() + offset);
      dueDateUTC = date.toISOString();
    }

    // assigned optional
    const assigned = formData.get("assigned");
    if (assigned) {
      if (typeof assigned !== "string" || !isInt(assigned)) {
        throw new Error("Invalid assigned user id");
      }
    }

    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      INSERT INTO tasks
      (todo_list_id, created_by, assigned_to, title, details, due_by)
      SELECT $3, $1, $4, $5, $6, $7
      WHERE EXISTS(SELECT 1 FROM member_check)
    `;

    const result = await pool.query(query, [
      userId,
      familyId,
      todoId,
      assigned || null,
      title,
      details || null,
      dueDateUTC || null,
    ]);

    if (!result.rowCount) {
      throw new Error("Error creating new task");
    }

    revalidatePath(`/families/${familyId}`);
    revalidatePath(`/families/${familyId}/todos/${todoId}`);
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
}

export async function createNewTodoList(familyId: number, formData: FormData) {
  try {
    const userId = await getUserId();

    // title required
    let title = formData.get("title");
    if (!title || typeof title !== "string") {
      throw new Error("Misisng or invalid title");
    }
    title = trim(title);
    if (isEmpty(title) || !isLength(title, { min: 1, max: 255 })) {
      throw new Error("Title required - 255 characters max");
    }

    // description optional
    let description = formData.get("description");
    if (description) {
      if (typeof description !== "string") {
        throw new Error("Invalid description");
      }
      description = trim(description);
      if (!isLength(title, { min: 0, max: 255 })) {
        throw new Error("Description 255 characters max");
      }
    }

    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      INSERT INTO todo_lists
      (family_id, created_by, title, description)
      SELECT $2, $1, $3, $4
      WHERE EXISTS(SELECT 1 FROM member_check)
      RETURNING id;
    `;

    const result = await pool.query(query, [
      userId,
      familyId,
      title,
      description || null,
    ]);
    if (!result.rowCount) {
      // rowCount will be 1 if successfully created, 0 if not
      throw new Error("Error creating todo list");
    }
    revalidatePath(`/families/${familyId}/`);
    return +result.rows[0].id;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
}

export async function deleteTask(
  familyId: number,
  todoId: number,
  taskId: number,
) {
  try {
    const userId = await getUserId();
    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      ),
      admin_check AS (
        SELECT 1
        FROM families
        WHERE id = $2
        AND admin_id = $1
      ),
      author_check AS (
        SELECT 1
        FROM tasks
        WHERE id = $3
        AND created_by = $1
      )
      DELETE FROM tasks
      WHERE id = $3
      AND EXISTS(SELECT 1 FROM member_check)
      AND (
        EXISTS(SELECT 1 FROM admin_check)
        OR EXISTS(SELECT 1 FROM author_check)
      );
    `;
    const result = await pool.query(query, [userId, familyId, taskId]);
    if (result.rowCount) {
      revalidatePath(`/families/${familyId}/`);
      revalidatePath(`/families/${familyId}/todos/${todoId}`);
    }
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
}

export async function deleteTodoList(familyId: number, todoId: number) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const userId = await getUserId();
    // first delete all the tasks for this todo list
    const tasksQuery = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      ),
      admin_check AS (
        SELECT 1
        FROM families
        WHERE id = $2
        AND admin_id = $1
      ),
      creator_check AS (
        SELECT 1
        FROM todo_lists
        WHERE id = $3
        AND created_by = $1
      )
      DELETE FROM tasks
      WHERE todo_list_id = $3
      AND EXISTS(SELECT 1 FROM member_check)
      AND (EXISTS(SELECT 1 FROM admin_check)
      OR EXISTS(SELECT 1 FROM creator_check))
    `;
    await client.query(tasksQuery, [userId, familyId, todoId]);

    // then delete the todo list itself
    const todoQuery = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      ),
      admin_check AS (
        SELECT 1
        FROM families
        WHERE id = $2
        AND admin_id = $1
      ),
      creator_check AS (
        SELECT 1
        FROM todo_lists
        WHERE id = $3
        AND created_by = $1
      )
      DELETE FROM todo_lists
      WHERE id = $3
      AND EXISTS(SELECT 1 FROM member_check)
      AND (EXISTS(SELECT 1 FROM admin_check)
      OR EXISTS(SELECT 1 FROM creator_check))
    `;
    await client.query(todoQuery, [userId, familyId, todoId]);

    await client.query("COMMIT");
    revalidatePath(`/families/${familyId}`);
    revalidatePath(`/families/${familyId}/todos/${todoId}`);
  } catch (err) {
    // XXX TODO XXX
    // log this
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export const getTasks = cache(async (familyId: number, todoId: number) => {
  try {
    const userId = await getUserId();

    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      SELECT id, created_by, assigned_to, created_at, title, details, due_by, done
      FROM tasks
      WHERE todo_list_id = $3
      AND EXISTS(SELECT 1 FROM member_check)
      ORDER BY due_by
    `;

    const result = await pool.query(query, [userId, familyId, todoId]);

    const tasks: TaskInterface[] = [];

    result.rows.forEach((row) => {
      const task: TaskInterface = {
        id: row.id as number,
        todoListId: row.todo_list_id as number,
        createdBy: row.created_by as number,
        createdAt: new Date(row.created_at as string),
        title: row.title as string,
        done: row.done as boolean,
      };
      // optional fields
      if (row.assigned_to) {
        task.assignedTo = row.assigned_to as number;
      }
      if (row.details) {
        task.details = row.details as string;
      }
      if (row.due_by) {
        task.dueBy = new Date(row.due_by as string);
      }
      tasks.push(task);
    });
    return tasks;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
});

export const getTodoListInfo = cache(
  async (familyId: number, todoId: number) => {
    try {
      const userId = await getUserId();

      const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      SELECT created_at, created_by, title, description 
      FROM todo_lists 
      WHERE id = $3
      AND family_id = $2
      AND EXISTS(SELECT 1 FROM member_check)
    `;

      const result = await pool.query(query, [userId, familyId, todoId]);
      if (result.rowCount) {
        const row = result.rows[0];
        const todoList: TodoListInterface = {
          id: todoId,
          createdAt: row.created_at as Date,
          createdBy: row.created_by as number,
          familyId: familyId,
          title: row.title as string,
        };
        if (row.description) {
          todoList.description = row.description as string;
        }
        return todoList;
      }
      return notFound();
    } catch (err) {
      // XXX TODO XXX
      // log this
      throw err;
    }
  },
);

export const getTodoListSummaries = cache(async (familyId: number) => {
  try {
    const userId = await getUserId();

    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      SELECT todo_lists.id, todo_lists.title,
      COUNT(tasks.id)
      AS task_count
      FROM todo_lists
      LEFT JOIN tasks
      ON tasks.todo_list_id = todo_lists.id
      WHERE todo_lists.family_id = $2
      AND EXISTS(SELECT 1 FROM member_check)
      GROUP BY todo_lists.id
    `;

    const result = await pool.query(query, [userId, familyId]);

    const todoListSummaries: TodoListSummary[] = [];

    result.rows.forEach((row) => {
      const summary: TodoListSummary = {
        id: row.id as number,
        taskCount: +row.task_count as number,
        title: row.title as string,
      };
      todoListSummaries.push(summary);
    });

    return todoListSummaries;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
});

export async function toggleTaskDone(
  familyId: number,
  todoId: number,
  taskId: number,
) {
  try {
    const userId = await getUserId();

    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      ),
      family_check AS (
        SELECT 1
        FROM todo_lists
        WHERE id = $3
        AND family_id = $2
      ),
      allowed_check AS (
        SELECT 1
        FROM tasks
        WHERE id = $4
        AND (assigned_to = $1 OR assigned_to IS NULL)
      )
      UPDATE tasks SET done = NOT done
      WHERE tasks.id = $4
      AND EXISTS(SELECT 1 FROM member_check)
      AND EXISTS(SELECT 1 FROM family_check)
      AND EXISTS(SELECT 1 FROM allowed_check)
    `;

    const result = await pool.query(query, [userId, familyId, todoId, taskId]);

    if (result.rowCount) {
      revalidatePath(`/families/${familyId}/todos/${todoId}`);
    }
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
}
