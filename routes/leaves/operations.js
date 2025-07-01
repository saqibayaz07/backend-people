const { leave_managements, peoples } = require('../../models');

// Create a new leave record
const createLeaveRecord = async (req, res) => {
  try {
    const { people_id, leave_type, start_date, end_date, reason, approved_by } = req.body;

    // Validate that all required fields are provided
    if (!people_id || !leave_type || !start_date || !end_date || !reason) {
      return res.status(400).json({ success: false, message: 'All fields are required: people_id, leave_type, start_date, end_date, reason' });
    }

    // Validate that start date must be before end date
    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ success: false, message: 'Start date must be before end date' });
    }

    // Validate that start date is in the future
    if (new Date(start_date) < new Date()) {
      return res.status(400).json({ success: false, message: 'Start date must be in the future' });
    }

    // Optional: Validate that the people_id exists in the People table (if needed)
    const people = await peoples.findOne({ where: { id: people_id } });
    if (!people) {
      return res.status(404).json({ success: false, message: 'People record not found' });
    }

    const approver = await peoples.findOne({ where: { id: approved_by } });
    if (!approver) {
      return res.status(404).json({ success: false, message: 'This approver has no access to this leave' });
    }

    // Optional: Validate that leave_type is valid (if you have predefined types)
    const validLeaveTypes = ['annual', 'sick', 'unpaid', 'maternity'];
    if (!validLeaveTypes.includes(leave_type)) {
      return res.status(400).json({ success: false, message: 'Invalid leave type' });
    }

    // Create the leave record
    const leaveRecord = await leave_managements.create({
      people_id,
      leave_type,
      start_date,
      end_date,
      reason,
      approved_by,
    });

    return res.status(201).json({ success: true, message: 'Leave record created successfully', data: leaveRecord });
  } catch (error) {
    // console.error('Error creating leave record:', error);
    return res.status(500).json({ success: false, message: 'Failed to create leave record', error: error.message });
  }
}

// Get all leave records
const getAllLeaveRecords = async (req, res) => {
  try {
    // Fetch all leave records from the database
    const leaveRecord = await leave_managements.findAll();

    // Check if any leave records exist
    if (leaveRecord.length === 0) {
      return res.status(404).json({ success: false, message: 'No leave records found' });
    }

    // Respond with a success message and leave records data
    res.status(200).json({
      success: true,
      message: 'Leave records fetched successfully',
      data: leaveRecord
    });
  } catch (error) {
    // Log and handle the error
    // console.error('Error fetching leave record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave records',
      error: error.message
    });
  }
};


// Get a specific leave record by ID
const getLeaveRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch a specific leave record by its ID
    const leaveRecord = await leave_managements.findOne({ where: { id } });

    // Check if the leave record exists
    if (!leaveRecord) {
      return res.status(404).json({ success: false, message: 'Leave record not found' });
    }

    // Respond with the leave record data
    res.status(200).json({
      success: true,
      message: 'Leave record fetched successfully',
      data: leaveRecord
    });
  } catch (error) {
    // Handle and log errors
    // console.error('Error fetching leave record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave record',
      error: error.message
    });
  }
};

// Get leave records for a specific user
const getLeaveRecordOfUser = async (req, res) => {
  try {
    const { people_id } = req.params;

    // Fetch leave records for a specific user by their people_id
    const leaveRecord = await leave_managements.findAll({ where: { people_id } });

    // Check if no records are found
    if (leaveRecord.length === 0) {
      return res.status(404).json({ success: false, message: 'No leave records found for this user' });
    }

    // Respond with the user's leave records
    res.status(200).json({
      success: true,
      message: 'Leave records fetched successfully',
      data: leaveRecord
    });
  } catch (error) {
    // Handle and log errors
    // console.error('Error fetching leave records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave records',
      error: error.message
    });
  }
};

// Update a leave record
const updateLeaveRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { people_id, leave_type, start_date, end_date, reason, approved_by } = req.body;

    // 1. Validate required fields
    if (!people_id || !leave_type || !start_date || !end_date || !reason || !approved_by) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // 2. Validate leave type (if applicable)
    const validLeaveTypes = ['Sick', 'Vacation', 'Casual']; // Example of valid leave types
    if (!validLeaveTypes.includes(leave_type)) {
      return res.status(400).json({ success: false, message: 'Invalid leave type' });
    }

    // 3. Validate start and end dates
    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ success: false, message: 'Start date must be before end date' });
    }
    if (new Date(start_date) < new Date()) {
      return res.status(400).json({ success: false, message: 'Start date must be in the future' });
    }

    // 4. Find the existing leave record
    const leaveRecord = await leave_managements.findByPk(id);
    if (!leaveRecord) {
      return res.status(404).json({ success: false, message: 'Leave record not found' });
    }

    // 5. Update the leave record
    leaveRecord.people_id = people_id;
    leaveRecord.leave_type = leave_type;
    leaveRecord.start_date = new Date(start_date);  // Ensure it's a Date object
    leaveRecord.end_date = new Date(end_date);  // Ensure it's a Date object
    leaveRecord.reason = reason;
    leaveRecord.approved_by = approved_by;

    // 6. Save the updated record
    await leaveRecord.save();

    // 7. Return the updated record
    return res.status(200).json({
      success: true,
      message: 'Leave record updated successfully',
      data: leaveRecord,
    });
  } catch (error) {
    console.error('Error updating leave record:', error);
    return res.status(500).json({ success: false, message: 'Failed to update leave record', error: error.message });
  }
};

// Delete a leave record
const deleteLeaveRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if the leave record exists
    const leaveRecord = await leave_managements.findByPk(id);
    if (!leaveRecord) {
      return res.status(404).json({ success: false, message: 'Leave record not found' });
    }

    // 2. Delete the leave record
    await leave_managements.destroy({ where: { id } });

    // 3. Respond with success message
    res.status(200).json({ success: true, message: 'Leave record deleted successfully' });
  } catch (error) {
    console.error('Error deleting leave record:', error);
    res.status(500).json({ success: false, message: 'Failed to delete leave record', error: error.message });
  }
};


module.exports = {
  createLeaveRecord,
  getAllLeaveRecords,
  getLeaveRecordById,
  getLeaveRecordOfUser,
  updateLeaveRecord,
  deleteLeaveRecord
}