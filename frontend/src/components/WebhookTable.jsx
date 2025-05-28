import React, { useState, useEffect } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function WebhookTable() {
  const [webhooks, setWebhooks] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editWebhook, setEditWebhook] = useState(null);

  const fetchWebhooks = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/webhooks`);
      const data = await res.json();
      setWebhooks(data);
    } catch (error) {
      console.error("Failed to fetch webhooks:", error);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this webhook?")) {
      try {
        await fetch(`${baseUrl}/api/webhooks/${id}`, { method: "DELETE" });
        fetchWebhooks();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleSave = async (data) => {
    try {
      const method = data.id ? "PUT" : "POST";
      const endpoint = data.id
        ? `${baseUrl}/api/webhooks/${data.id}`
        : `${baseUrl}/api/webhooks`;

      await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setShowDialog(false);
      setEditWebhook(null);
      fetchWebhooks();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Webhooks</h2>
        <button
          onClick={() => {
            setEditWebhook(null);
            setShowDialog(true);
          }}
          className="flex items-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          <Plus className="mr-2 w-4 h-4" /> Add Webhook
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">URL</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50">
                <td className="p-2 border">{w.name}</td>
                <td className="p-2 border">{w.url}</td>
                {/* <td className="p-2 border">{w.status}</td> */}
                <td className="p-2 border">
                  <button
                    onClick={async () => {
                      const newStatus =
                        w.status === "active" ? "inactive" : "active";
                      try {
                        await fetch(`${baseUrl}/api/webhooks/${w.id}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            ...w,
                            status: newStatus,
                          }),
                        });
                        fetchWebhooks();
                      } catch (error) {
                        console.error("Failed to update status:", error);
                      }
                    }}
                    className={`px-3 py-1 rounded text-white ${
                      w.status === "active"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {w.status === "active" ? "Active" : "Inactive"}
                  </button>
                </td>

                <td className="p-2 border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditWebhook(w);
                        setShowDialog(true);
                      }}
                      className="text-black hover:text-gray-800"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(w.id)}
                      className="text-black hover:text-gray-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editWebhook ? "Edit Webhook" : "Add Webhook"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newWebhook = Object.fromEntries(formData.entries());
                if (editWebhook?.id) newWebhook.id = editWebhook.id;
                handleSave(newWebhook);
              }}
              className="grid gap-4"
            >
              <input
                name="name"
                defaultValue={editWebhook?.name || ""}
                placeholder="Name"
                required
                className="border rounded px-4 py-2"
              />
              <input
                name="url"
                defaultValue={editWebhook?.url || ""}
                placeholder="URL"
                required
                className="border rounded px-4 py-2"
              />
              <input
                name="status"
                defaultValue={editWebhook?.status || ""}
                placeholder="Status"
                required
                className="border rounded px-4 py-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
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
    </div>
  );
}
