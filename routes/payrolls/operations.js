const { payrolls, peoples } = require('../../models');

const createPayroll = async (req, res) => {
  try {
    const { people_id, pay_period_start, pay_period_end, gross_salary, deductions, net_salary, payment_date, remarks } = req.body;

    const peopleExists = await peoples.findByPk(people_id);
    if (!peopleExists) {
      return res.status(400).json({ success: false, message: 'Invalid people_id.' });
    }

    // payStart date must be less than pay end date 
    if (new Date(pay_period_start) > new Date(pay_period_end)) {
      return res.status(400).json({ success: false, message: 'Invalid pay_period_start or pay_period_end.' });
    }

    const newPayroll = await payrolls.create({ people_id, pay_period_start, pay_period_end, gross_salary, deductions, net_salary, payment_date, remarks });
    res.status(201).json({ success: true, message: 'Payroll created successfully.', data: newPayroll });
  } catch (error) {
    // console.error('Error creating Payroll:', error);
    res.status(500).json({ success: false, message: 'Failed to create Payroll', error: error.message });
  }
};

const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await payrolls.findAll();
    res.status(200).json({ success: true, message: 'payrolls fetched successfully.', data: payrolls });
  } catch (error) {
    // console.error('Error fetching payrolls:', error);
    res.status(500).json({ error: 'Failed to fetch payrolls' });
  }
};


const getAllPayrollsByPeopleId = async (req, res) => {
  try {
    // console.log("Request.params: " + req.params);
    const people_id = req.params.id;
    const payrolls = await payrolls.findAll({ where: { people_id } });
    res.status(200).json({ success: true, message: 'payrolls fetched successfully.', data: payrolls });
  } catch (error) {
    // console.error( success: false, message: 'Error fetching payrolls:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payrolls', error: error.message });
  }
};


const getPayrollById = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await payrolls.findByPk(id);
    if (!payroll) {
      return res.status(404).json({ error: 'Payroll not found' });
    }
    res.status(200).json(payroll);
  } catch (error) {
    // console.error('Error fetching Payroll:', error);
    res.status(500).json({ error: 'Failed to fetch Payroll' });
  }
};

const updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { people_id, pay_period_start, pay_period_end, gross_salary, deductions, net_salary, payment_date, remarks } = req.body;
    const payroll = await payrolls.findByPk(id);
    if (!payroll) {
      return res.status(404).json({ error: 'Payroll not found' });
    }
    if (payroll.people_id !== people_id) {
      return res.status(400).json({ success: false, message: 'Invalid people_id', error: 'Invalid people_id' });
    }

    payroll.pay_period_start = pay_period_start;
    payroll.pay_period_end = pay_period_end;
    payroll.gross_salary = gross_salary;
    payroll.deductions = deductions;
    payroll.net_salary = net_salary;
    payroll.payment_date = payment_date;
    payroll.remarks = remarks;
    await payroll.save();
    res.status(200).json(payroll);
  } catch (error) {
    // console.error('Error updating Payroll:', error);
    res.status(500).json({ error: 'Failed to update Payroll' });
  }
};

const deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await payrolls.findByPk(id);
    if (!payroll) {
      return res.status(404).json({ error: 'Payroll not found' });
    }
    await payroll.destroy();
    res.status(200).json({ message: 'Payroll deleted successfully' });
  } catch (error) {
    // console.error('Error deleting Payroll:', error);
    res.status(500).json({ error: 'Failed to delete Payroll' });
  }
};


module.exports = {
  createPayroll,
  getAllPayrolls,
  getAllPayrollsByPeopleId,
  getPayrollById,
  updatePayroll,
  deletePayroll
};