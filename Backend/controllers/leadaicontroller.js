const db = require("../db/database");
const { getLeadScore } = require("../services/aiScoringService");
const { sendEmail } = require("../utils/emailService");
const webhookService = require("../services/webhookService");

function createHighQualityLeadEmailBody(leadData) {
  return `
    <h2>New High-Quality Lead</h2>
    <p><strong>Name:</strong> ${leadData.name}</p>
    <p><strong>Email:</strong> ${leadData.email}</p>
    ${
      leadData.job_title
        ? `<p><strong>Job Title:</strong> ${leadData.job_title}</p>`
        : ""
    }
    ${
      leadData.company_size
        ? `<p><strong>Company Size:</strong> ${leadData.company_size}</p>`
        : ""
    }
    ${
      leadData.website
        ? `<p><strong>Website:</strong> <a href="${leadData.website}" target="_blank">${leadData.website}</a></p>`
        : ""
    }
    ${
      leadData.message
        ? `<p><strong>Message:</strong><br/>${leadData.message}</p>`
        : ""
    }
    <p>This lead has been classified as <strong>High Quality</strong>.</p>
  `;
}

exports.submitAndScoreLead = async (req, res) => {
  const { name, email, company_size, job_title, website, message } = req.body;

  try {
    db.run(
      `INSERT INTO leads (name, email, company_size, job_title, website, message, score) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, company_size, job_title, website, message, "Pending"],
      async function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const leadData = {
          name,
          email,
          company_size,
          job_title,
          website,
          message,
        };
        const score = await getLeadScore(leadData);

        // Update score
        db.run(`UPDATE leads SET score = ? WHERE id = ?`, [score, this.lastID]);

        // Send email if High quality
        if (score.toLowerCase() === "high") {
          sendEmail(createHighQualityLeadEmailBody(leadData));

          const webhooks = await webhookService.getAllWebhooks();

          for (const webhook of webhooks) {
            if (webhook.status === "active") {
              // Use fetch, axios, or your HTTP client to send leadData
              await fetch(webhook.url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(leadData),
              });
            }
          }
        }

        res.json({ success: true, message: "Lead saved & scored", score });
      }
    );
  } catch (error) {
    console.error("AI scoring error:", error);
    res.status(500).json({ error: "AI scoring failed" });
  }
};
