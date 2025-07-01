const { trainings, peoples } = require('../../models');

  // people_id,
  // training_name,
  // training_type,
  // start_date,
  // end_date,
  // status.
  // certification_awarded,
  // traininer

const createTraining = async (req, res) => {
  try {

    const { people_id } = req.body;
    if (!people_id) {
      return res.status(400).json({ success: false, message:"Invalid people_id", error: 'people_id is required' });
    }

    if(new Date(req.body.start_date) > new Date(req.body.end_date)){
      return res.status(400).json({ success: false, message:"Invalid start_date or end_date", error: 'Start date must be before end date' });
    }

    const people = await peoples.findByPk(people_id);
    if (!people) {
      return res.status(404).json({ success: false , message: "Invalid people_id", error: 'People not found' });
    }

    // const trainer = await peoples.findByPk(req.body.traininer);
    // if (!trainer) {
    //   return res.status(404).json({ success: false , message: "Invalid traininer", error: 'Trainer not found' });
    // }

    const training = await trainings.create(req.body);
    res.status(201).json({success: true , message: 'Training created successfully.', data: training});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create training', error: error.message });
  }
};


const getAllTrainings = async (req, res) => {
  try {
    const trainings = await trainings.findAll();
    res.status(200).json(trainings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch trainings' });
  }
};


const getTrainingById = async (req, res) => {
  try {
    const training = await trainings.findByPk(req.params.id);
    if (!training) {
      return res.status(404).json({ error: 'Training not found' });
    }
    res.status(200).json(training);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch training' });
  }
};


const updateTraining = async (req, res) => {
  try {
    const training = await trainings.findByPk(req.params.id);
    if (!training) {
      return res.status(404).json({ error: 'Training not found' });
    }
    await training.update(req.body);
    res.status(200).json(training);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update training' });
  }
};

const deleteTraining = async (req, res) => {
  try {
    const training = await trainings.findByPk(req.params.id);
    if (!training) {
      return res.status(404).json({ error: 'Training not found' });
    }
    await training.destroy();
    res.status(200).json({ message: 'Training deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete training' });
  }
};


module.exports = {
  createTraining,
  getAllTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining
};