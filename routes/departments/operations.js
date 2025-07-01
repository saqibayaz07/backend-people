'use strict';

const { departments, peoples } = require('../../models'); // Assuming the model is in the models directory

// get uuid from validator 
const { isUUID } = require('validator');
// Create a new department
/*
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a new department
 *     description: This endpoint allows the creation of a new department with the provided name, manager, and description.
 *     operationId: createDepartment
 *     tags:
 *       - departments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the department
 *                 example: "Engineering"
 *               manager_id:
 *                 type: string
 *                 description: The ID of the department's manager (optional, if applicable)
 *                 example: "c4b4fd00-2c56-4cfd-bb7d-2d74f6d5c74f"
 *               description:
 *                 type: string
 *                 description: A brief description of the department
 *                 example: "Responsible for all engineering-related tasks."
 *     responses:
 *       201:
 *         description: Department successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the department
 *                   example: "fda4fd20-7cfd-4c35-bd8f-1c3b5d45d0fd"
 *                 name:
 *                   type: string
 *                   description: The name of the department
 *                   example: "Engineering"
 *                 manager_id:
 *                   type: string
 *                   description: The ID of the department's manager (optional)
 *                   example: "c4b4fd00-2c56-4cfd-bb7d-2d74f6d5c74f"
 *                 description:
 *                   type: string
 *                   description: A brief description of the department
 *                   example: "Responsible for all engineering-related tasks."
 *       500:
 *         description: Error creating department
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A description of the error
 *                   example: "Error creating department: Some error message"
 */
const createDepartment = async (req, res) => {

  const { name, manager_id, description } = req.body;
  try {
    // manager validations
    if (manager_id === null) {
      // return res.status(400).json({ error: 'Invalid or missing manager_id' });
    } else if (!isUUID(manager_id) && manager_id !== null) {
      return res.status(400).json({ error: 'Invalid manager_id format' });
    }
    else {
      const manager = await peoples.findByPk(manager_id);
      if (!manager) {
        return res.status(404).json({ error: 'Manager People not found' });
      }
    }


    // department validations
    if (!name) {
      return res.status(400).json({ error: 'Invalid or missing name' });
    }
    const existingName = await departments.findOne({ where: { name } });
    if (existingName) {
      return res.status(400).json({ error: 'Department with this name already exists' });
    }


    const department = await departments.create({ name, manager_id, description });

    return res.status(201).json(department); // Respond with the newly created department
  } catch (error) {
    return res.status(500).json({ error: 'Error creating department: ' + error.message });
  }
};


// Function to create multiple departments
/*
 * @swagger
 * /departments/bulk:
 *   post:
 *     summary: Create multiple departments
 *     description: This endpoint allows the creation of multiple departments at once. The request body should contain an array of department objects.
 *     operationId: createDepartments
 *     tags:
 *       - departments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - name
 *                 - description
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the department
 *                   example: "Engineering"
 *                 manager_id:
 *                   type: string
 *                   description: The ID of the department's manager (optional, if applicable). Must be a valid UUID.
 *                   example: "c4b4fd00-2c56-4cfd-bb7d-2d74f6d5c74f"
 *                 description:
 *                   type: string
 *                   description: A brief description of the department
 *                   example: "Responsible for all engineering-related tasks."
 *     responses:
 *       201:
 *         description: departments successfully created
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
 *                   manager_id:
 *                     type: string
 *                     description: The ID of the department's manager (optional)
 *                     example: "c4b4fd00-2c56-4cfd-bb7d-2d74f6d5c74f"
 *                   description:
 *                     type: string
 *                     description: A description of the department
 *                     example: "Responsible for all engineering-related tasks."
 *       400:
 *         description: Bad Request. Invalid or missing department information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Department name and description are required."
 *       404:
 *         description: Not Found. The manager_id does not exist in the peoples table.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Manager with ID c4b4fd00-2c56-4cfd-bb7d-2d74f6d5c74f does not exist in the People table."
 */
