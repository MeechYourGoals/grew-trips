
import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Bot, Plus } from 'lucide-react';

export const ComplianceCenter = () => {
  const [rules] = useState([
    {
      id: '1',
      category: 'NCAA' as const,
      title: 'Student-Athlete Eligibility Check',
      description: 'Verify all participants maintain academic eligibility',
      deadline: '2025-01-30',
      status: 'compliant' as const,
      riskLevel: 'low' as const
    },
    {
      id: '2',
      category: 'Union' as const,
      title: 'Crew Working Hours Compliance',
      description: 'Ensure union crew working hours comply with local regulations',
      deadline: '2025-01-25',
      status: 'warning' as const,
      riskLevel: 'medium' as const
    },
    {
      id: '3',
      category: 'Safety' as const,
      title: 'Equipment Safety Certification',
      description: 'All rigging equipment must be certified within 30 days',
      deadline: '2025-01-20',
      status: 'violation' as const,
      riskLevel: 'high' as const
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle size={16} className="text-green-400" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'violation': return <AlertTriangle size={16} className="text-red-400" />;
      default: return <Shield size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'violation': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield size={24} className="text-glass-orange" />
          Compliance Center
        </h3>
        <div className="flex gap-2">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Bot size={16} />
            AI Risk Scan
          </button>
          <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Plus size={16} />
            Add Rule
          </button>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{rules.length}</div>
          <div className="text-sm text-gray-400">Total Rules</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {rules.filter(r => r.status === 'compliant').length}
          </div>
          <div className="text-sm text-gray-400">Compliant</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">
            {rules.filter(r => r.status === 'warning').length}
          </div>
          <div className="text-sm text-gray-400">Warnings</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">
            {rules.filter(r => r.status === 'violation').length}
          </div>
          <div className="text-sm text-gray-400">Violations</div>
        </div>
      </div>

      {/* Rules List */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Compliance Rules</h4>
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(rule.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-white font-medium">{rule.title}</h5>
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                        {rule.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{rule.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(rule.status)}`}>
                    {rule.status.toUpperCase()}
                  </span>
                  <button className="text-glass-orange hover:text-glass-orange/80 text-sm">Review</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="text-gray-400">
                  <span className="text-white">Deadline:</span> {rule.deadline}
                </div>
                <div className="text-gray-400">
                  <span className="text-white">Risk Level:</span> 
                  <span className={`ml-1 ${getRiskColor(rule.riskLevel)}`}>
                    {rule.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Risk Analysis */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bot size={20} className="text-blue-400" />
          AI Risk Analysis
        </h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-yellow-400 mt-1" />
            <div>
              <div className="text-white font-medium">Equipment Certification Alert</div>
              <div className="text-sm text-gray-400">
                3 pieces of rigging equipment are approaching certification expiry. 
                Schedule inspections within 5 days to avoid compliance violations.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle size={16} className="text-green-400 mt-1" />
            <div>
              <div className="text-white font-medium">Union Compliance Good</div>
              <div className="text-sm text-gray-400">
                All crew scheduling is within union guidelines. No violations detected.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
