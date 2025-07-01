const { attendances, peoples } = require('../../models');  // Assuming you have a `attendances` model 

// Create a new attendance record
const createAttendance = async (req, res) => {
  let {
    people_id,
    date,
    status,
    check_in_time,
    check_out_time,
    hours_worked,
    remarks,
  } = req.body;

  //  res.status(200).json({ success: true, message: 'Attendance created successfully.' });

  try {
    if (!people_id) {
      return res.status(400).json({ success: false, message: 'Invalid people_id.' });
    }
    const people = await peoples.findOne({ where: { id: people_id } });
    if (!people) {
      return res.status(400).json({ success: false, message: 'Invalid people_id.' });
    }
    if (date > new Date().toISOString().split('T')[0]) {
      res.status(400).json({ success: false, message: "Invalid date." });
    }

    if (status == "absent") {
      console.log("absent student");
      check_in_time = null;
      check_out_time = null;
      hours_worked = 0;
    }


    const newAttendance = await attendances.create({
      people_id,
      date,
      status,
      check_in_time,
      check_out_time,
      hours_worked,
      remarks,
    });



    res.status(201).json({ success: true, data: newAttendance, message: 'Attendance created successfully.' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating attendance.', error: error.message });
  }
}


const getAllAttendances = async (req, res) => {
  try {
    const attendances = await attendances.findAll();
    if (!attendances.length) {
      return res.status(404).json({ success: false, message: 'No attendances found.' });
    }
    res.status(200).json({ success: true, data: attendances });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching attendances.', error: error.message });
  }
}

const getAttendanceById = async (req, res) => {
  try {
    const attendance = await attendances.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance not found.' });
    }
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching attendance.', error: error.message });
  }
}


const getAttendancesByPeopleId = async (req, res) => {
  try {

    // console.log(req.params.id);
    const attendances = await attendances.findAll({
      where: { people_id: req.params.id },
      order: [['date', 'ASC']]
    });
    if (!attendances.length) {
      return res.status(404).json({ success: false, message: 'No attendances found for the specified people_id.' });
    }
    res.status(200).json({ success: true, data: attendances });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching attendances.', error: error.message });
  }
}

const deleteAttendance = async (req, res) => {
  try {
    const attendance = await attendances.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance not found.' });
    }
    await attendance.destroy();
    res.status(200).json({ success: true, message: 'Attendance deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting attendance.', error: error.message });
  }
}

const updateAttendance = async (req, res) => {
  try {
    const attendance = await attendances.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance not found.' });
    }
    await attendance.update(req.body);
    res.status(200).json({ success: true, data: attendance, message: 'Attendance updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating attendance.', error: error.message });
  }
}




module.exports = {
  createAttendance,
  getAllAttendances,
  getAttendanceById,
  getAttendancesByPeopleId,
  deleteAttendance,
  updateAttendance
};