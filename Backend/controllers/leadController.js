const leadService = require('../services/leadService');

exports.createLead = async (req, res) => {
  try {
    const id = await leadService.createLead(req.body);
    res.status(201).json({ success: true, message: 'Lead created', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const leads = await leadService.getAllLeads();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const changes = await leadService.updateLead(req.params.id, req.body);
    if (changes === 0) return res.status(404).json({ error: 'Lead not found or no changes' });
    res.json({ success: true, message: 'Lead updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const changes = await leadService.deleteLead(req.params.id);
    if (changes === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
