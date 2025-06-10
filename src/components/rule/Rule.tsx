import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Filter, Database, Leaf, Droplets, TreePine, Shield, Recycle, Wind } from 'lucide-react';
import axios from 'axios';

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

// Sample data with your exact structure
// const sampleData: Record<string, SustainabilityRule[]> = {
//   CLIMATE_MITIGATION: [
//     {
//       id: 1,
//       type: "CLIMATE_MITIGATION",
//       nace: "A.01.11",
//       sector: "Agriculture, forestry and fishing",
//       activityNumber: "1.1",
//       activity: "Forest management activities that contribute to climate change mitigation through sustainable forest practices, carbon sequestration, and biodiversity conservation",
//       contributionType: "Substantial Contribution",
//       description: "This activity involves the implementation of sustainable forest management practices that enhance carbon storage, promote biodiversity, and contribute to climate change mitigation efforts through responsible forestry operations.",
//       substantialContributionCriteria: "The activity contributes substantially to climate change mitigation by implementing forest management practices that result in net removals of greenhouse gases from the atmosphere and enhance long-term carbon storage in forest ecosystems.",
//       climateMitigationDNSH: "Not applicable - this is the environmental objective to which the activity contributes substantially.",
//       circularEconomyDNSH: "The activity does not lead to significant inefficiencies in the use of materials or in the direct or indirect use of natural resources throughout the life cycle.",
//       climateAdaptationDNSH: "The activity does not lead to an increased adverse impact of the current climate and the expected future climate on the activity itself or on people, nature or assets.",
//       waterDNSH: "The activity does not lead to significant harm to the good status or good ecological potential of bodies of water including surface water and groundwater.",
//       pollutionPreventionDNSH: "The activity does not lead to significant increases in the emissions of pollutants into air, water or land.",
//       biodiversityDNSH: "The activity does not lead to significant harm to the good condition and resilience of ecosystems or to the conservation status of habitats and species.",
//       footnotes: "This activity requires compliance with relevant EU and national legislation on forest management and environmental protection."
//     },
//     {
//       id: 2,
//       type: "CLIMATE_MITIGATION",
//       nace: "D.35.11",
//       sector: "Electricity, gas, steam and air conditioning supply",
//       activityNumber: "4.1",
//       activity: "Electricity generation using solar photovoltaic technology",
//       contributionType: "Substantial Contribution",
//       description: "Generation of electricity using solar photovoltaic panels that convert sunlight directly into electricity without greenhouse gas emissions during operation.",
//       substantialContributionCriteria: "The activity generates electricity with life cycle GHG emissions lower than 100g CO2e/kWh.",
//       climateMitigationDNSH: "Not applicable - this is the environmental objective to which the activity contributes substantially.",
//       circularEconomyDNSH: "The activity implements measures for waste prevention and management during construction and operation phases.",
//       climateAdaptationDNSH: "Physical climate risks have been identified and addressed through appropriate adaptation solutions.",
//       waterDNSH: "Water use is optimized and does not compromise water resources in water-stressed areas.",
//       pollutionPreventionDNSH: "Emissions to air, water and land are prevented or minimized through best available techniques.",
//       biodiversityDNSH: "Environmental impact assessments have been conducted and mitigation measures implemented.",
//       footnotes: "Compliance with relevant technical standards and environmental regulations is required."
//     }
//   ],
//   CIRCULAR_ECONOMY: [
//     {
//       id: 3,
//       type: "CIRCULAR_ECONOMY",
//       nace: "E.38.32",
//       sector: "Water supply; sewerage, waste management and remediation activities",
//       activityNumber: "5.9",
//       activity: "Material recovery from non-hazardous waste",
//       contributionType: "Substantial Contribution",
//       description: "Recovery of materials from non-hazardous waste through sorting, cleaning, and processing to produce secondary raw materials.",
//       substantialContributionCriteria: "The activity recovers materials that substitute virgin materials in production processes, contributing to circular economy principles.",
//       climateMitigationDNSH: "The activity does not lead to significant greenhouse gas emissions compared to alternative waste treatment options.",
//       circularEconomyDNSH: "Not applicable - this is the environmental objective to which the activity contributes substantially.",
//       climateAdaptationDNSH: "Climate risks have been assessed and appropriate adaptation measures implemented.",
//       waterDNSH: "Water consumption and discharge are managed to prevent harm to water bodies.",
//       pollutionPreventionDNSH: "Best available techniques are used to prevent pollution during material recovery processes.",
//       biodiversityDNSH: "Operations do not significantly harm local ecosystems and biodiversity.",
//       footnotes: "Activity must comply with waste management regulations and quality standards for recovered materials."
//     }
//   ],
//   WATER: [
//     {
//       id: 4,
//       type: "WATER",
//       nace: "E.36.00",
//       sector: "Water collection, treatment and supply",
//       activityNumber: "6.1",
//       activity: "Water collection, treatment and supply systems",
//       contributionType: "Substantial Contribution",
//       description: "Collection, treatment and supply of water for human consumption and other uses, including infrastructure for water distribution.",
//       substantialContributionCriteria: "The activity contributes to the sustainable use and protection of water resources through efficient collection, treatment and distribution systems.",
//       climateMitigationDNSH: "Energy efficiency measures are implemented to minimize greenhouse gas emissions from operations.",
//       circularEconomyDNSH: "Water reuse and recycling opportunities are maximized where technically feasible.",
//       climateAdaptationDNSH: "Infrastructure is designed to be resilient to climate change impacts including extreme weather events.",
//       waterDNSH: "Not applicable - this is the environmental objective to which the activity contributes substantially.",
//       pollutionPreventionDNSH: "Treatment processes prevent pollution of water bodies and comply with discharge standards.",
//       biodiversityDNSH: "Water abstraction does not compromise the ecological status of water bodies and associated ecosystems.",
//       footnotes: "Compliance with drinking water quality standards and environmental permits is mandatory."
//     }
//   ],
//   BIODIVERSITY: [
//     {
//       id: 5,
//       type: "BIODIVERSITY",
//       nace: "A.02.40",
//       sector: "Agriculture, forestry and fishing",
//       activityNumber: "1.3",
//       activity: "Conservation forestry",
//       contributionType: "Substantial Contribution",
//       description: "Forest management activities focused on biodiversity conservation, habitat protection, and ecosystem restoration.",
//       substantialContributionCriteria: "The activity contributes substantially to biodiversity conservation through habitat protection, species conservation, and ecosystem restoration measures.",
//       climateMitigationDNSH: "Forest management practices maintain or enhance carbon storage capacity.",
//       circularEconomyDNSH: "Sustainable use of forest resources without compromising ecosystem integrity.",
//       climateAdaptationDNSH: "Forest management enhances ecosystem resilience to climate change impacts.",
//       waterDNSH: "Activities protect watershed functions and water quality.",
//       pollutionPreventionDNSH: "Management practices prevent soil, water, and air pollution.",
//       biodiversityDNSH: "Not applicable - this is the environmental objective to which the activity contributes substantially.",
//       footnotes: "Activities must be conducted in accordance with biodiversity conservation plans and relevant legislation."
//     }
//   ],
//   POLLUTION_PREVENTION: [
//     {
//       id: 6,
//       type: "POLLUTION_PREVENTION",
//       nace: "E.39.00",
//       sector: "Remediation activities and other waste management services",
//       activityNumber: "7.4",
//       activity: "Remediation of contaminated sites and areas",
//       contributionType: "Substantial Contribution",
//       description: "Activities aimed at removing, controlling or reducing contamination in soil, groundwater, or surface water to prevent pollution and protect human health and the environment.",
//       substantialContributionCriteria: "The activity contributes substantially to pollution prevention and control by removing or reducing existing contamination and preventing further pollution spread.",
//       climateMitigationDNSH: "Remediation techniques minimize greenhouse gas emissions and energy consumption.",
//       circularEconomyDNSH: "Remediation processes maximize resource recovery and minimize waste generation.",
//       climateAdaptationDNSH: "Remediation solutions are resilient to climate change impacts.",
//       waterDNSH: "Remediation protects and improves water quality without causing harm to water bodies.",
//       pollutionPreventionDNSH: "Not applicable - this is the environmental objective to which the activity contributes substantially.",
//       biodiversityDNSH: "Remediation activities restore ecosystem functions and do not harm biodiversity.",
//       footnotes: "Remediation must meet applicable environmental standards and regulatory requirements."
//     }
//   ],
//   CLIMATE_ADAPTATION: [
//     {
//       id: 7,
//       type: "CLIMATE_ADAPTATION",
//       nace: "F.42.91",
//       sector: "Construction",
//       activityNumber: "8.2",
//       activity: "Construction of flood defences",
//       contributionType: "Substantial Contribution",
//       description: "Construction of infrastructure designed to protect against flooding and other climate-related risks, including sea walls, flood barriers, and drainage systems.",
//       substantialContributionCriteria: "The activity contributes substantially to climate change adaptation by reducing climate risks for human activities, people, nature or assets.",
//       climateMitigationDNSH: "Construction materials and processes minimize greenhouse gas emissions through sustainable practices.",
//       circularEconomyDNSH: "Construction incorporates circular economy principles including material reuse and recycling.",
//       climateAdaptationDNSH: "Not applicable - this is the environmental objective to which the activity contributes substantially.",
//       waterDNSH: "Flood defence systems are designed to work with natural water systems without causing harm.",
//       pollutionPreventionDNSH: "Construction activities prevent pollution of soil, water, and air through best practices.",
//       biodiversityDNSH: "Infrastructure design incorporates measures to minimize impacts on local ecosystems and species.",
//       footnotes: "Construction must comply with building codes, environmental regulations, and climate resilience standards."
//     }
//   ]
// };

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
    const resRule = await axios.get('http://localhost:8080/api/rules');
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