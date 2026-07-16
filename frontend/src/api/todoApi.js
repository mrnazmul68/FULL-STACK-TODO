import axios from "axios";

const API_BASE = "http://localhost:3000/api/v1";

// helper: auth header থেকে token নেওয়া
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET /todos/get-todos with all query params
export const fetchTodos = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined
    )
  );

  const res = await axios.get(`${API_BASE}/todos/get-todos`, {
    headers: authHeaders(),
    params: cleanParams,
  });

  return res.data.data; // { todos, pagination }
};

// POST /todos/create to create a new todo
export const createTodo = async (todoData) => {
  const res = await axios.post(`${API_BASE}/todos/create`, todoData, {
    headers: authHeaders(),
  });
  return res.data.data;
};

// POST /todos/bulk to create bulk todos
export const createBulkTodos = async (todosData) => {
  const res = await axios.post(
    `${API_BASE}/todos/bulk`,
    { todos: todosData },
    { headers: authHeaders() }
  );
  return res.data.data;
};

