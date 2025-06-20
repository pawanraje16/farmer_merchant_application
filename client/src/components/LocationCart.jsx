import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useFilter } from "../context/FilterContext"; // optional
import api from "../utils/api";
import toast from "react-hot-toast";

const LocationCard = ({ userProfile, refreshProfile }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(userProfile.address || {});
  const [saving, setSaving] = useState(false);
 
  const FIELDS = ["state", "district", "city", "village", "pincode"];
  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const saveAddress = async () => {
    setSaving(true);
    try {
      await api.patch("/api/v1/address/update-address", form);   // JWT cookie sent automatically
      toast.success("Address updated");
      setEditing(false);
      refreshProfile();                          // re‑fetch current user
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- card UI ---------- */
  if (!editing) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-100">
        <div className="flex justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center space-x-2">
            <span className="text-2xl">📍</span>
            <span>Location Details</span>
          </h3>
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            ✏️ Edit
          </button>
        </div>
        {FIELDS.map((key) => (
          <div
            key={key}
            className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm mb-3"
          >
            <span className="text-xl">
              {key === "state" ? "🗺️" : key === "district" ? "🏘️" : key === "city" ? "🏙️" : key === "village" ? "🏡" : "📮"}
            </span>
            <div>
              <div className="text-sm font-medium text-gray-500 capitalize">
                {key}
              </div>
              <div className="text-gray-900 font-medium">
                {userProfile.address?.[key] || "—"}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ---------- edit form ---------- */
   return (
    <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
        <span className="text-2xl">✏️</span>
        <span>Edit Address</span>
      </h3>

      {FIELDS.map((key) => (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium mb-1 capitalize">
            {key}
          </label>
          <input
            name={key}
            value={form[key] || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder={`Enter your ${key}`}
          />
        </div>
      ))}

      <div className="flex space-x-4">
        <button
          onClick={() => setEditing(false)}
          className="px-5 py-2 border rounded-lg"
        >
          Cancel
        </button>
        <button
          disabled={saving}
          onClick={saveAddress}
          className="px-5 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default LocationCard;
