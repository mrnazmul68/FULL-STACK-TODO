import { Todo } from "../model/todo.model.js";

export const createTodoRepository = () => {
  return {
    create: async (todoData) => {
      try {
        const todo = await Todo.create(todoData);
        return {
          todo,
        };
      } catch (err) {
        console.error(err);
      }
    },
  };
};
