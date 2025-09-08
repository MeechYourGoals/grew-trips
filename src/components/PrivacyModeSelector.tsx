import React from 'react';
import { Shield, Bot, Lock, CheckCircle, XCircle } from 'lucide-react';
import { PrivacyMode, PRIVACY_MODE_CONFIG, getDefaultPrivacyMode } from '../types/privacy';
import { Card, CardContent } from './ui/card';

interface PrivacyModeSelectorProps {
  tripType: 'consumer' | 'pro' | 'event';
  selectedMode: PrivacyMode;
  onModeChange: (mode: PrivacyMode) => void;
  showOverrideOption?: boolean;
}

export const PrivacyModeSelector = ({
  tripType,
  selectedMode,
  onModeChange,
  showOverrideOption = true
}: PrivacyModeSelectorProps) => {
  const defaultMode = getDefaultPrivacyMode(tripType);
  const isOverriding = selectedMode !== defaultMode;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Shield className="text-blue-400" size={20} />
        <h3 className="text-lg font-semibold text-white">Privacy & Security</h3>
      </div>

      {/* Default recommendation */}
      <div className="bg-slate-700/30 rounded-xl p-3 border border-slate-600/50">
        <p className="text-sm text-slate-300">
          <strong>Recommended for {tripType} trips:</strong> {PRIVACY_MODE_CONFIG[defaultMode].label}
        </p>
        {showOverrideOption && (
          <p className="text-xs text-slate-400 mt-1">
            You can override this default below.
          </p>
        )}
      </div>

      {/* Privacy mode options */}
      <div className="grid gap-3">
        {Object.entries(PRIVACY_MODE_CONFIG).map(([mode, config]) => (
          <Card
            key={mode}
            className={`cursor-pointer transition-all border-2 ${
              selectedMode === mode
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
            }`}
            onClick={() => onModeChange(mode as PrivacyMode)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{config.icon}</div>
                  <div>
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      {config.label}
                      {mode === defaultMode && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          Recommended
                        </span>
                      )}
                      {isOverriding && selectedMode === mode && (
                        <span className="text-xs bg-amber-600 text-white px-2 py-1 rounded-full">
                          Override
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-slate-400">{config.description}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMode === mode
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-400'
                }`}>
                  {selectedMode === mode && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  {config.features.ai_concierge ? (
                    <CheckCircle className="text-green-400" size={16} />
                  ) : (
                    <XCircle className="text-red-400" size={16} />
                  )}
                  <span className="text-slate-300">AI Concierge</span>
                </div>
                <div className="flex items-center gap-2">
                  {config.features.smart_suggestions ? (
                    <CheckCircle className="text-green-400" size={16} />
                  ) : (
                    <XCircle className="text-red-400" size={16} />
                  )}
                  <span className="text-slate-300">Smart Suggestions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="text-blue-400" size={16} />
                  <span className="text-slate-300">
                    {config.features.message_encryption === 'e2ee' ? 'End-to-End' : 'Server'} Encrypted
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="text-slate-400" size={16} />
                  <span className="text-slate-300">
                    {config.compliance.length} Compliance Standards
                  </span>
                </div>
              </div>

              {/* Compliance badges */}
              <div className="flex flex-wrap gap-1 mt-3">
                {config.compliance.map((standard) => (
                  <span
                    key={standard}
                    className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full"
                  >
                    {standard}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Warning for high privacy mode */}
      {selectedMode === 'high' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <Lock className="text-amber-400 mt-0.5" size={16} />
            <div className="text-sm">
              <p className="text-amber-400 font-medium">High Privacy Mode Selected</p>
              <p className="text-amber-300/80 mt-1">
                Your messages will be end-to-end encrypted and AI features will be disabled. 
                This provides maximum privacy but removes smart suggestions and automated assistance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};