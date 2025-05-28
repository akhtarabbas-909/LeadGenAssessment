import React, { useState, useEffect } from "react";
import { Trash2, Pencil, Plus, Upload } from "lucide-react";
import WebhookTable from "./WebhookTable";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function ContactDashboard() {
  const [activeTab, setActiveTab] = useState("leads");
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/leads`);
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "leads") {
      fetchContacts();
    }
  }, [activeTab]);

  const filteredContacts = contacts.filter((c) =>
    Object.values(c).some((val) =>
      val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? paginatedContacts.map((c) => c.id) : []);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await fetch(`${baseUrl}/api/leads/${id}`, { method: "DELETE" });
        fetchContacts();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleSave = async (data) => {
    try {
      const method = data.id ? "PUT" : "POST";
      const endpoint = data.id
        ? `${baseUrl}/api/leads/${data.id}`
        : `${baseUrl}/api/leads`;
      await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setShowDialog(false);
      setEditContact(null);
      setIsDirty(false);
      fetchContacts();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  // Function to push selected contacts to the webhook

  const handlePushToGHL = async () => {
    const selectedContacts = contacts.filter((c) => selectedIds.includes(c.id));

    if (selectedContacts.length === 0) {
      alert("No contact selected.");
      return;
    }

    const webhookUrl =
      "https://hook.us2.make.com/hmrllz9rbt0c6xynqvxrdtct4pio6ebd";

    for (const contact of selectedContacts) {
      const payload = {
        name: contact.name,
        email: contact.email,
        company_size: contact.company_size,
        job_title: contact.job_title,
        website: contact.website.trim(),
        message: contact.message,
      };

      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.text();
        console.log("Sent successfully:", contact.id);
        console.log("Response:", result);
      } catch (error) {
        console.error("Failed to send contact ID:", contact.id, error);
      }
    }

    alert("Selected contact(s) have been sent via POST to the webhook.");
  };

  return (
    <div className="p-4 w-full">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-4 py-2 rounded ${
            activeTab === "leads" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Leads
        </button>
        <button
          onClick={() => setActiveTab("webhook")}
          className={`px-4 py-2 rounded ${
            activeTab === "webhook" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Webhook
        </button>
      </div>

      {activeTab === "leads" ? (
        <>
          {/* Search + Add + Push Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-4 py-2 w-full sm:w-auto"
              aria-label="Search contacts"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditContact(null);
                  setIsDirty(false);
                  setShowDialog(true);
                }}
                className="flex items-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                <Plus className="mr-2 w-4 h-4" /> Add Record
              </button>
              <button
                onClick={handlePushToGHL}
                disabled={!selectedIds.length}
                className={`flex items-center px-4 py-2 rounded ${
                  selectedIds.length
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-700 cursor-not-allowed"
                }`}
              >
                <Upload className="mr-2 w-4 h-4" /> Push to CRM
              </button>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === paginatedContacts.length}
                    />
                  </th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Company Size</th>
                  <th className="p-2 border">Job Title</th>
                  <th className="p-2 border">Website</th>
                  <th className="p-2 border">Message</th>
                  <th className="p-2 border">Score</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      No contacts found.
                    </td>
                  </tr>
                ) : (
                  paginatedContacts.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="p-2 border">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(c.id)}
                          onChange={() => handleSelect(c.id)}
                        />
                      </td>
                      <td className="p-2 border">{c.name}</td>
                      <td className="p-2 border">{c.email}</td>
                      <td className="p-2 border">{c.company_size}</td>
                      <td className="p-2 border">{c.job_title}</td>
                      <td className="p-2 border">{c.website}</td>
                      <td className="p-2 border">{c.message}</td>
                      <td className="p-2 border">{c.score}</td>
                      <td className="p-2 border">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditContact(c);
                              setIsDirty(false);
                              setShowDialog(true);
                            }}
                            className="text-black hover:text-gray-800"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="text-black hover:text-gray-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n} per page
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border rounded"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-black text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-3 py-1 border rounded"
              >
                Next
              </button>
            </div>
          </div>

          {/* Modal Dialog for Adding / Editing Contact */}
          {showDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">
                  {editContact ? "Edit Contact" : "Add Contact"}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const newContact = Object.fromEntries(formData.entries());
                    if (editContact?.id) newContact.id = editContact.id;
                    handleSave(newContact);
                  }}
                  className="grid gap-4"
                >
                  {[
                    "name",
                    "email",
                    "company_size",
                    "job_title",
                    "website",
                    "message",
                    // "score",
                  ].map((field) => (
                    <input
                      key={field}
                      name={field}
                      defaultValue={editContact?.[field] || ""}
                      placeholder={field
                        .replace("_", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                      required
                      className="border rounded px-4 py-2"
                      onChange={() => setIsDirty(true)}
                    />
                  ))}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          isDirty &&
                          !window.confirm(
                            "You have unsaved changes. Are you sure you want to close?"
                          )
                        )
                          return;
                        setShowDialog(false);
                        setEditContact(null);
                        setIsDirty(false);
                      }}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        <WebhookTable />
      )}
    </div>
  );
}
