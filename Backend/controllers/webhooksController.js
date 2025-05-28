const webhookService = require('../services/webhookService');

exports.getAll = async (req, res) => {
  try {
    const webhooks = await webhookService.getAllWebhooks();
    res.json(webhooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const webhook = await webhookService.getWebhookById(req.params.id);
    if (!webhook) return res.status(404).json({ error: 'Webhook not found' });
    res.json(webhook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newWebhook = await webhookService.createWebhook(req.body);
    res.status(201).json(newWebhook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await webhookService.updateWebhook(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await webhookService.deleteWebhook(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
