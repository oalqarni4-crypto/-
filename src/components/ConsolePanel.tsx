import React, { useState, useEffect, useRef } from 'react';
import { ScriptRunLog, TelegramAlert } from '../types';
import { 
  Play, 
  Terminal, 
  MessageSquare, 
  BadgeAlert, 
  Settings, 
  Cpu, 
  Users,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  FileCode,
  Bell
} from 'lucide-react';

interface ConsolePanelProps {
  onRunScanSim: () => void;
  onAutoLearnSim: () => void;
  logs: ScriptRunLog[];
  telegramAlerts: TelegramAlert[];
  isScanning: boolean;
  isLearning: boolean;
  onClearLogs: () => void;
  botToken: string;
  chatId: string;
}

export default function ConsolePanel({
  onRunScanSim,
  onAutoLearnSim,
  logs,
  telegramAlerts,
  isScanning,
  isLearning,
  onClearLogs,
  botToken,
  chatId
}: ConsolePanelProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal' | 'telegram'>('terminal');
  const [codeContent, setCodeContent] = useState<string>(`/** 
 * 👑 نظام سكانر الموجة الصلبة الذكي - النسخة المليار من الذكاء الاصطناعي (V-Billionaire AI) 
 * منصة مالية متكاملة مربوطة بمحرك Gemini AI لتحليل الأخطاء وتطوير فلاتر ذاتياً
 * المطور والمالك: أبو كيان (عمر) 👑
 */

const BOT_TOKEN = "8697405191:AAEb-xv33Xsd--wZ0XijB4KTNBix3px2FYk";
const CHAT_ID = "@the_radar_bott";
const REPORT_EMAIL = "o.alqarni4@gmail.com";
const GEMINI_API_KEY = "AIzaSyAz_SheetsGen_783hk1j9q";

// 1. تشغيل الفلتر الحركي ومطابقة نظرية موجات إليوت والنسبة الذهبية
function runElliottWaveEngine() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reportSheet = ss.getSheetByName("سكانر الموجة الصلبة");
  const modelSheet = ss.getSheetByName("MODEL");
  
  let minVolume = Number(modelSheet.getRange(2, 2).getValue()) || 500000;
  let minFib = Number(modelSheet.getRange(3, 2).getValue()) || 0.48;
  let minScore = Number(modelSheet.getRange(4, 2).getValue()) || 75;
  
  // فحص الأسهم وحساب نسب الارتداد الفيبوناتشي
  let finalData = [];
  // ... حسابات خوارزمية إليوت الملقبة بالرادار ...
}`);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const telegramEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of logs/alerts
  useEffect(() => {
    if (activeTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (activeTab === 'telegram') {
      telegramEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, telegramAlerts, activeTab]);

  return (
    <div className="bg-royal-card-bg border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[520px]" id="royal-console-panel">
      
      {/* Console Header Tabs */}
      <div className="bg-slate-950 border-b border-slate-850 p-1 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center space-x-1 space-x-reverse">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-1.5 space-x-reverse px-4 py-2 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === 'editor' 
                ? 'bg-slate-900 border-b-2 border-b-royal-gold text-royal-gold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>محرر الكود الملكي (GAS Editor)</span>
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center space-x-1.5 space-x-reverse px-4 py-2 text-xs font-semibold rounded-t-lg relative transition-all ${
              activeTab === 'terminal' 
                ? 'bg-slate-900 border-b-2 border-b-royal-gold text-royal-gold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-royal-gold" />
            <span>الشاشة الكونسول الملكية (Console Logs)</span>
            {logs.length > 0 && (
              <span className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-royal-gold rounded-full animate-ping" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`flex items-center space-x-1.5 space-x-reverse px-4 py-2 text-xs font-semibold rounded-t-lg relative transition-all ${
              activeTab === 'telegram' 
                ? 'bg-slate-900 border-b-2 border-b-royal-gold text-royal-gold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span>قناة التليجرام اللحظية @the_radar_bott</span>
            {telegramAlerts.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 mr-1 font-mono">
                {telegramAlerts.length}
              </span>
            )}
          </button>
        </div>

        {/* Executive Quick Actions */}
        <div className="flex items-center space-x-2 space-x-reverse p-1 px-3">
          <button
            disabled={isScanning || isLearning}
            onClick={onRunScanSim}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded shadow-lg transition-all ${
              isScanning 
                ? 'bg-amber-600/30 text-amber-300 border border-amber-600/30 cursor-not-allowed animate-pulse' 
                : 'bg-gradient-to-r from-royal-gold to-yellow-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 cursor-pointer'
            }`}
          >
            <Play className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'جاري المسح...' : 'تشغيل محرك إليوت 🌊'}</span>
          </button>
          <button
            disabled={isScanning || isLearning}
            onClick={onAutoLearnSim}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded shadow-lg transition-all border ${
              isLearning 
                ? 'bg-teal-600/35 text-teal-300 border-teal-500/30 cursor-not-allowed animate-pulse' 
                : 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/30 hover:text-emerald-300 cursor-pointer'
            }`}
          >
            <Cpu className={`w-3 h-3 ${isLearning ? 'animate-spin' : ''}`} />
            <span>{isLearning ? 'جاري التعلم الذاتي...' : 'عقل الذكاء التوليدي 🧠'}</span>
          </button>
        </div>
      </div>

      {/* Panel Contents */}
      <div className="flex-1 bg-slate-950 p-4 font-mono text-sm overflow-y-auto overflow-x-hidden relative">
        
        {/* Editor Tab View */}
        {activeTab === 'editor' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2 text-xs text-slate-500 border-b border-slate-900 pb-2">
              <span className="flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-royal-gold" />
                ملف برمجية AppScript.js (أبو كيان رادار المفرقعات)
              </span>
              <span>الملكية الفكرية: عمر @2026</span>
            </div>
            <textarea
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              className="flex-1 bg-slate-950/60 text-slate-300 font-mono text-xs pr-4 border border-slate-900 p-3 rounded focus:outline-none focus:border-royal-gold resize-none h-[340px]"
              dir="ltr"
              spellCheck="false"
            />
            <div className="text-[10px] text-slate-500 text-right mt-1.5 font-sans">
              * مبرمج على دالة التغذية الراجعة التلقائية المطورّة لتحديث شيت MODEL مباشرة بعد فحص السوق من الخطأ الملكي.
            </div>
          </div>
        )}

        {/* Terminal Logs Tab View */}
        {activeTab === 'terminal' && (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-2 h-[340px] overflow-y-auto scrollbar-none pr-3" dir="rtl">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-slate-600 h-full py-10 space-y-2 font-sans">
                  <Terminal className="w-10 h-10 stroke-1 opacity-40 text-royal-gold animate-pulse" />
                  <p className="text-xs">شاشة الكونسول فارغة. اضغط على 'تشغيل محرك إليوت' لبدء بث التحديثات الفورية.</p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex text-xs space-x-2 space-x-reverse border-b border-slate-950 pb-1.5 leading-relaxed">
                    <span className="text-slate-500 font-mono flex-shrink-0">[{log.timestamp}]</span>
                    {log.type === 'success' && <span className="text-emerald-400 font-bold flex-shrink-0">[نجاح]</span>}
                    {log.type === 'warn' && <span className="text-amber-400 font-bold flex-shrink-0">[تنبيه]</span>}
                    {log.type === 'error' && <span className="text-rose-400 font-bold flex-shrink-0">[خطأ]</span>}
                    {log.type === 'info' && <span className="text-blue-400 font-bold flex-shrink-0">[معلومات]</span>}
                    <span className="text-slate-350 pr-1">{log.message}</span>
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Clear Button */}
            {logs.length > 0 && (
              <div className="flex justify-end pt-2 border-t border-slate-900 font-sans" dir="rtl">
                <button
                  onClick={onClearLogs}
                  className="px-2.5 py-1 text-xs rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-royal-gold hover:border-royal-gold transition-colors cursor-pointer"
                >
                  مسح السجلات والشبكة
                </button>
              </div>
            )}
          </div>
        )}

        {/* Telegram Tab View */}
        {activeTab === 'telegram' && (
          <div className="flex flex-col h-full justify-between">
            <div className="mb-2 bg-sky-950/20 border border-sky-900/30 rounded p-2.5 flex items-center justify-between text-xs font-sans" dir="rtl">
              <div className="flex items-center gap-2">
                <div className="p-1 px-2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold flex items-center">
                  <BadgeAlert className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-sky-300">رادار موجات رويال</h4>
                  <p className="text-[10px] text-sky-400">اسم القناة: {chatId}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <Users className="w-3 h-3 text-sky-400" />
                <span>شاشة البث الفوري للتحديث</span>
              </div>
            </div>

            <div className="space-y-3 flex-1 h-[250px] overflow-y-auto pr-3" dir="rtl">
              {telegramAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-slate-600 h-full py-10 space-y-2 font-sans">
                  <MessageSquare className="w-10 h-10 stroke-1 opacity-40 text-sky-400 animate-bounce" />
                  <p className="text-xs">لا توجد إشعارات مبثوثة حالياً. انتظر حتى تحدد وويف أو سهم 'دبل' لإرساله.</p>
                </div>
              ) : (
                telegramAlerts.map((alert) => (
                  <div key={alert.id} className="bg-slate-900/80 border border-sky-950/50 rounded-lg p-3 text-slate-200 shadow-md border-r-4 border-r-sky-500 relative">
                    <div className="absolute top-2 left-3 font-mono text-[9px] text-slate-600">{alert.timestamp}</div>
                    <pre className="font-sans text-[11px] whitespace-pre-wrap leading-relaxed text-slate-300 font-medium" dangerouslySetInnerHTML={{ __html: alert.message }} />
                  </div>
                ))
              )}
              <div ref={telegramEndRef} />
            </div>

            <div className="text-[10px] text-slate-600 text-center font-sans mt-2" dir="rtl">
              * تم تفعيل بوت التلغرام الملكي <code>{botToken.substring(0, 8)}...</code> للبث التلقائي للمستثمر الملكي أبو كيان.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
