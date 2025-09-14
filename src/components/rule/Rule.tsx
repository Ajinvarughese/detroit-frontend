import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Filter, Database, Leaf, Droplets, TreePine, Shield, Recycle, Wind } from 'lucide-react';
import axios from 'axios';
import API from '../hooks/API';

const useApi = API();

// Type definitions matching your database schema
interface SustainabilityRule {
  id: number;
  type: string;
  nace: string;
  sector: string;
  activityNumber: string;
  activity: string;
  contributionType: string;
  description: string;
  substantialContributionCriteria: string;
  climateMitigationDNSH: string;
  circularEconomyDNSH: string;
  climateAdaptationDNSH: string;
  waterDNSH: string;
  pollutionPreventionDNSH: string;
  biodiversityDNSH: string;
  footnotes: string;
}


const typeIcons = {
  CLIMATE_MITIGATION: Wind,
  CIRCULAR_ECONOMY: Recycle,
  WATER: Droplets,
  BIODIVERSITY: TreePine,
  POLLUTION_PREVENTION: Shield,
  CLIMATE_ADAPTATION: Leaf
};

const typeColors = {
  CLIMATE_MITIGATION: 'bg-blue-50 border-blue-200 text-blue-800',
  CIRCULAR_ECONOMY: 'bg-green-50 border-green-200 text-green-800',
  WATER: 'bg-cyan-50 border-cyan-200 text-cyan-800',
  BIODIVERSITY: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  POLLUTION_PREVENTION: 'bg-purple-50 border-purple-200 text-purple-800',
  CLIMATE_ADAPTATION: 'bg-teal-50 border-teal-200 text-teal-800'
};

const typeNames = {
  CLIMATE_MITIGATION: 'Climate Mitigation',
  CIRCULAR_ECONOMY: 'Circular Economy',
  WATER: 'Water',
  BIODIVERSITY: 'Biodiversity',
  POLLUTION_PREVENTION: 'Pollution Prevention',
  CLIMATE_ADAPTATION: 'Climate Adaptation'
};

