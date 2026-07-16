import { useState } from "react";
import { createBulkTodos } from "../api/todoApi";

const BulkTodoCreate = ({ isOpen, onClose, onTodosCreated }) => {
  const [todos, setTodos] = useState([
    { title: "", description: "", priority: "low", dueDate: "" },
  ]);
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  if (!isOpen) return null;

  const addTodo = () => {
    setTodos([...todos, { title: "", description: "", priority: "low", dueDate: "" }]);
  };

  const removeTodo = (index) => {
    if (todos.length > 1) {
      const newTodos = [...todos];
      newTodos.splice(index, 1);
      setTodos(newTodos);
    }
  };

  const updateTodo = (index, field, value) => {
    const newTodos = [...todos];
    newTodos[index] = { ...newTodos[index], [field]: value };
    setTodos(newTodos);
  };

  const handleBulkCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    const validTodos = todos.filter(
      (t) => t.title.trim() && t.description.trim()
    );
    if (validTodos.length === 0) {
      setFormError("At least one todo with title and description is required.");
      return;
    }

    setCreating(true);
    try {
      const todosData = validTodos.map((t) => ({
        title: t.title.trim(),
        description: t.description.trim(),
        priority: t.priority,
        dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : null,
      }));

      await createBulkTodos(todosData);
      setTodos([{ title: "", description: "", priority: "low", dueDate: "" }]);
      onClose();
      onTodosCreated();
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to create bulk todos"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl bg-black border border-neutral-800 p-8 my-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">Create Bulk Tasks</h2>
          <button
            onClick={() => {
              setTodos([{ title: "", description: "", priority: "low", dueDate: "" }]);
              setFormError("");
              onClose();
            }}
            className="text-neutral-500 hover:text-white transition text-xs font-bold uppercase tracking-widest"
          >
            [ CLOSE ]
          </button>
        </div>

        {formError && (
          <div className="mb-6 p-3 border border-white text-white text-xs uppercase tracking-widest font-bold">
            {formError}
          </div>
        )}

        <form onSubmit={handleBulkCreate} className="space-y-6">
          {todos.map((todo, index) => (
            <div
              key={index}
              className="border border-neutral-800 p-6 space-y-4"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-neutral-400 text-xs uppercase tracking-widest font-bold">
                  Task #{index + 1}
                </span>
                {todos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTodo(index)}
                    className="text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-widest transition"
                  >
                    [ REMOVE ]
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                    Title
                  </label>
                  <input
                    type="text"
                    value={todo.title}
                    onChange={(e) => updateTodo(index, "title", e.target.value)}
                    placeholder="ENTER TITLE..."
                    maxLength={100}
                    className="w-full px-4 py-3 border border-neutral-800 bg-black text-sm uppercase tracking-wider text-white placeholder-neutral-700 focus:outline-none focus:border-white transition"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                    Description
                  </label>
                  <textarea
                    value={todo.description}
                    onChange={(e) => updateTodo(index, "description", e.target.value)}
                    placeholder="ENTER DETAILS..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-neutral-800 bg-black text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-white transition resize-none font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                    Priority
                  </label>
                  <select
                    value={todo.priority}
                    onChange={(e) => updateTodo(index, "priority", e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-800 bg-black text-xs uppercase tracking-wider text-neutral-300 focus:outline-none focus:border-white appearance-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={todo.dueDate}
                    onChange={(e) => updateTodo(index, "dueDate", e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-800 bg-black text-xs uppercase tracking-wider text-neutral-300 focus:outline-none focus:border-white transition"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-6 border-t border-neutral-900">
            <button
              type="button"
              onClick={addTodo}
              className="px-6 py-3 border border-neutral-800 font-bold text-xs uppercase tracking-widest text-neutral-400 hover:text-white hover:border-white transition"
            >
              [ + ADD TASK ]
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setTodos([{ title: "", description: "", priority: "low", dueDate: "" }]);
                  setFormError("");
                  onClose();
                }}
                className="px-6 py-3 border border-neutral-800 font-bold text-xs uppercase tracking-widest text-neutral-400 hover:text-white hover:border-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="bg-white text-black px-8 py-3 font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition disabled:opacity-45"
              >
                {creating ? "Creating..." : "Confirm Bulk Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkTodoCreate;
