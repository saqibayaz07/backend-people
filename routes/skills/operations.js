const { skills } = require('../../models'); // Assuming you have a `skills` model


// Create a new record
/**
 * @swagger
 * /skills:
 *   post:
 *     summary: Create a new skill
 *     description: This endpoint allows for the creation of a new skill with the provided name, description, and category.
 *     operationId: createSkill
 *     tags:
 *       - skills
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the skill
 *                 example: "JavaScript"
 *               description:
 *                 type: string
 *                 description: A description of the skill
 *                 example: "A high-level programming language used for web development."
 *               category:
 *                 type: string
 *                 description: The category of the skill
 *                 example: "Programming Languages"
 *     responses:
 *       201:
 *         description: Skill successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique ID of the created skill
 *                   example: "c4b4fd00-2c56-4cfd-bb7d-2d74f6d5c74f"
 *                 name:
 *                   type: string
 *                   description: The name of the skill
 *                   example: "JavaScript"
 *                 description:
 *                   type: string
 *                   description: A description of the skill
 *                   example: "A high-level programming language used for web development."
 *                 category:
 *                   type: string
 *                   description: The category of the skill
 *                   example: "Programming Languages"
 *       400:
 *         description: Bad request due to invalid input
 */
const createSkillRecord  = async (req, res) => {
  const { name, description } = req.body;

  // Validate required fields
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  try {
    // Create the record
    const record = await skills.create({ name, description });
    return res.status(201).json(record); // Respond with the newly created record
  } catch (error) {
    return res.status(500).json({ error: 'Error creating record: ' + error });
  }
};


// Bulk create records
/**
 * @swagger
 * /records/bulk:
 *   post:
 *     summary: Bulk create records
 *     description: This endpoint allows the bulk creation of multiple records at once.
 *     operationId: bulkCreateSkillRecord 
 *     tags:
 *       - SkillRecord 
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
 *                 - category
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the record.
 *                   example: "JavaScript"
 *                 description:
 *                   type: string
 *                   description: A description of the record.
 *                   example: "A high-level programming language."
 *                 category:
 *                   type: string
 *                   description: The category of the record.
 *                   example: "Programming Languages"
 *     responses:
 *       201:
 *         description: skills successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier for the created record.
 *                   name:
 *                     type: string
 *                     description: The name of the record.
 *                   description:
 *                     type: string
 *                     description: The description of the record.
 *                   category:
 *                     type: string
 *                     description: The category of the record.
 *       400:
 *         description: Bad Request. Invalid or missing records array.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You must provide an array of records"
 *       500:
 *         description: Internal Server Error when bulk creation fails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error bulk creating records: <error_message>"
 */
const bulkCreateSkillRecord = async (req, res) => {
  const records = req.body; // Expected to be an array of records

  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ error: 'You must provide an array of records' });
  }

  try {
    const createdSkillRecord = await skills.bulkCreate(records);
    return res.status(201).json(createdSkillRecord ); // Respond with the newly created records
  } catch (error) {
    return res.status(500).json({ error: 'Error bulk creating records: ' + error });
  }
};


// Get all records
/**
 * @swagger
 * /skills:
 *   get:
 *     summary: Get a list of all skills
 *     description: This endpoint retrieves all the skills from the database.
 *     operationId: getAllSkills
 *     tags:
 *       - skills
 *     responses:
 *       200:
 *         description: A list of all skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique ID of the skill
 *                   name:
 *                     type: string
 *                     description: The name of the skill
 *                   description:
 *                     type: string
 *                     description: The description of the skill
 *                   category:
 *                     type: string
 *                     description: The category of the skill
 *       500:
 *         description: Internal server error
 */
const getAllSkillRecord = async (req, res) => {
  try {
    const records = await skills.findAll();
    if(records.length === 0) {
      return res.status(404).json({ error: 'No Skills records found' });
    }
    return res.json(records); // Return all records
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching records: ' + error });
  }
};


// Get a record by UUID
/**
 * @swagger
 * /skills/{id}:
 *   get:
 *     summary: Get a specific skill by ID
 *     description: This endpoint retrieves a specific skill by its unique ID.
 *     operationId: getSkillById
 *     tags:
 *       - skills
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the skill to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The skill corresponding to the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique ID of the skill
 *                 name:
 *                   type: string
 *                   description: The name of the skill
 *                 description:
 *                   type: string
 *                   description: The description of the skill
 *                 category:
 *                   type: string
 *                   description: The category of the skill
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Internal server error
 */
const getSkillRecordById = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await skills.findOne({ where: { id } });
    if (!record) {
      return res.status(404).json({ error: 'SkillRecord not found' });
    }
    return res.json(record); // Return the found record
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching record: ' + error });
  }
};

// Get skills by Category
const getSkillsByCategory = async (req, res) => {
  const { category } = req.query; // Getting the category from the query parameters

  try {
    if (!category) {
      return res.status(400).json({ error: 'Category parameter is required' });
    }

    // Fetch records where category matches the query parameter
    const records = await skills.findAll({ where: { category } });

    if (records.length === 0) {
      return res.status(404).json({ error: `No records found for category: ${category}` });
    }

    return res.json(records); // Return the filtered records
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching records: ' + error });
  }
};



// Update a record by UUID
/**
 * @swagger
 * /skills/{id}:
 *   put:
 *     summary: Update an existing skill
 *     description: This endpoint allows updating a skill's name, description, and category.
 *     operationId: updateSkill
 *     tags:
 *       - skills
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the skill to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the skill
 *               description:
 *                 type: string
 *                 description: The description of the skill
 *               category:
 *                 type: string
 *                 description: The category of the skill
 *     responses:
 *       200:
 *         description: Skill successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique ID of the updated skill
 *                 name:
 *                   type: string
 *                   description: The updated name of the skill
 *                 description:
 *                   type: string
 *                   description: The updated description of the skill
 *                 category:
 *                   type: string
 *                   description: The updated category of the skill
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Internal server error
 */
const updateSkillRecord = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  try {
    const record = await skills.findOne({ where: { id } });
    if (!record) {
      return res.status(404).json({ error: 'SkillRecord not found' });
    }

    // Update the record
    record.name = name;
    record.description = description;
    await record.save();
    return res.json(record); // Return the updated record
  } catch (error) {
    return res.status(500).json({ error: 'Error updating record: ' + error });
  }
};


// Delete a record by UUID
/**
 * @swagger
 * /skills/{id}:
 *   delete:
 *     summary: Delete a skill by ID
 *     description: This endpoint deletes a skill by its unique ID.
 *     operationId: deleteSkill
 *     tags:
 *       - skills
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the skill to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill successfully deleted
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Internal server error
 */
const deleteSkillRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await skills.findOne({ where: { id } });
    if (!record) {
      return res.status(404).json({ error: 'SkillRecord not found' });
    }

    // Delete the record
    await record.destroy();
    return res.status(204).send(); // Respond with no content (record deleted)
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting record: ' + error });
  }
};


module.exports = {
  createSkillRecord,
  bulkCreateSkillRecord ,
  getAllSkillRecord ,
  getSkillsByCategory,
  getSkillRecordById,
  updateSkillRecord,
  deleteSkillRecord,
};