function Rule() {
  const [rule, setRule] = useState<SustainabilityRule[] | null>(null);
  const [selectedRule, setSelectedRule] = useState<SustainabilityRule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('CLIMATE_MITIGATION');

  // Fetch rules
  const fetchRule = async () => {
    const resRule = await axios.get(useApi.url+'/rules');
    setRule(resRule.data);
    console.log(resRule.data);
  };

  useEffect(() => {
    fetchRule();
  }, []);

  // Group rules by type
  const rulesByType = useMemo(() => {
    if (!rule) return {};
    return rule.reduce((acc, r) => {
      if (!acc[r.type]) acc[r.type] = [];
      acc[r.type].push(r);
      return acc;
    }, {} as Record<string, SustainabilityRule[]>);
  }, [rule]);

  // Filtered data for active tab + search
  const filteredData = useMemo(() => {
    const records = rulesByType[activeTab] || [];
    if (!searchTerm) return records;
    return records.filter(record =>
      Object.values(record).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rulesByType, activeTab, searchTerm]);

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const DetailModal = ({ rule, onClose }: { rule: SustainabilityRule; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${typeColors[rule.type as keyof typeof typeColors]}`}>
              {React.createElement(typeIcons[rule.type as keyof typeof typeIcons], { size: 24 })}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Rule Details</h2>
              <p className="text-sm text-gray-600">{typeNames[rule.type as keyof typeof typeNames]}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">NACE Code</label>
                <p className="mt-1 text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg">{rule.nace}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Sector</label>
                <p className="mt-1 text-gray-900">{rule.sector}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Activity Number</label>
                <p className="mt-1 text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg">{rule.activityNumber}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Contribution Type</label>
                <p className="mt-1 text-gray-900 bg-blue-50 text-blue-800 px-3 py-2 rounded-lg font-medium">{rule.contributionType}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Activity</label>
                <p className="mt-1 text-gray-900 leading-relaxed">{rule.activity}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Description</label>
              <p className="mt-1 text-gray-900 leading-relaxed bg-gray-50 p-4 rounded-lg">{rule.description}</p>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Substantial Contribution Criteria</label>
              <p className="mt-1 text-gray-900 leading-relaxed bg-green-50 p-4 rounded-lg border-l-4 border-green-400">{rule.substantialContributionCriteria}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Do No Significant Harm (DNSH) Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Climate Mitigation</label>
                <p className="mt-2 text-blue-900 text-sm leading-relaxed">{rule.climateMitigationDNSH}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <label className="text-sm font-semibold text-green-800 uppercase tracking-wide">Circular Economy</label>
                <p className="mt-2 text-green-900 text-sm leading-relaxed">{rule.circularEconomyDNSH}</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <label className="text-sm font-semibold text-teal-800 uppercase tracking-wide">Climate Adaptation</label>
                <p className="mt-2 text-teal-900 text-sm leading-relaxed">{rule.climateAdaptationDNSH}</p>
              </div>
              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                <label className="text-sm font-semibold text-cyan-800 uppercase tracking-wide">Water</label>
                <p className="mt-2 text-cyan-900 text-sm leading-relaxed">{rule.waterDNSH}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <label className="text-sm font-semibold text-purple-800 uppercase tracking-wide">Pollution Prevention</label>
                <p className="mt-2 text-purple-900 text-sm leading-relaxed">{rule.pollutionPreventionDNSH}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <label className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">Biodiversity</label>
                <p className="mt-2 text-emerald-900 text-sm leading-relaxed">{rule.biodiversityDNSH}</p>
              </div>
              {rule.footnotes && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Footnotes</label>
                  <p className="mt-2 text-gray-900 text-sm leading-relaxed">{rule.footnotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
  <div className="p-4 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-start gap-5 space-x-3 mb-4">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Database className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EU Taxonomy Sustainability Rules</h1>
            <p className="text-gray-600">Comprehensive database of environmental sustainability criteria</p>
          </div>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {Object.keys(rulesByType).map((type) => {
            const IconComponent = typeIcons[type as keyof typeof typeIcons];
            const isActive = activeTab === type;
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                  isActive
                    ? `${typeColors[type as keyof typeof typeColors]} shadow-md`
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {IconComponent && <IconComponent size={18} />}
                <span>{typeNames[type as keyof typeof typeNames]}</span>
                <span className="bg-white bg-opacity-70 text-xs px-2 py-1 rounded-full">
                  {rulesByType[type].length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NACE</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sector</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Activity #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contribution</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((rule) => (
                <tr
                  key={rule.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRule(rule)}
                >
                  <td className="px-6 py-4 max-w-[120px] overflow-hidden text-ellipsis">
                    <div className="inline-block bg-gray-100 text-gray-900 text-sm font-mono px-2 py-1 rounded whitespace-nowrap">
                      {rule.nace}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-[120px] truncate" title={rule.sector}>
                    <div className="text-sm text-gray-900">{truncateText(rule.sector, 30)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-[120px]">
                    <span className="text-sm font-mono text-gray-900 bg-blue-50 px-2 py-1 rounded">
                      {rule.activityNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-[120px] truncate" title={rule.activity}>
                    <div className="text-sm text-gray-900">{truncateText(rule.activity, 40)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-[120px]">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {rule.contributionType}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-[120px] truncate" title={rule.description}>
                    <div className="text-sm text-gray-900">{truncateText(rule.description, 50)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Database size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rules found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or select a different category.</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Showing {filteredData.length} of {rulesByType[activeTab]?.length || 0} rules in {typeNames[activeTab as keyof typeof typeNames]}
      </div>
    </div>

    {selectedRule && <DetailModal rule={selectedRule} onClose={() => setSelectedRule(null)} />}
  </div>
);
}

export default Rule;