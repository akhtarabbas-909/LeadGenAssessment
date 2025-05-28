const db = require('../db/database');

exports.getAllWebhooks = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM webhooks', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.getWebhookById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM webhooks WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

exports.createWebhook = (webhook) => {
  const { name, url, status } = webhook;
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO webhooks (name, url, status) VALUES (?, ?, ?)`,
      [name, url, status],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...webhook });
      }
    );
  });
};

exports.updateWebhook = (id, webhook) => {
  const { name, url, status } = webhook;
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE webhooks SET name = ?, url = ?, status = ? WHERE id = ?`,
      [name, url, status, id],
      function (err) {
        if (err) reject(err);
        else resolve({ id, ...webhook });
      }
    );
  });
};

exports.deleteWebhook = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM webhooks WHERE id = ?`, [id], function (err) {
      if (err) reject(err);
      else resolve({ message: 'Deleted successfully' });
    });
  });
};
