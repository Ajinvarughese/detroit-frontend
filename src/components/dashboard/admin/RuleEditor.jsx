// src/pages/dashboard/admin/RuleEditor.jsx

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  Edit,
  X,
  Save,
  Database,
  Shield,
  Droplets,
  Recycle,
  TreePine,
  Leaf,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar";
import API from "../../hooks/API";
import { convertToString } from "../../hooks/EnumToString";

const useApi = API();


const emptyRule = {
  type: "",
  nace: "",
  sector: "",
  activityNumber: "",
  activity: "",
  contributionType: "",
  description: "",
  substantialCriteria: "",
  climateMitigationDNSH: "",
  circularEconomyDNSH: "",
  climateAdaptationDNSH: "",
  waterDNSH: "",
  pollutionPreventionDNSH: "",
  biodiversityDNSH: "",
  footNotes: "",
};

const RuleEditor = () => {
  const [rules, setRules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRule, setSelectedRule] = useState(null);
  const [editedData, setEditedData] = useState({});

  const [isCreating, setIsCreating] = useState(false);

  const fetchRules = async () => {
    try {
      const res = await axios.get(useApi.url + "/rules");
      setRules(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const filteredRules = useMemo(() => {
    return rules.filter((rule) =>
      Object.values(rule).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rules, searchTerm]);

  const handleEdit = (rule) => {
    setSelectedRule(rule);
    setEditedData(rule);
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedRule(emptyRule);
    setEditedData(emptyRule);
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        const res = await axios.post(`${useApi.url}/rules`, editedData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setRules((prev) => [res.data, ...prev]);
      } else {
        const res = await axios.put(`${useApi.url}/rules`, editedData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setRules((prev) =>
          prev.map((rule) => (rule.id === editedData.id ? res.data : rule))
        );
      }

      setSelectedRule(null);
      setIsCreating(false);
    } catch (error) {
      console.error(error);
    }
  };

  const truncateText = (text, max = 40) => {
    if (!text) return "";
    return text.length > max ? text.substring(0, max) + "..." : text;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AdminSidebar />

      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
              <Database className="text-white" size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rule Editor</h1>
              <p className="text-gray-600">
                Manage sustainability taxonomy rules
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col justify-between md:flex-row md:items-center gap-4">
            <div className="relative max-w-md w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="text"
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={handleCreate}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg transition-all"
            >
              + Add Rule
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    ID
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    NACE
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Sector
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Activity #
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Activity
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Contribution
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Substantial Criteria
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Climate Mitigation
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Circular Economy
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Climate Adaptation
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Water
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Pollution Prevention
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Biodiversity
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Foot Notes
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredRules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="hover:bg-blue-50 transition-all duration-200"
                  >
                    <td className="px-4 py-4 text-sm">{rule.id}</td>

                    <td className="px-4 py-4 min-w-[170px]">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {convertToString(rule?.type)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm font-mono">{rule.nace}</td>

                    <td
                      className="px-4 py-4 text-sm max-w-[180px] truncate"
                      title={rule.sector}
                    >
                      {truncateText(rule.sector)}
                    </td>

                    <td className="px-4 py-4 text-sm font-mono">
                      {rule.activityNumber}
                    </td>

                    <td
                      className="px-4 py-4 text-sm max-w-[220px] truncate"
                      title={rule.activity}
                    >
                      {truncateText(rule.activity, 50)}
                    </td>

                    <td
                      className="px-4 py-4 text-sm max-w-[220px] truncate"
                      title={rule.contributionType}
                    >
                      {truncateText(rule.contributionType, 40)}
                    </td>

                    <td
                      className="px-4 py-4 text-sm max-w-[250px] truncate"
                      title={rule.description}
                    >
                      {truncateText(rule.description, 50)}
                    </td>

                    <td
                      className="px-4 py-4 text-sm max-w-[250px] truncate"
                      title={rule.substantialCriteria}
                    >
                      {truncateText(rule.substantialCriteria, 50)}
                    </td>

                    <td
                      className="px-4 py-4 text-sm max-w-[220px] truncate"
                      title={rule.climateMitigationDNSH}
                    >
                      {truncateText(rule.climateMitigationDNSH)}
                    </td>

                    <td
                      className="px-4 py-4 text-sm max-w-[220px] truncate"
                      title={rule.circularEconomyDNSH}
                    >
                      {truncateText(rule.circularEconomyDNSH)}
                    </td>

                    <td
                      className="px-4 py-4 text-sm max-w-[220px] truncate"
                      title={rule.climateAdaptationDNSH}
                    >
                      {truncateText(rule.climateAdaptationDNSH)}
                    </td>

                    <td
                      className="px-4 py-4 text-sm max-w-[220px] truncate"
                      title={rule.waterDNSH}
                    >
                      {truncateText(rule.waterDNSH)}
                    </td>

                    <td
                      className="px-4 py-4 text-sm max-w-[220px] truncate"
                      title={rule.pollutionPreventionDNSH}
                    >
                      {truncateText(rule.pollutionPreventionDNSH)}
                    </td>

                    <td
                      className="px-4 py-4 text-sm max-w-[220px] truncate"
                      title={rule.biodiversityDNSH}
                    >
                      {truncateText(rule.biodiversityDNSH)}
                    </td>

                    <td
                      className="px-4 py-4 text-sm max-w-[220px] truncate"
                      title={rule.footNotes}
                    >
                      {truncateText(rule.footNotes)}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleEdit(rule)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRules.length === 0 && (
            <div className="py-16 text-center">
              <Database size={48} className="mx-auto text-gray-300 mb-4" />

              <h3 className="text-lg font-semibold text-gray-700">
                No rules found
              </h3>

              <p className="text-gray-500">Try changing your search keyword</p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {selectedRule && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Rule
                  </h2>

                  <p className="text-gray-600">{selectedRule.activityName}</p>
                </div>

                <button
                  onClick={() => setSelectedRule(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Type */}
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Loan Category Type
                    </label>

                    <select
                      value={editedData.type || ""}
                      onChange={(e) => handleChange("type", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select Type</option>
                      <option value="CLIMATE_MITIGATION">
                        Climate Mitigation
                      </option>
                      <option value="CIRCULAR_ECONOMY">Circular Economy</option>
                      <option value="WATER">Water</option>
                      <option value="BIODIVERSITY">Biodiversity</option>
                      <option value="POLLUTION_PREVENTION">
                        Pollution Prevention
                      </option>
                      <option value="CLIMATE_ADAPTATION">
                        Climate Adaptation
                      </option>
                    </select>
                  </div>

                  {/* NACE */}
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      NACE
                    </label>

                    <input
                      type="text"
                      value={editedData.nace || ""}
                      onChange={(e) => handleChange("nace", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Sector */}
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Sector
                    </label>

                    <input
                      type="text"
                      value={editedData.sector || ""}
                      onChange={(e) => handleChange("sector", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Activity Number */}
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Activity Number
                    </label>

                    <input
                      type="text"
                      value={editedData.activityNumber || ""}
                      onChange={(e) =>
                        handleChange("activityNumber", e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Activity
                  </label>

                  <textarea
                    rows={3}
                    value={editedData.activity || ""}
                    onChange={(e) => handleChange("activity", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                {/* Contribution Type */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Contribution Type
                  </label>

                  <textarea
                    rows={3}
                    value={editedData.contributionType || ""}
                    onChange={(e) =>
                      handleChange("contributionType", e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Description
                  </label>

                  <textarea
                    rows={5}
                    value={editedData.description || ""}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                {/* Substantial Criteria */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Substantial Contribution Criteria
                  </label>

                  <textarea
                    rows={5}
                    value={editedData.substantialCriteria || ""}
                    onChange={(e) =>
                      handleChange("substantialCriteria", e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                {/* DNSH Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    DNSH Criteria
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Climate Mitigation */}
                    <div>
                      <label className="block mb-2 font-semibold text-green-700">
                        Climate Mitigation DNSH
                      </label>

                      <textarea
                        rows={5}
                        value={editedData.climateMitigationDNSH || ""}
                        onChange={(e) =>
                          handleChange("climateMitigationDNSH", e.target.value)
                        }
                        className="w-full rounded-xl border border-green-200 bg-green-50 p-4 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                      />
                    </div>

                    {/* Circular Economy */}
                    <div>
                      <label className="block mb-2 font-semibold text-emerald-700">
                        Circular Economy DNSH
                      </label>

                      <textarea
                        rows={5}
                        value={editedData.circularEconomyDNSH || ""}
                        onChange={(e) =>
                          handleChange("circularEconomyDNSH", e.target.value)
                        }
                        className="w-full rounded-xl border border-emerald-200 bg-emerald-50 p-4 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                      />
                    </div>

                    {/* Climate Adaptation */}
                    <div>
                      <label className="block mb-2 font-semibold text-teal-700">
                        Climate Adaptation DNSH
                      </label>

                      <textarea
                        rows={5}
                        value={editedData.climateAdaptationDNSH || ""}
                        onChange={(e) =>
                          handleChange("climateAdaptationDNSH", e.target.value)
                        }
                        className="w-full rounded-xl border border-teal-200 bg-teal-50 p-4 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                      />
                    </div>

                    {/* Water */}
                    <div>
                      <label className="block mb-2 font-semibold text-cyan-700">
                        Water DNSH
                      </label>

                      <textarea
                        rows={5}
                        value={editedData.waterDNSH || ""}
                        onChange={(e) =>
                          handleChange("waterDNSH", e.target.value)
                        }
                        className="w-full rounded-xl border border-cyan-200 bg-cyan-50 p-4 focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                      />
                    </div>

                    {/* Pollution */}
                    <div>
                      <label className="block mb-2 font-semibold text-purple-700">
                        Pollution Prevention DNSH
                      </label>

                      <textarea
                        rows={5}
                        value={editedData.pollutionPreventionDNSH || ""}
                        onChange={(e) =>
                          handleChange(
                            "pollutionPreventionDNSH",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-purple-200 bg-purple-50 p-4 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                      />
                    </div>

                    {/* Biodiversity */}
                    <div>
                      <label className="block mb-2 font-semibold text-lime-700">
                        Biodiversity DNSH
                      </label>

                      <textarea
                        rows={5}
                        value={editedData.biodiversityDNSH || ""}
                        onChange={(e) =>
                          handleChange("biodiversityDNSH", e.target.value)
                        }
                        className="w-full rounded-xl border border-lime-200 bg-lime-50 p-4 focus:ring-2 focus:ring-lime-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Footnotes */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Foot Notes
                  </label>

                  <textarea
                    rows={4}
                    value={editedData.footNotes || ""}
                    onChange={(e) => handleChange("footNotes", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedRule(null)}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-lg transition"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RuleEditor;
