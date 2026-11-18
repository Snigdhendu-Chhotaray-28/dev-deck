import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Copy,
  Check,
  Code2,
  KeyRound,
  Binary,
  Clock,
  Fingerprint,
} from 'lucide-react';
import { WidgetCard } from '../ui/WidgetCard';
import { useDashboard } from '../../context/DashboardContext';

type ToolTab = 'json' | 'jwt' | 'base64' | 'timestamp' | 'uuid';

export const DevToolsWidget: React.FC = () => {
  const { widgets } = useDashboard();
  const widgetConfig = widgets.find((w) => w.id === 'devtools');

  const [activeTab, setActiveTab] = useState<ToolTab>('json');
  const [copied, setCopied] = useState<string | null>(null);

  // JSON Tool State
  const [jsonInput, setJsonInput] = useState('{"service":"devdeck","version":1,"active":true}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // JWT Tool State
  const [jwtInput, setJwtInput] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldkRlY2sgRW5naW5lZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTgwMDAwMDAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  );
  const [jwtHeader, setJwtHeader] = useState('');
  const [jwtPayload, setJwtPayload] = useState('');
  const [jwtExpStatus, setJwtExpStatus] = useState('');

  // Base64 Tool State
  const [b64Raw, setB64Raw] = useState('DevDeck Command Center 🚀');
  const [b64Encoded, setB64Encoded] = useState('');

  // Timestamp State
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [inputEpoch, setInputEpoch] = useState(String(Math.floor(Date.now() / 1000)));
  const [convertedDate, setConvertedDate] = useState('');

  // UUID State
  const [uuids, setUuids] = useState<string[]>([]);

  // Update live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format JSON handler
  const handleFormatJson = (beautify: boolean) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, beautify ? 2 : 0));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON syntax');
    }
  };

  // Decode JWT
  useEffect(() => {
    if (!jwtInput.trim()) {
      setJwtHeader('');
      setJwtPayload('');
      return;
    }
    const parts = jwtInput.trim().split('.');
    if (parts.length < 2) {
      setJwtExpStatus('Invalid JWT structure (requires header.payload.signature)');
      return;
    }
    try {
      const headerStr = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
      const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      setJwtHeader(JSON.stringify(JSON.parse(headerStr), null, 2));

      const payloadObj = JSON.parse(payloadStr);
      setJwtPayload(JSON.stringify(payloadObj, null, 2));

      if (payloadObj.exp) {
        const expDate = new Date(payloadObj.exp * 1000);
        const isExpired = Date.now() > payloadObj.exp * 1000;
        setJwtExpStatus(
          isExpired
            ? `⚠️ Expired on: ${expDate.toLocaleString()}`
            : `✅ Valid until: ${expDate.toLocaleString()}`
        );
      } else {
        setJwtExpStatus('No expiration (exp) claim present');
      }
    } catch (e) {
      setJwtExpStatus('Error decoding JWT payload');
    }
  }, [jwtInput]);

  // Base64 transforms
  useEffect(() => {
    try {
      setB64Encoded(btoa(unescape(encodeURIComponent(b64Raw))));
    } catch {
      setB64Encoded('Error encoding string');
    }
  }, [b64Raw]);

  // Epoch convert
  useEffect(() => {
    const num = parseInt(inputEpoch, 10);
    if (!isNaN(num)) {
      // If length is 10 it's seconds, if 13 it's ms
      const ms = num < 10000000000 ? num * 1000 : num;
      setConvertedDate(new Date(ms).toUTCString() + ' (UTC)');
    } else {
      setConvertedDate('Invalid timestamp');
    }
  }, [inputEpoch]);

  // Generate UUIDs
  const generateUuids = (count = 1) => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(crypto.randomUUID());
    }
    setUuids(results);
  };

  useEffect(() => {
    generateUuids(3);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  if (!widgetConfig || !widgetConfig.enabled) return null;

  return (
    <WidgetCard
      id="devtools"
      title="Developer Utilities & Toolbox"
      subtitle="Client-side JSON, JWT, Base64 & Epoch helpers"
      icon={<Wrench className="w-4 h-4 text-amber-400" />}
      colSpan={widgetConfig.colSpan}
    >
      <div className="space-y-3">
        {/* Tool Selector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-800 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'json'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> JSON
          </button>
          <button
            onClick={() => setActiveTab('jwt')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'jwt'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> JWT
          </button>
          <button
            onClick={() => setActiveTab('base64')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'base64'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Binary className="w-3.5 h-3.5" /> Base64
          </button>
          <button
            onClick={() => setActiveTab('timestamp')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'timestamp'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Epoch
          </button>
          <button
            onClick={() => setActiveTab('uuid')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'uuid'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" /> UUID
          </button>
        </div>

        {/* Tab 1: JSON Formatter */}
        {activeTab === 'json' && (
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Raw Input:</span>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste JSON string here..."
                  className="w-full h-28 p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Formatted Output:</span>
                <textarea
                  value={jsonOutput}
                  readOnly
                  placeholder="Formatted JSON appears here..."
                  className="w-full h-28 p-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-mono text-[11px] focus:outline-none"
                />
              </div>
            </div>

            {jsonError && (
              <p className="text-rose-400 text-[11px] font-mono">⚠️ {jsonError}</p>
            )}

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFormatJson(true)}
                  className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-medium"
                >
                  Beautify (2 Spaces)
                </button>
                <button
                  onClick={() => handleFormatJson(false)}
                  className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Minify
                </button>
              </div>

              {jsonOutput && (
                <button
                  onClick={() => copyToClipboard(jsonOutput, 'json')}
                  className="flex items-center gap-1 text-slate-400 hover:text-amber-300"
                >
                  {copied === 'json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: JWT Inspector */}
        {activeTab === 'jwt' && (
          <div className="space-y-2 text-xs">
            <input
              type="text"
              value={jwtInput}
              onChange={(e) => setJwtInput(e.target.value)}
              placeholder="Paste Bearer JWT token..."
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-amber-500"
            />
            <div className="text-[11px] font-mono text-cyan-400">{jwtExpStatus}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div>
                <span className="text-[10px] text-slate-500">Decoded Header:</span>
                <pre className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-purple-300 overflow-x-auto max-h-24">
                  {jwtHeader || '{}'}
                </pre>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Decoded Payload:</span>
                <pre className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 overflow-x-auto max-h-24">
                  {jwtPayload || '{}'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Base64 */}
        {activeTab === 'base64' && (
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-mono">Plain Text / UTF-8:</span>
              <input
                type="text"
                value={b64Raw}
                onChange={(e) => setB64Raw(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px]"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">Base64 Encoded:</span>
                <button
                  onClick={() => copyToClipboard(b64Encoded, 'b64')}
                  className="text-slate-400 hover:text-amber-300 flex items-center gap-1 text-[10px]"
                >
                  {copied === 'b64' ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                  Copy
                </button>
              </div>
              <input
                type="text"
                value={b64Encoded}
                readOnly
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-mono text-[11px]"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Epoch Timestamp */}
        {activeTab === 'timestamp' && (
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Current UTC Epoch:</span>
              <span className="text-amber-400 font-bold text-sm">{currentEpoch}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500">Epoch to Human Date:</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputEpoch}
                  onChange={(e) => setInputEpoch(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 flex-1 text-xs"
                />
                <button
                  onClick={() => setInputEpoch(String(Math.floor(Date.now() / 1000)))}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] hover:bg-slate-700"
                >
                  Now
                </button>
              </div>
              <p className="text-emerald-400 text-[11px] pt-1">{convertedDate}</p>
            </div>
          </div>
        )}

        {/* Tab 5: UUID Generator */}
        {activeTab === 'uuid' && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Cryptographic UUIDv4:</span>
              <button
                onClick={() => generateUuids(3)}
                className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-mono"
              >
                Regenerate
              </button>
            </div>
            <div className="space-y-1.5">
              {uuids.map((uuid, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]"
                >
                  <span className="truncate">{uuid}</span>
                  <button
                    onClick={() => copyToClipboard(uuid, `uuid-${i}`)}
                    className="ml-2 text-slate-500 hover:text-amber-300"
                  >
                    {copied === `uuid-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </WidgetCard>
  );
};