const createDepartments = async (req, res) => {
  const depts = req.body; // Array of department objects
  try {
    // Validate input
    if (!Array.isArray(depts) || depts.length === 0) {
      return res.status(400).json({ error: 'Request body must be an array of departments.' });
    }

    // Loop through each department and validate manager_id
    for (let dept of depts) {
      const { name, manager_id, description } = dept;

      // Validate that name and description are not empty
      if (!name || !description) {
        return res.status(400).json({ error: 'Department name and description are required.' });
      }

      // Validate manager_id if provided
      // if (manager_id !== null) {
      //   if (!isUUID(manager_id)) {
      //     dept.manager_id = "00000000-0000-0000-0000-000000000000"; // Assign default UUID
      //   } else {
      //     // Check if the manager_id exists in the People table (assuming you have a 'peoples' model)
      //     const manager = await peoples.findOne({ where: { id: manager_id } });
      //     if (!manager) {
      //       return res.status(404).json({ error: `Manager with ID ${manager_id} does not exist in the People table.` });
      //     }
      //   }
      // } else {
      //   // If manager_id is not provided, set it to null
      //   dept.manager_id = null;
      // }
    }

    // Create departments in the database (you'll need to call the appropriate model method)
    await departments.bulkCreate(departments);  // Assuming you have a 'Department' model

    res.status(201).json({ message: 'Departments created successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


// Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const depts = await departments.findAll();
    return res.status(200).json({ success: true, messsage: 'All Departments', data: depts }); // Respond with the list of departments
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching departments: ' + error.message });
  }
};

// Get a department by ID
/*
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     description: This endpoint retrieves a department by its unique identifier (ID).
 *     operationId: getDepartmentById
 *     tags:
 *       - departments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the department to retrieve
 *         schema:
 *           type: string
 *           example: "fda4fd20-7cfd-4c35-bd8f-1c3b5d45d0fd"
 *     responses:
 *       200:
 *         description: Department data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the department
 *                   example: "fda4fd20-7cfd-4c35-bd8f-1c3b5d45d0fd"
 *                 name:
 *                   type: string
 *                   description: The name of the department
 *                   example: "Engineering"
 *                 description:
 *                   type: string
 *                   description: A brief description of the department
 *                   example: "Responsible for all engineering-related tasks."
 *                 manager_id:
 *                   type: string
 *                   description: The ID of the department's manager (optional, if applicable)
 *                   example: "c4b4fd00-2c56-4cfd-bb7d-2d74f6d5c74f"
 *       404:
 *         description: Department not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Department not found"
 *       500:
 *         description: Error fetching department
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching department: <error_message>"
 */
const getDepartmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await departments.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    return res.status(200).json(department); // Respond with the department data
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching department: ' + error.message });
  }
};

// Update a department by ID
/*
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update department by ID
 *     description: This endpoint updates an existing department by its unique identifier (ID).
 *     operationId: updateDepartment
 *     tags:
 *       - departments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the department to update
 *         schema:
 *           type: string
 *           example: "fda4fd20-7cfd-4c35-bd8f-1c3b5d45d0fd"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the department
 *                 example: "Engineering"
 *               manager_id:
 *                 type: string
 *                 description: The ID of the department's manager (optional)
 *                 example: "c4b4fd00-2c56-4cfd-bb7d-2d74f6d5c74f"
 *               description:
 *                 type: string
 *                 description: A brief description of the department
 *                 example: "Responsible for all engineering-related tasks."
 *     responses:
 *       200:
 *         description: Department updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the department
 *                   example: "fda4fd20-7cfd-4c35-bd8f-1c3b5d45d0fd"
 *                 name:
 *                   type: string
 *                   description: The updated name of the department
 *                   example: "Engineering"
 *                 description:
 *                   type: string
 *                   description: The updated description of the department
 *                   example: "Responsible for all engineering-related tasks."
 *                 manager_id:
 *                   type: string
 *                   description: The updated manager ID of the department
 *                   example: "c4b4fd00-2c56-4cfd-bb7d-2d74f6d5c74f"
 *       404:
 *         description: Department not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Department not found"
 *       500:
 *         description: Error updating department
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error updating department: <error_message>"
 */
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, manager_id, description } = req.body;
  try {
    const department = await departments.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    await department.update({ name, manager_id, description });
    return res.status(200).json(department); // Respond with the updated department
  } catch (error) {
    return res.status(500).json({ error: 'Error updating department: ' + error.message });
  }
};

// Update a department's manager ID by ID
const updateManagerId = async (req, res) => {
  const { id } = req.params;
  const { manager_id } = req.body;

  // Validate that the manager_id is provided
  if (manager_id === undefined || manager_id === null) {
    return res.status(400).json({ error: 'Manager ID is required.' });
  }

  try {
    const department = await departments.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Update only the manager_id field
    await department.patch({ manager_id });

    return res.status(200).json({ message: 'Manager ID updated successfully', department });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating manager ID: ' + error.message });
  }
};


// Delete a department by ID
/*
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete a department by ID
 *     description: This endpoint deletes an existing department by its unique identifier (ID).
 *     operationId: deleteDepartment
 *     tags:
 *       - departments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the department to delete
 *         schema:
 *           type: string
 *           example: "fda4fd20-7cfd-4c35-bd8f-1c3b5d45d0fd"
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the department was deleted
 *                   example: "Department deleted successfully"
 *       404:
 *         description: Department not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message when the department is not found
 *                   example: "Department not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message in case of server issues
 *                   example: "Error deleting department: <error-message>"
 */
const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await departments.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    await department.destroy(); // Delete the department
    return res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting department: ' + error.message });
  }
};

module.exports = {
  createDepartment,
  createDepartments,

  getAllDepartments,
  getDepartmentById,

  updateDepartment,
  updateManagerId,

  deleteDepartment,
};
