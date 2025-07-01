const { tasks, peoples } = require('../../models'); // Assuming models are in the models directory


const createTask = async (req, res) => {
  try {
    const { title, assignee_id, priority, progress, status, important, tag, description } = req.body;

    const assignee = await peoples.findByPk(assignee_id); // Assuming peoples is the model for people

    if (!assignee) {
      return res.status(404).json({ success: false, message: 'Assignee not found', error: 'Assignee not found' });
    }
    const task = await tasks.create({ title, assignee_id, priority, progress, status, important, tag, description });
    return res.status(201).json({ success: true, message: 'Task created successfully', data: task });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating task', error: error.message });
  }
}


const getAllTasks = async (req, res) => {
  try {
    // return res.status(200).json({ success: true, message: 'Tasks fetched successfully', data: "no data." });
    const task = await tasks.findAll();
    if (task.length === 0) {
      return res.status(404).json({ success: false, message: 'No tasks found', error: 'No tasks found' });
    }
    return res.status(200).json({ success: true, message: 'Tasks fetched successfully', data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving tasks', error: error.message });
  }
}


const getAllImportantTasks = async (req, res) => {
  try {
    const task = await tasks.findAll({ where: { important: true } });
    if (task.length === 0) {
      return res.status(404).json({ success: false, message: 'No important tasks found', error: 'No important tasks found' });
    }
    return res.status(200).json({ success: true, message: 'Important tasks fetched successfully', data: task });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Error while getting all Important Tasks.", error: err.message })
  }
}

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await tasks.findByPk(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found', error: 'Task not found' });
    }
    return res.status(200).json({ success: true, message: 'Task fetched successfully', data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving task', error: error.message });
  }
}

const getTasksByAssigneeId = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await tasks.findAll({ where: { assignee_id: id } });
    if (task.length === 0) {
      return res.status(404).json({ success: false, message: 'No tasks found for the assignee', error: 'No tasks found' });
    }
    return res.status(200).json({ success: true, message: 'Tasks fetched successfully', data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving tasks', error: error.message });
  }
}


const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await tasks.findByPk(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found', error: 'Task not found' });
    }
    const updatedTask = await task.update(req.body);
    return res.status(200).json({ success: true, message: 'Task updated successfully', data: updatedTask });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating task', error: error.message });
  }
}

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await tasks.findByPk(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found', error: 'Task not found' });
    }
    await task.destroy();
    return res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting task', error: error.message });
  }
}

module.exports = { createTask, getAllTasks, getAllImportantTasks, getTaskById, getTasksByAssigneeId, updateTask, deleteTask };