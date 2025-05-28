const db = require('../db/database');

// Create lead
exports.createLead = (leadData) => {
  const { name, email, company_size, job_title, website, message } = leadData;
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO leads (name, email, company_size, job_title, website, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, company_size, job_title, website, message],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
};

// Read all leads
exports.getAllLeads = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM leads ORDER BY id DESC`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Read lead by ID
exports.getLeadById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM leads WHERE id = ?`, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// Update lead by ID
exports.updateLead = (id, leadData) => {
  const { name, email, company_size, job_title, website, message } = leadData;
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE leads SET name = ?, email = ?, company_size = ?, job_title = ?, website = ?, message = ? WHERE id = ?`,
      [name, email, company_size, job_title, website, message, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
};

// Delete lead by ID
exports.deleteLead = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM leads WHERE id = ?`, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};
