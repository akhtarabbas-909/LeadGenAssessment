const OpenAI = require("openai");
require("dotenv").config();

// api wprking correct
// services/aiScoringService.js


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getLeadScore = async (lead) => {
  console.log("service of ai");

  const prompt = `Score this lead as High, Medium, or Low:\n\nName: ${lead.name}\nEmail: ${lead.email}\nCompany Size: ${lead.company_size}\nJob Title: ${lead.job_title}\nWebsite: ${lead.website}\nMessage: ${lead.message}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 10,
    temperature: 0.7,
  });

  const score = response.choices[0].message.content.trim();
  return score;
};

// //may be some error


// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY,
// // });

// // exports.getLeadScore = async (lead) => {
// //   console.log("service of ai");

// //   const prompt = `Score this lead as High, Medium, or Low:\n\nName: ${lead.name}\nEmail: ${lead.email}\nCompany Size: ${lead.company_size}\nJob Title: ${lead.job_title}\nWebsite: ${lead.website}\nMessage: ${lead.message}`;

// //   const response = await openai.chat.completions.create({
// //     model: "gpt-3.5-turbo",
// //     messages: [{ role: "user", content: prompt }],
// //     max_tokens: 10,
// //     temperature: 0.7,
// //   });

// //   const score = response.choices[0].message.content.trim();

// //   // ✅ Condition: if score is High, send email
// //   if (score.toLowerCase() === "high") {
// //     await sendHighQualityLeadEmail({ ...lead, score });
// //   }

// //   return score;
// // };

// // exports.getLeadScore now just sends email always without calling OpenAI
// exports.getLeadScore = async (lead) => {
//   console.log("service of ai - skipping OpenAI call");

//   // Fake score to simulate "High"
//   const score = "High";

//   // Always send email since condition is true
//   if (score.toLowerCase() === "high") {
//     await sendHighQualityLeadEmail({ ...lead, score });
//   }

//   return score;
// };
