'use strict';

const express = require('express');
const router = express.Router();

// Import the departments' operations (functions)
const {
  createDepartment,
  createDepartments,

  getAllDepartments,
  getDepartmentById,

  updateDepartment,
  updateManagerId,

  deleteDepartment,
} = require('./operations.js');

// Route for creating a new department
router.post('/add', createDepartment);

// Route for getting all departments
/**
 * @swagger
 * /department/get:
 *   get:
 *     summary: Get all departments
 *     description: This endpoint retrieves a list of all departments.
 *     operationId: getAllDepartments
 *     tags:
 *       - Departments
 *     responses:
 *       200:
 *         description: A list of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the department
 *                     example: "fda4fd20-7cfd-4c35-bd8f-1c3b5d45d0fd"
 *                   name:
 *                     type: string
 *                     description: The name of the department
 *                     example: "Engineering"
 *                   description:
 *                     type: string
 *                     description: A brief description of the department
 *                     example: "Responsible for all engineering-related tasks."
 *                   manager_id:
 *                     type: string
 *                     description: The ID of the department's manager (optional, if applicable)
 *                     example: "c4b4fd00-2c56-4cfd-bb7d-2d74f6d5c74f"
 *       500:
 *         description: Error fetching departments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching departments: <error_message>"
 */
router.get('/get', getAllDepartments);

// Route for creating multiple departments
router.post('/multiple/add', createDepartments);

// Route for getting a department by ID
router.get('/get/:id', getDepartmentById);

// Route for updating a department by ID
router.put('/update/:id', updateDepartment);

// Route for updating a department's manager by ID
router.patch('/manager/update/:id', updateManagerId);

// Route for deleting a department by ID
router.delete('/delete/:id', deleteDepartment);

module.exports = router;
