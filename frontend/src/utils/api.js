// utils/api.js
const BASE_URL = "http://localhost:3000/api";

export const getLeads = () =>
  fetch(`${BASE_URL}/leads`).then((res) => res.json());

export const createLead = (data) =>
  fetch(`${BASE_URL}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateLead = (id, data) =>
  fetch(`${BASE_URL}/leads/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteLead = (id) =>
  fetch(`${BASE_URL}/leads/${id}`, { method: "DELETE" });
