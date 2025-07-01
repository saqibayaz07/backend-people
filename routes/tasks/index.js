const express = require('express');

const router = express.Router();


const {
  createTask,
  getAllTasks,
  getTaskById,
  getAllImportantTasks,
  getTasksByAssigneeId,
  updateTask,
  deleteTask
} = require('./operations');

/**
 * @swagger
 * /task/add:
 *   post:
 *     summary: Create a new task
 *     description: Creates a new task and assigns it to an assignee.
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the task
 *                 example: "Complete project report"
 *                 required: true
 *               assignee_id:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the person assigned to the task
 *                 example: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                 required: true
 *               priority:
 *                 type: string
 *                 description: Priority level of the task
 *                 example: "High"
 *               progress:
 *                 type: number
 *                 format: float
 *                 description: Progress percentage of the task (0-100)
 *                 example: 50
 *               status:
 *                 type: string
 *                 description: Current status of the task
 *                 enum: [inbox, done, trash]
 *                 default: "inbox"
 *                 required: true
 *               important:
 *                 type: boolean
 *                 description: Indicates if the task is important
 *                 default: false
 *                 example: true
 *               tag:
 *                 type: string
 *                 description: Tag categorizing the task
 *                 enum: [low, medium, high, update, team]
 *                 example: "team"
 *               description:
 *                 type: string
 *                 description: Description of the task
 *                 example: "Prepare and submit the final project report by the deadline."
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Task created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "b2c3d4e5-f6g7-8901-hijk-1234567890lm"
 *                     title:
 *                       type: string
 *                       example: "Complete project report"
 *                     assignee_id:
 *                       type: string
 *                       format: uuid
 *                       example: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                     priority:
 *                       type: string
 *                       example: "High"
 *                     progress:
 *                       type: number
 *                       example: 50
 *                     status:
 *                       type: string
 *                       example: "inbox"
 *                     important:
 *                       type: boolean
 *                       example: true
 *                     tag:
 *                       type: string
 *                       example: "team"
 *                     description:
 *                       type: string
 *                       example: "Prepare and submit the final project report by the deadline."
 *       404:
 *         description: Assignee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Assignee not found"
 *                 error:
 *                   type: string
 *                   example: "Assignee not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error creating task"
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/add', createTask);

/**
 * @swagger
 * /task/get:
 *   get:
 *     summary: Retrieve all tasks
 *     description: Fetches all tasks from the database. Returns an array of tasks if they exist, or an appropriate error message if no tasks are found.
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: Successfully fetched all tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tasks fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                       title:
 *                         type: string
 *                         example: "Complete project report"
 *                       assignee_id:
 *                         type: string
 *                         format: uuid
 *                         example: "b2c3d4e5-f6g7-8901-hijk-1234567890lm"
 *                       tag:
 *                         type: string
 *                         example: "team"
 *                       priority:
 *                         type: string
 *                         example: "High"
 *                       description:
 *                         type: string
 *                         example: "Prepare and submit the final project report by the deadline."
 *                       progress:
 *                         type: number
 *                         example: 50
 *                       status:
 *                         type: string
 *                         example: "inbox"
 *                       important:
 *                         type: boolean
 *                         example: true
 *       404:
 *         description: No tasks found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No tasks found"
 *                 error:
 *                   type: string
 *                   example: "No tasks found"
 *       500:
 *         description: Error retrieving tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error retrieving tasks"
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/get', getAllTasks);

/**
 * @swagger
 * /task/get/{id}:
 *   get:
 *     summary: Retrieve a task by ID
 *     description: Fetches a specific task from the database using its unique ID.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The UUID of the task to fetch
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully fetched the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Task fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "b2c3d4e5-f6g7-8901-hijk-1234567890lm"
 *                     title:
 *                       type: string
 *                       example: "Update project milestone"
 *                     assignee_id:
 *                       type: string
 *                       format: uuid
 *                       example: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                     priority:
 *                       type: string
 *                       example: "High"
 *                     progress:
 *                       type: number
 *                       example: 50
 *                     status:
 *                       type: string
 *                       example: "inbox"
 *                     important:
 *                       type: boolean
 *                       example: true
 *                     tag:
 *                       type: string
 *                       example: "update"
 *                     description:
 *                       type: string
 *                       example: "Update the milestone report for the client."
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Task not found"
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 *       500:
 *         description: Error retrieving the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error retrieving task"
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/get/:id', getTaskById);

/**
 * @swagger
 * /task/important/get:
 *   get:
 *     summary: Retrieve all important tasks
 *     description: Fetches all tasks marked as important from the database. Returns an array of important tasks if they exist, or an appropriate error message if no tasks are found.
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: Successfully fetched all important tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Important tasks fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                       title:
 *                         type: string
 *                         example: "Complete project report"
 *                       assignee_id:
 *                         type: string
 *                         format: uuid
 *                         example: "b2c3d4e5-f6g7-8901-hijk-1234567890lm"
 *                       tag:
 *                         type: string
 *                         example: "team"
 *                       priority:
 *                         type: string
 *                         example: "High"
 *                       description:
 *                         type: string
 *                         example: "Prepare and submit the final project report by the deadline."
 *                       progress:
 *                         type: number
 *                         example: 50
 *                       status:
 *                         type: string
 *                         example: "inbox"
 *                       important:
 *                         type: boolean
 *                         example: true
 *       404:
 *         description: No important tasks found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No important tasks found"
 *                 error:
 *                   type: string
 *                   example: "No important tasks found"
 *       500:
 *         description: Error retrieving important tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error while getting all Important Tasks."
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/important/get', getAllImportantTasks);

/**
 * @swagger
 * /task/assignee/get/{id}:
 *   get:
 *     summary: Retrieve tasks by assignee ID
 *     description: Fetches all tasks assigned to a specific assignee based on their ID.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The UUID of the assignee
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully fetched tasks for the assignee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tasks fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                       title:
 *                         type: string
 *                         example: "Complete project report"
 *                       assignee_id:
 *                         type: string
 *                         format: uuid
 *                         example: "b2c3d4e5-f6g7-8901-hijk-1234567890lm"
 *                       tag:
 *                         type: string
 *                         example: "team"
 *                       priority:
 *                         type: string
 *                         example: "High"
 *                       description:
 *                         type: string
 *                         example: "Prepare and submit the final project report by the deadline."
 *                       progress:
 *                         type: number
 *                         example: 50
 *                       status:
 *                         type: string
 *                         example: "inbox"
 *                       important:
 *                         type: boolean
 *                         example: true
 *       404:
 *         description: No tasks found for the assignee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No tasks found for the assignee"
 *                 error:
 *                   type: string
 *                   example: "No tasks found"
 *       500:
 *         description: Error retrieving tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error retrieving tasks"
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/assignee/get/:id', getTasksByAssigneeId);

/**
 * @swagger
 * /task/update/{id}:
 *   put:
 *     summary: Update a task
 *     description: Updates an existing task based on its ID. Allows partial updates for any task field.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The UUID of the task to update
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the task
 *                 example: "Update project milestone"
 *               assignee_id:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the person assigned to the task
 *                 example: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *               priority:
 *                 type: string
 *                 description: Priority level of the task
 *                 example: "High"
 *               progress:
 *                 type: number
 *                 format: float
 *                 description: Progress percentage of the task (0-100)
 *                 example: 75
 *               status:
 *                 type: string
 *                 enum: [inbox, done, trash]
 *                 description: Current status of the task
 *                 example: "done"
 *               important:
 *                 type: boolean
 *                 description: Indicates if the task is important
 *                 example: true
 *               tag:
 *                 type: string
 *                 enum: [low, medium, high, update, team]
 *                 description: Tag categorizing the task
 *                 example: "update"
 *               description:
 *                 type: string
 *                 description: Description of the task
 *                 example: "Update the milestone report for the client."
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Task updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "b2c3d4e5-f6g7-8901-hijk-1234567890lm"
 *                     title:
 *                       type: string
 *                       example: "Update project milestone"
 *                     assignee_id:
 *                       type: string
 *                       format: uuid
 *                       example: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                     priority:
 *                       type: string
 *                       example: "High"
 *                     progress:
 *                       type: number
 *                       example: 75
 *                     status:
 *                       type: string
 *                       example: "done"
 *                     important:
 *                       type: boolean
 *                       example: true
 *                     tag:
 *                       type: string
 *                       example: "update"
 *                     description:
 *                       type: string
 *                       example: "Update the milestone report for the client."
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Task not found"
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 *       500:
 *         description: Error updating task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error updating task"
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.put('/update/:id', updateTask);

/**
 * @swagger
 * /task/delete/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes a task from the database based on the provided task ID.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The UUID of the task to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Task deleted successfully"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Task not found"
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 *       500:
 *         description: Error deleting task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error deleting task"
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.delete('/delete/:id', deleteTask);

module.exports = router;