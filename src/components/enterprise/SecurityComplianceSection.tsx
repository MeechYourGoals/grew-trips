import React, { useState } from 'react';
import { Shield, Lock, FileCheck, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';

export const SecurityComplianceSection = () => {
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [mfaRequired, setMfaRequired] = useState(true);
  const [gdprCompliance, setGdprCompliance] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);

  const complianceItems = [
    {
      title: 'GDPR Compliance',
      status: 'compliant',
      progress: 100,
      description: 'All data processing meets GDPR requirements'
    },
    {
      title: 'SOC 2 Type II',
      status: 'in-progress',
      progress: 85,
      description: 'Security audit in progress'
    },
    {
      title: 'Data Retention Policy',
      status: 'compliant',
      progress: 100,
      description: 'Automated data lifecycle management active'
    },
    {
      title: 'Access Control Review',
      status: 'warning',
      progress: 60,
      description: 'Quarterly review due in 2 weeks'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'in-progress':
        return <Shield size={16} className="text-blue-400" />;
      default:
        return <AlertTriangle size={16} className="text-red-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Security & Compliance</h3>
        <Button variant="outline" size="sm">
          <Download size={16} className="mr-2" />
          Export Report
        </Button>
      </div>

      {/* Security Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lock size={20} />
          Authentication & Access
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Single Sign-On (SSO)</div>
              <div className="text-sm text-gray-400">SAML 2.0 integration with your identity provider</div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">Configure</Button>
              <Switch checked={ssoEnabled} onCheckedChange={setSsoEnabled} />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Multi-Factor Authentication</div>
              <div className="text-sm text-gray-400">Require MFA for all organization members</div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">Configure</Button>
              <Switch checked={mfaRequired} onCheckedChange={setMfaRequired} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Audit Logging</div>
              <div className="text-sm text-gray-400">Comprehensive activity logging for compliance</div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">View Logs</Button>
              <Switch checked={auditLogging} onCheckedChange={setAuditLogging} />
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Dashboard */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileCheck size={20} />
          Compliance Status
        </h4>
        <div className="space-y-4">
          {complianceItems.map((item, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div className="text-white font-medium">{item.title}</div>
                </div>
                <span className="text-sm text-gray-400">{item.progress}%</span>
              </div>
              <div className="text-sm text-gray-400 mb-2">{item.description}</div>
              <Progress value={item.progress} className="h-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Data Management</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">GDPR Compliance</div>
              <div className="text-sm text-gray-400">Automated data subject rights and privacy controls</div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">Manage</Button>
              <Switch checked={gdprCompliance} onCheckedChange={setGdprCompliance} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <Download size={16} className="mr-2" />
              Export User Data
            </Button>
            <Button variant="outline" className="justify-start">
              <FileCheck size={16} className="mr-2" />
              Privacy Policy
            </Button>
          </div>
        </div>
      </div>

      {/* Identity Providers */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Identity Providers</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white">Azure Active Directory</span>
            <CheckCircle size={16} className="text-green-400" />
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white">Google Workspace</span>
            <Button variant="ghost" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white">Okta</span>
            <Button variant="ghost" size="sm">Configure</Button>
          </div>
        </div>
      </div>
    </div>
  );
};