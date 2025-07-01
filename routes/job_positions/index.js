const express = require('express');

const router = express.Router();

const {
  createJobPosition,
  createJobPositionWithJobSkills,

  getAllJobPositions,
  getAllJobPositionsByDepartment,
  getJobPositionById,
  
  updateJobPosition,
  
  deleteJobPosition
} = require('./operations');


router.post('/add', createJobPosition);
router.post('/job-skills/add', createJobPositionWithJobSkills);

router.get('/get', getAllJobPositions);

/**
 * @swagger
 * /job-position/department/get/{department_id}:
 *   get:
 *     summary: Get all job positions by department
 *     description: Retrieves all job positions associated with a specific department based on the department ID.
 *     tags:
 *       - Job Positions
 *     parameters:
 *       - name: department_id
 *         in: path
 *         description: The UUID of the department to fetch job positions for
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully fetched job positions for the department
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
 *                   example: "Job positions fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       job_title:
 *                         type: string
 *                       department_id:
 *                         type: string
 *                         format: uuid
 *                       description:
 *                         type: string
 *       404:
 *         description: Job positions not found for the department
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
 *                   example: "Job positions not found"
 *       500:
 *         description: Error occurred while fetching job positions
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
 *                   example: "Failed to fetch job positions"
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/department/get/:id', getAllJobPositionsByDepartment);
router.get('/get/:id', getJobPositionById);

router.put('/update/:id', updateJobPosition);
router.delete('/delete/:id', deleteJobPosition);

module.exports = router;