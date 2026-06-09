import { createTodoRepository } from "../repositories/todo.repository.js";

export const createTodoService = (todoRepository = createTodoRepository()) => {
  return {
    create: async (todoData) => {
      try {
        return await todoRepository.create(todoData);
      } catch (err) {
        console.error(err.message);
      }
    },
  };
};
