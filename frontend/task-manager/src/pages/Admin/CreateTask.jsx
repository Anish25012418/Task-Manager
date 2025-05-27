import React, {useState} from 'react';
import DashboardLayout from "../../components/layouts/DashboardLayout.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {LuTrash2} from "react-icons/lu";
import {PRIORITY_DATA} from "../../utils/data.js";
import SelectDropdown from "../../components/inputs/SelectDropdown.jsx";
import SelectUsers from "../../components/inputs/SelectUsers.jsx";
import TodoListInput from "../../components/inputs/TodoListInput.jsx";
import AddAttachmentsInput from "../../components/inputs/AddAttachmentsInput.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import {API_PATHS} from "../../utils/apiPaths.js";
import toast from "react-hot-toast";

const CreateTask = () => {
  const location = useLocation();
  const {taskId} = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: []
  });

  const [currentTask, setCurrentTask] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleChange = (name, value) => {
    setTaskData((prevState) => ({...prevState, [name]: value}));
  }

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: []
    })
  }

  const createTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }))

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData, dueDate: new Date(taskData.dueDate).toISOString(), todoChecklist: todolist
      });

      toast.success("Task Created Successfully!");
      clearData()
    } catch (error) {
      console.error("Error creating task", error);
    } finally {
      setLoading(false);
    }
  }

  const updateTask = async () => {
  }

  const handleSubmit = async () => {
    setError(null)

    console.log(taskData)

    if (!taskData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (!taskData.dueDate) {
      setError("Due date is required");
      return;
    }
    if (taskData.assignedTo?.length === 0) {
      setError("Task not assigned to any member");
      return;
    }
    if (taskData.todoChecklist?.length === 0) {
      setError("Add at least one todo task");
      return;
    }

    if (taskId){
      updateTask();
      return;
    }

    createTask()
  }

  const getTaskDetailsById = async () => {
  }

  const deleteTask = async () => {
  }

  return (
    <DashboardLayout activeMenu="Create Tasks">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert((prevState) => !prevState)}>
                  <LuTrash2 className="text-base"/> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">Task Title</label>
              <input placeholder="Title"
                     className="form-input"
                     name='title'
                     value={taskData.title}
                     onChange={({target}) => handleChange(target.name, target.value)}
                     type="text"/>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Description</label>
              <textarea placeholder="Describe task"
                        className="form-input"
                        name='description'
                        rows={4}
                        value={taskData.description}
                        onChange={({target}) => handleChange(target.name, target.value)}
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Priority</label>
                <SelectDropdown options={PRIORITY_DATA} value={taskData.priority}
                                onChange={(value) => handleChange("priority", value)} placeholder="Select Priority"/>
              </div>
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Due Date</label>
                <input placeholder="Due Date" name="dueDate" value={taskData.dueDate} onChange={({target}) => handleChange(target.name, target.value)}
                       className="form-input" type="date"/>
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">Assign To</label>
                <SelectUsers selectedUsers={taskData.assignedTo}
                             onChange={(value) => handleChange("assignedTo", value)}/>
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">TODO Checklist</label>
              <TodoListInput todoList={taskData?.todoChecklist} onChange={(value) => handleChange("todoChecklist", value)}/>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Add Attachments</label>
              <AddAttachmentsInput attachments={taskData.attachments} onChange={(value) => handleChange("attachments", value)}/>
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button className="add-btn" onClick={handleSubmit} disabled={loading}>
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;