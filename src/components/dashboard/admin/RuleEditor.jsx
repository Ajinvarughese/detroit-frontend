// src/pages/RuleEditor.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';

const RuleEditor = () => {
  const [rules, setRules] = useState([]);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8080/api/rules').then(res => setRules(res.data));
  }, []);

  const handleEdit = (rule) => {
    setEditingRuleId(rule.id);
    setEditedData(rule);
  };

  const handleChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (id) => {
    axios.put(`http://localhost:8080/api/rules/${id}`, editedData).then(res => {
      setRules(rules.map(rule => (rule.id === id ? res.data : rule)));
      setEditingRuleId(null);
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <AdminSidebar />

      <main className="ml-64 flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">Rule Editor</h1>

        {rules.map(rule => (
          <div key={rule.id} style={{borderRadius: 7}} className="bg-white p-4 shadow mb-6">
            <h2 className="font-semibold text-blue-700 mb-2">{rule.activityName}</h2>

            {editingRuleId === rule.id ? (
              <>
                {['waterDNSH', 'climateMitigation', 'circularEconomyDNSH', 'pollutionPreventionDNSH', 'biodiversityDNSH'].map(field => (
                  <div key={field} className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <textarea
                      className="w-full border rounded p-2"
                      rows={3}
                      value={editedData[field] || ''}
                      onChange={e => handleChange(field, e.target.value)}
                    />
                  </div>
                ))}
                <button onClick={() => handleSave(rule.id)} className="bg-green-600 text-white px-4 py-2 rounded mr-2">
                  Save
                </button>
                <button onClick={() => setEditingRuleId(null)} className="bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p><strong>Water DNSH:</strong> {rule.waterDNSH}</p>
                <p><strong>Climate Mitigation:</strong> {rule.climateMitigation}</p>
                <p><strong>Circular Economy:</strong> {rule.circularEconomyDNSH}</p>
                <p><strong>Pollution Prevention:</strong> {rule.pollutionPreventionDNSH}</p>
                <p><strong>Biodiversity:</strong> {rule.biodiversityDNSH}</p>
                <button onClick={() => handleEdit(rule)} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded">
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default RuleEditor;
