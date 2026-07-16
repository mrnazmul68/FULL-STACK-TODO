import { useState } from "react";
import { createTodo } from "../api/todoApi";

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const CreateTodoModal = ({ isOpen, onClose, onTodoCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("low");
    setDueDate("");
    setFormError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim() || !description.trim()) {
      setFormError("Title and description are required.");
      return;
    }

    setCreating(true);
    try {
      const isoDueDate = dueDate ? new Date(dueDate).toISOString() : null;
      await createTodo({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: isoDueDate,
      });

      setTitle("");
      setDescription("");
      setPriority("low");
      setDueDate("");
      onClose();
      onTodoCreated();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Failed to create task. Check if title is unique.",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-800">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">
              Create New Task
            </h2>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
              Fill in the details below
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral-500 hover:text-white transition text-xs font-bold uppercase tracking-widest"
          >
            [ CLOSE ]
          </button>
        </div>

        <div className="px-8 pt-6">
          {formError && (
            <div className="mb-6 p-3 border border-neutral-700 bg-black text-white text-xs uppercase tracking-widest font-bold">
              ⚠ {formError}
            </div>
          )}
        </div>

        <form onSubmit={handleCreateTodo} className="px-8 pb-8 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Title
              </label>
              <span className="text-[10px] text-neutral-600 tracking-widest">
                {title.length}/100
              </span>
            </div>
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

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Description
              </label>
              <span className="text-[10px] text-neutral-600 tracking-widest">
                {description.length}/500
              </span>
            </div>
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

          {/* Priority + Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Priority
              </label>
              <div className="grid grid-cols-3 border border-neutral-800">
                {PRIORITIES.map(({ value, label }, idx) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPriority(value)}
                    className={`py-3 text-[11px] font-bold uppercase tracking-widest transition ${
                      idx > 0 ? "border-l border-neutral-800" : ""
                    } ${
                      priority === value
                        ? "bg-white text-black"
                        : "bg-black text-neutral-500 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Due Date{" "}
                <span className="text-neutral-600 normal-case">
                  (optional)
                </span>
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-800 bg-black text-xs uppercase tracking-wider text-neutral-300 focus:outline-none focus:border-white transition"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-neutral-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-neutral-800 font-bold text-xs uppercase tracking-widest text-neutral-400 hover:text-white hover:border-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="bg-white text-black px-8 py-3 font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition disabled:opacity-45 disabled:cursor-not-allowed"
            >
              {creating ? "Creating..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTodoModal;