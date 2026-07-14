import { useState, useEffect, useCallback, useRef } from "react";
import { fetchTodos } from "../api/todoApi";

const DEBOUNCE_MS = 400;

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    overdue: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  // debounce timer ref
  const timerRef = useRef(null);

  const load = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTodos(params);
      setTodos(data.todos);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  }, []);

  // debounced effect on filters
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      load(filters);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [filters, load]);

  // update a specific filter (resets page to 1 except page updates)
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" ? { page: 1 } : {}),
    }));
  }, []);

  const setPage = useCallback((p) => {
    setFilters((prev) => ({ ...prev, page: p }));
  }, []);

  return { todos, pagination, loading, error, filters, updateFilter, setPage };
}
