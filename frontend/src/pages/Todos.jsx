import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTodos } from "../hooks/useTodos";
import { createTodo } from "../api/todoApi";
import { useNavigate } from "react-router-dom";

const Todos = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // hook state
  const {
    todos,
    pagination,
    loading,
    error,
    filters,
    updateFilter,
    setPage,
  } = useTodos();

  // local form states for adding a todo
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  // local states for filters to show instantly in inputs before debounce triggers hooks
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // sync search local input with debounced hook value
  useEffect(() => {
    updateFilter("search", searchVal);
  }, [searchVal, updateFilter]);

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    setFormError("");
    
    if (!title.trim() || !description.trim()) {
      setFormError("Title and description are required.");
      return;
    }

    setCreating(true);
    try {
      // transform local datetime to ISO if exists
      const isoDueDate = dueDate ? new Date(dueDate).toISOString() : null;
      await createTodo({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: isoDueDate,
      });

      // reset states
      setTitle("");
      setDescription("");
      setPriority("low");
      setDueDate("");
      setShowAddModal(false);
      
      // refresh lists by forcing page 1 filter trigger
      setPage(1);
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to create task. Check if title is unique."
      );
    } finally {
      setCreating(false);
    }
  };

  const getPriorityBadgeColor = (prio) => {
    switch (prio) {
      case "high":
        return "bg-neutral-900 text-white border-neutral-700 uppercase tracking-widest";
      case "medium":
        return "bg-neutral-900 text-neutral-300 border-neutral-800 uppercase tracking-widest";
      default:
        return "bg-neutral-900 text-neutral-400 border-neutral-800 uppercase tracking-widest";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "completed":
        return "border border-neutral-800 text-neutral-500 uppercase tracking-widest";
      case "inactive":
        return "border border-neutral-900 text-neutral-600 uppercase tracking-widest";
      default:
        return "border border-white text-white uppercase tracking-widest";
    }
  };

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date(new Date().setHours(0,0,0,0));
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 pb-24 font-mono antialiased">
      
      {/* Zara Inspired Minimal Header */}
      <header className="border-b border-neutral-900 bg-black sticky top-0 z-15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-black tracking-widest uppercase">
              ZARA <span className="font-light text-xs text-neutral-500 tracking-normal ml-1">FLOW</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <span className="text-xs uppercase tracking-widest text-neutral-400 hidden sm:inline">
              USER / <span className="text-white font-bold">{user?.name || "GUEST"}</span>
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-5 py-2 text-xs font-bold uppercase tracking-widest border border-white hover:bg-white hover:text-black transition duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Top Control Panel */}
        <div className="bg-black border border-neutral-900 p-6 mb-12 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                id="search-input"
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="SEARCH TASKS..."
                className="w-full border border-neutral-800 bg-black px-4 py-3 text-sm text-white placeholder-neutral-600 uppercase tracking-wider focus:outline-none focus:border-white transition"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-white text-black px-8 py-3 font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition duration-200 flex items-center gap-2"
              >
                + New Task
              </button>
            </div>

          </div>

          {/* Filtering controls grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-neutral-900">
            
            {/* Status Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Status</label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value)}
                className="w-full px-3 py-2.5 border border-neutral-800 bg-black text-xs uppercase tracking-wider text-neutral-300 focus:outline-none focus:border-white appearance-none"
              >
                <option value="">All Statuses</option>
                <option value="active">Active / Pending</option>
                <option value="completed">Completed</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Priority Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Priority</label>
              <select
                id="priority-filter"
                value={filters.priority}
                onChange={(e) => updateFilter("priority", e.target.value)}
                className="w-full px-3 py-2.5 border border-neutral-800 bg-black text-xs uppercase tracking-wider text-neutral-300 focus:outline-none focus:border-white appearance-none"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Sort options */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter("sortBy", e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-neutral-800 bg-black text-xs uppercase tracking-wider text-neutral-300 focus:outline-none focus:border-white appearance-none"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
                <button
                  onClick={() => updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
                  className="px-4 border border-neutral-800 bg-black text-neutral-400 hover:text-white hover:border-white transition"
                  title="Toggle Order"
                >
                  {filters.sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>

            {/* Overdue filter */}
            <div className="space-y-2 flex flex-col justify-end">
              <button
                onClick={() => updateFilter("overdue", filters.overdue ? "" : "true")}
                className={`w-full py-2.5 px-4 border text-xs font-bold uppercase tracking-widest transition duration-200 ${
                  filters.overdue
                    ? "bg-white text-black border-white"
                    : "border-neutral-800 text-neutral-400 hover:text-white hover:border-white"
                }`}
              >
                {filters.overdue ? "Overdue Only" : "Show Overdue"}
              </button>
            </div>

          </div>
        </div>

        {/* Global errors */}
        {error && (
          <div className="mb-8 p-4 border border-white text-white text-xs uppercase tracking-widest text-center font-bold">
            [ Error: {error} ]
          </div>
        )}

        {/* Todos Data Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent animate-spin"></div>
            <p className="text-neutral-500 text-xs uppercase tracking-widest">LOADING REPOSITORY...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="border border-neutral-900 p-24 text-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">No tasks found</h3>
            <p className="text-neutral-600 text-xs uppercase tracking-wider mt-3 max-w-sm mx-auto">
              Clear constraints or create a new entry.
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-neutral-900">
              {todos.map((todo) => {
                const isItemOverdue = isOverdue(todo.dueDate) && todo.status === "active";
                return (
                  <div
                    key={todo.id || todo._id}
                    className={`p-8 border-b border-r border-neutral-900 transition-all duration-250 flex flex-col justify-between ${
                      isItemOverdue ? "bg-neutral-950" : "bg-black"
                    }`}
                  >
                    <div>
                      {/* Priority and Status Badges */}
                      <div className="flex items-center justify-between mb-6">
                        <span className={`px-2 py-0.5 text-[10px] font-bold border ${getPriorityBadgeColor(todo.priority)}`}>
                          {todo.priority}
                        </span>
                        
                        <span className={`text-[10px] font-bold ${getStatusBadgeColor(todo.status)}`}>
                          &nbsp;{todo.status}&nbsp;
                        </span>
                      </div>

                      {/* Title & Desc */}
                      <h3 className="text-base font-bold tracking-wider text-white uppercase line-clamp-1">
                        {todo.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-4 line-clamp-3 leading-relaxed tracking-wide font-sans">
                        {todo.description}
                      </p>
                    </div>

                    {/* Metadata Footer */}
                    <div className="mt-8 pt-4 border-t border-neutral-900 flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500">
                      <div>
                        {todo.dueDate ? (
                          <div className="flex items-center gap-2">
                            <span className={isItemOverdue ? "text-white font-bold" : "text-neutral-400"}>
                              DUE: {new Date(todo.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            {isItemOverdue && (
                              <span className="text-white font-black">[OVERDUE]</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-600 italic">No date</span>
                        )}
                      </div>

                      <span className="text-neutral-600">
                        {new Date(todo.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-1">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage(pagination.currentPage - 1)}
                  className="px-6 py-3 border border-neutral-800 text-xs uppercase tracking-widest font-bold text-neutral-400 hover:text-white hover:border-white transition disabled:opacity-20 disabled:pointer-events-none"
                >
                  PREV
                </button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: pagination.totalPages }, (_, idx) => idx + 1).map((pNum) => (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-10 h-10 text-xs font-bold transition ${
                        pNum === pagination.currentPage
                          ? "bg-white text-black border border-white"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {pNum}
                    </button>
                  ))}
                </div>

                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage(pagination.currentPage + 1)}
                  className="px-6 py-3 border border-neutral-800 text-xs uppercase tracking-widest font-bold text-neutral-400 hover:text-white hover:border-white transition disabled:opacity-20 disabled:pointer-events-none"
                >
                  NEXT
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modern Add Todo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-black border border-neutral-800 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">Create New Task</h2>
              <button
                onClick={() => setShowAddModal(false)}
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

            <form onSubmit={handleCreateTodo} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ENTER TITLE..."
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 border border-neutral-800 bg-black text-sm uppercase tracking-wider text-white placeholder-neutral-700 focus:outline-none focus:border-white transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ENTER DETAILS..."
                  required
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-neutral-800 bg-black text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-white transition resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-800 bg-black text-xs uppercase tracking-wider text-neutral-300 focus:outline-none focus:border-white appearance-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Due Date</label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-800 bg-black text-xs uppercase tracking-wider text-neutral-300 focus:outline-none focus:border-white transition"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-neutral-800 font-bold text-xs uppercase tracking-widest text-neutral-400 hover:text-white hover:border-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-white text-black px-8 py-3 font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition disabled:opacity-45"
                >
                  {creating ? "Creating..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Todos;