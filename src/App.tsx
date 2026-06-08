import React, { useState, useEffect, useRef } from 'react';
import { 
  GlobalMarketRow, 
  SolidWaveScannerRow, 
  PortfolioRow, 
  ModelCriteria, 
  HistoryRow, 
  ScriptRunLog, 
  TelegramAlert,
  WaveChartColors
} from './types';
import WaveChart from './components/WaveChart';
import SpreadsheetGrid from './components/SpreadsheetGrid';
import ConsolePanel from './components/ConsolePanel';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  RadarChart 
} from 'recharts';
import { 
  Crown, 
  TrendingUp, 
  TrendingDown, 
  Compass, 
  Flame, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  HelpCircle,
  Clock,
  Heart,
  Plus,
  Trash2,
  Lock,
  Wifi,
  Sparkles,
  FileSpreadsheet,
  Copy,
  Check,
  Eye,
  Percent,
  Award,
  Moon,
  Sun,
  Palette,
  Sliders
} from 'lucide-react';
import { appsScriptCode, installationInstructions } from './data/appsScriptTemplate';

export default function App() {
  // Spreadsheet States
  const [globalMarkets, setGlobalMarkets] = useState<GlobalMarketRow[]>([]);
  const [solidWaveScanner, setSolidWaveScanner] = useState<SolidWaveScannerRow[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioRow[]>([]);
  const [modelCriteria, setModelCriteria] = useState<ModelCriteria>({
    minVolume: 500000,
    minFib: 0.48,
    minScore: 75
  });
  const [dealHistory, setDealHistory] = useState<HistoryRow[]>([]);

  // Simulation states
  const [isScanning, setIsScanning] = useState(false);
  const [isLearning, setIsLearning] = useState(false);
  const [logs, setLogs] = useState<ScriptRunLog[]>([]);
  const [telegramAlerts, setTelegramAlerts] = useState<TelegramAlert[]>([]);
  const [activeSpreadsheetTab, setActiveSpreadsheetTab] = useState<number>(1); // default 'سكانر الموجة الصلبة'
  const [selectedStock, setSelectedStock] = useState<SolidWaveScannerRow | null>(null);
  
  // Audio, speech & layout controls
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [ultraDarkMode, setUltraDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vBillionaireUltraDark') === 'true';
    } catch {
      return false;
    }
  });
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isCustomSymbolModalOpen, setIsCustomSymbolModalOpen] = useState(false);
  const [isAppsScriptModalOpen, setIsAppsScriptModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'instructions' | 'code'>('instructions');
  
  // Custom Symbol input state
  const [newSym, setNewSym] = useState('');
  const [newName, setNewName] = useState('');

  // Live Server Health indicators
  const [serverStatus, setServerStatus] = useState<'online' | 'offline'>('online');
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  // Load Initial Data from Server-Side Express API
  const fetchInitialData = async () => {
    try {
      const res = await fetch('/api/sheets');
      if (res.ok) {
        const data = await res.json();
        setGlobalMarkets(data.globalMarkets);
        setSolidWaveScanner(data.solidWaveScanner);
        setPortfolio(data.portfolio);
        setModelCriteria(data.modelCriteria);
        setDealHistory(data.dealHistory);

        // Select the first stock by default
        if (data.solidWaveScanner.length > 0) {
          setSelectedStock(data.solidWaveScanner[0]);
        }
      }
    } catch (err) {
      console.error("Error connecting to server backend:", err);
      setServerStatus('offline');
    }
  };

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHasGeminiKey(data.hasGeminiApiKey);
        setServerStatus('online');
      }
    } catch {
      setServerStatus('offline');
    }
  };

  useEffect(() => {
    fetchInitialData();
    checkHealth();

    // Clock
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Voice Alert synthesis engine in Arabic
  const playVoiceAlert = (text: string) => {
    if (!speechEnabled) return;
    try {
      if ('speechSynthesis' in window) {
        // Clear any current uttering
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech synthesis error: ", e);
    }
  };

  // Run wave engine scanner simulation
  const handleRunScanSim = async () => {
    setIsScanning(true);
    addLog('info', '⚙️ تم استدعاء دالة المسح الكلي لجميع الرموز والأسواق الملكية...');
    
    // Step-by-step console logs to simulate realistic Apps Script workbook executions
    setTimeout(() => {
      addLog('info', '📡 الاتصال بمخدم GOOGLEFINANCE لجلب السعر اللحظي للأسهم السعودية...');
    }, 1000);

    setTimeout(() => {
      addLog('info', '🌊 فحص تصحيحات فيبوناتشي للموجة الثانية (Wave 2 Retracements)...');
    }, 2000);

    setTimeout(async () => {
      try {
        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            minVolume: modelCriteria.minVolume,
            minFib: modelCriteria.minFib,
            minScore: modelCriteria.minScore
          })
        });

        if (response.ok) {
          const data = await response.json();
          setSolidWaveScanner(data.solidWaveScanner);
          setPortfolio(data.portfolio);
          
          addLog('success', '🏆 تم الانتهاء بنجاح من فحص الموجة الدافعة وتحديث ورقة "سكانر الموجة الصلبة"!');
          
          // Select highest-scoring stock
          if (data.solidWaveScanner.length > 0) {
            const best = data.solidWaveScanner[0];
            setSelectedStock(best);

            // Trigger speech announcement if a "دبل" signal exists
            const hasDouble = data.solidWaveScanner.some((s: any) => s.signal === 'دبل 🔥');
            const doubleStock = data.solidWaveScanner.find((s: any) => s.signal === 'دبل 🔥');
            
            if (hasDouble && doubleStock) {
              addLog('warn', `🚨 تم رصد نمط دبل بريك آوت حرج في سهم: ${doubleStock.name} (${doubleStock.symbol})!`);
              playVoiceAlert(`أبو كيان الملكي! تم رصد موجة صعود خارقة وتأكيد نمط دبل في سهم ${doubleStock.name}، بنسبة تطابق نمط ${doubleStock.patternScore} في المئة!`);
              
              // Simulate Sending Telegram Broadcast
              const telResponse = await fetch('/api/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  message: `👑 <b>رادار الموجة الصلبة الملياري</b> 🚀\n` +
                           `========================================\n` +
                           `🎯 <b>منصة استثمارية محققة:</b>\n` +
                           `• <b>الشركة:</b> ${doubleStock.name}\n` +
                           `• <b>الرمز:</b> <code>${doubleStock.symbol.split(':')[1]}</code>\n` +
                           `• <b>الإشارة الفنية:</b> [ <b>${doubleStock.signal}</b> ]\n\n` +
                           `📊 <b>المعطيات اللحظية:</b>\n` +
                           `• <b>السعر الحالي:</b> ${doubleStock.price.toFixed(2)} ريال\n` +
                           `• <b>الهدف الاستراتيجي:</b> <b>${doubleStock.targetPrice.toFixed(2)} ريال</b>\n` +
                           `• <b>العائد المتوقع:</b> +${doubleStock.expectedGain}%\n` +
                           `• 🛑 <b>وقف الإبطال:</b> ${doubleStock.stopLoss.toFixed(2)} ريال\n\n` +
                           `👑 <b>مطور البث: أبو كيان</b>`
                })
              });

              if (telResponse.ok) {
                const telData = await telResponse.json();
                addTelegramAlert(telData.messagePreview);
                addLog('success', `📦 تم بث التقرير المالي تلقائياً ومزامنته لقناة تلجرام @the_radar_bott`);
              }
            } else {
              playVoiceAlert("تم الانتهاء من فحص موجات تداول السوق بنجاح.");
            }
          }
        }
      } catch (err) {
        addLog('error', `🚫 فشل الاتصال بخادم الرادار: ${err}`);
      } finally {
        setIsScanning(false);
      }
    }, 3500);
  };

  // Run auto learning feedback (GenAI brain optimization endpoint)
  const handleAutoLearnSim = async () => {
    setIsLearning(true);
    addLog('info', '🧠 استدعاء عقل الذكاء الاصطناعي للتعلّم والتقييم الذاتي (autoLearnFeedback)...');
    
    setTimeout(() => {
      addLog('info', '🗄️ مراجعة سجل الصفقات التاريخية الماضية لمعرفة أسباب فاشلات الاختراق الارتدادي...');
    }, 1000);

    setTimeout(async () => {
      try {
        const res = await fetch('/api/learn', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setModelCriteria({
            minVolume: data.optimized.volume,
            minFib: data.optimized.fib,
            minScore: data.optimized.score
          });

          addLog('success', `💡 الذكاء الاصطناعي يقرر التحديث لورقة MODEL: ${data.summary}`);
          
          if (data.fallback) {
            addLog('warn', `⚠️ تم تفعيل خوارزمية التعلم اللامركزية الافتراضية. أدخل GEMINI_API_KEY الفعلي لتشغيل القدرات الإدارية المليارية!`);
          }

          playVoiceAlert(`أبو كيان الملكي، نجحت خوارزمية التعلّم الذاتي بتجنب الاختراقات الوهمية. تم تعديل الفلتر وإرشاد محرك إليوت لقيم سيولة ومستهدف ويف جديدة.`);
          
          // Re-run scan with newly optimized parameters inside state
          addLog('info', '🔄 جاري إعادة تطبيق معايير الاختيار المطورة لتصفية السوق...');
          
          const scanRes = await fetch('/api/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              minVolume: data.optimized.volume,
              minFib: data.optimized.fib,
              minScore: data.optimized.score
            })
          });

          if (scanRes.ok) {
            const scanData = await scanRes.json();
            setSolidWaveScanner(scanData.solidWaveScanner);
            setPortfolio(scanData.portfolio);
          }

        } else {
          addLog('error', '❌ فشل محرك التطوير الذاتي في تحليل ردود الكهرو-عصبية للجوزاء.');
        }
      } catch (err) {
        addLog('error', `🚫 استثناء في مخدم التعلّم: ${err}`);
      } finally {
        setIsLearning(false);
      }
    }, 3000);
  };

  // Helper arrays for lists
  const addLog = (type: 'info' | 'success' | 'warn' | 'error', message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [...prev, { timestamp, type, message }]);
  };

  const addTelegramAlert = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setTelegramAlerts(prev => [...prev, { id: Math.random().toString(), timestamp, message }]);
  };

  const handleClearLogs = () => {
    setLogs([]);
    setTelegramAlerts([]);
  };

  // Add custom Saudi Stock Symbol to symbols sheet
  const handleAddCustomSymbol = () => {
    if (!newSym.trim() || !newName.trim()) return;
    
    addLog('info', `➕ تم إضافة رمز تداول جديد إلى SYMBOLS: ${newName} (${newSym})`);
    
    // Simulate updating symbols sheet and scanner sheet on client view
    const newRow: SolidWaveScannerRow = {
      rank: solidWaveScanner.length + 1,
      symbol: `TADAWUL:${newSym.trim()}`,
      name: newName.trim(),
      price: Math.floor(Math.random() * 40 + 15),
      volume: Math.floor(Math.random() * 1200000 + 400000),
      price30: Math.floor(Math.random() * 40 + 15),
      momentum: 0,
      patternScore: 50,
      signal: 'مراقبة 🛡️',
      stopLoss: 0,
      targetPrice: 0,
      expectedGain: 0
    };

    // Auto calculate formulas
    newRow.momentum = Number((((newRow.price / newRow.price30) - 1) * 100).toFixed(2));
    newRow.stopLoss = Number((newRow.price * 0.945).toFixed(2));
    newRow.targetPrice = Number((newRow.price * 1.618).toFixed(2));
    newRow.expectedGain = Number((((newRow.targetPrice / newRow.price) - 1) * 100).toFixed(2));

    const updated = [...solidWaveScanner, newRow];
    setSolidWaveScanner(updated);
    
    setNewSym('');
    setNewName('');
    setIsCustomSymbolModalOpen(false);

    playVoiceAlert(`تمت إضافة سهم ${newName.trim()} بنجاح.`);
  };

  // Delete last custom symbol
  const handleDeleteSymbol = (symbol: string) => {
    const filtered = solidWaveScanner.filter(s => s.symbol !== symbol);
    setSolidWaveScanner(filtered);
    addLog('warn', `🗑️ تم إزالة سهم ${symbol} من شيت سكانر الرادار.`);
  };

  // Custom Price Alert States & Ref
  const [priceAlerts, setPriceAlerts] = useState<Record<string, { price: number; triggered: boolean }>>({});
  const lastPricesRef = useRef<Record<string, number>>({});

  const handleUpdatePriceAlert = (symbol: string, price: number | null) => {
    setPriceAlerts(prev => {
      if (price === null || isNaN(price)) {
        const copy = { ...prev };
        delete copy[symbol];
        return copy;
      }
      return {
        ...prev,
        [symbol]: { price, triggered: false }
      };
    });
    
    if (price !== null && !isNaN(price)) {
      const stockName = solidWaveScanner.find(s => s.symbol === symbol)?.name || symbol.split(':')[1] || symbol;
      addLog('info', `🔔 تم ضبط منبه سعري مخصص لسهم ${stockName} عند ${price.toFixed(2)} ريال.`);
    }
  };

  // Personal notes per stock
  const [stockNotes, setStockNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('vBillionaireStockNotes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleUpdateNotes = (symbol: string, val: string) => {
    setStockNotes(prev => {
      const next = { ...prev, [symbol]: val };
      try {
        localStorage.setItem('vBillionaireStockNotes', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  // Customizable wave chart colors state
  const [chartColors, setChartColors] = useState<WaveChartColors>(() => {
    try {
      const saved = localStorage.getItem('vBillionaireChartColors');
      return saved ? JSON.parse(saved) : {
        wave1: '#94a3b8', // slate-400
        wave2: '#10b981', // emerald-500
        wave3: '#eab308', // amber-500
        wave4: '#f97316', // orange-500
        wave5: '#d4af37', // royal-gold
        fibLevel: '#334155', // slate-700
        fibZone: '#cbd5e1', // slate-300
      };
    } catch {
      return {
        wave1: '#94a3b8',
        wave2: '#10b981',
        wave3: '#eab308',
        wave4: '#f97316',
        wave5: '#d4af37',
        fibLevel: '#334155',
        fibZone: '#cbd5e1',
      };
    }
  });

  const handleUpdateChartColor = (key: keyof WaveChartColors, val: string) => {
    setChartColors(prev => {
      const next = { ...prev, [key]: val };
      try {
        localStorage.setItem('vBillionaireChartColors', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleResetChartColors = () => {
    const defaults = {
      wave1: '#94a3b8',
      wave2: '#10b981',
      wave3: '#eab308',
      wave4: '#f97316',
      wave5: '#d4af37',
      fibLevel: '#334155',
      fibZone: '#cbd5e1',
    };
    setChartColors(defaults);
    try {
      localStorage.setItem('vBillionaireChartColors', JSON.stringify(defaults));
    } catch {}
    addLog('info', '🎨 تم إعادة ضبط ألوان شارت الموجة ومستويات فيبوناتشي إلى الألوان القياسية الملكية.');
  };

  // Price Crossing Alert Detection Engine
  useEffect(() => {
    if (solidWaveScanner.length === 0) return;

    let triggeredAssets: Array<{ name: string; symbol: string; current: number; target: number; direction: string }> = [];

    setPriceAlerts(prev => {
      const next = { ...prev };
      let changed = false;

      solidWaveScanner.forEach(stock => {
        const sym = stock.symbol;
        const currentPrice = stock.price;
        const prevPrice = lastPricesRef.current[sym];

        const alert = next[sym];
        if (alert && !alert.triggered && prevPrice !== undefined) {
          const crossedUp = prevPrice < alert.price && currentPrice >= alert.price;
          const crossedDown = prevPrice > alert.price && currentPrice <= alert.price;
          const exactMatch = currentPrice === alert.price;

          if (crossedUp || crossedDown || exactMatch) {
            alert.triggered = true;
            changed = true;
            const direction = crossedUp ? "صعوداً وتجاوز" : (crossedDown ? "هبوطاً وتجاوز" : "وصولاً إلى");
            triggeredAssets.push({
              name: stock.name,
              symbol: sym,
              current: currentPrice,
              target: alert.price,
              direction
            });
          }
        }

        // Keep track of the last price
        lastPricesRef.current[sym] = currentPrice;
      });

      return changed ? next : prev;
    });

    // Fire side effects
    triggeredAssets.forEach(asset => {
      addLog('warn', `🚨 تنبيه سعري حرج لـ ${asset.name} (${asset.symbol.split(':')[1]}): السعر الحالي (${asset.current.toFixed(2)} ريال) قد وصل ${asset.direction} الحد المالي المحدد للرصد المستهدف (${asset.target.toFixed(2)} ريال)!`);
      playVoiceAlert(`أبو كيان الملكي! تنبيه طارئ، سهم ${asset.name} وصل الآن إلى السعر المحدد ${asset.target.toFixed(2)} ريال! السعر اللحظي الحالي هو ${asset.current.toFixed(2)} ريال.`);
    });

  }, [solidWaveScanner]);

  // Dynamic Cumulative Return & Win Rate Calculations for App Dashboard Widgets
  const getAppStats = () => {
    let currentCumulative = 22.0; // Base baseline return matching historical weeks
    
    const dealsWithReturn = dealHistory.map((deal) => {
      let profitPercent = 0;
      if (deal.result.includes("ناجحة")) {
        profitPercent = deal.target > deal.entryPrice 
          ? Number((((deal.target / deal.entryPrice) - 1) * 105).toFixed(1)) 
          : 15.4;
      } else if (deal.result.includes("فاشلة")) {
        profitPercent = -5.5; // stop loss
      } else {
        const liveStock = solidWaveScanner.find(s => s.symbol === deal.symbol);
        const currentPrice = liveStock ? liveStock.price : deal.entryPrice;
        profitPercent = Number((((currentPrice / deal.entryPrice) - 1) * 100).toFixed(1));
      }
      return { ...deal, profitPercent };
    });

    dealsWithReturn.forEach((deal) => {
      currentCumulative = Number((currentCumulative + deal.profitPercent).toFixed(1));
    });

    const totalDeals = dealHistory.length;
    const successfulDeals = dealHistory.filter(d => d.result.includes("ناجحة")).length;
    const winRate = totalDeals > 0 ? Number(((successfulDeals / totalDeals) * 100).toFixed(1)) : 0;

    return {
      winRate,
      currentCumulative,
      totalDeals
    };
  };

  const { winRate, currentCumulative, totalDeals } = getAppStats();

  // Sparkline data calculations for Recharts Expected Gain comparison
  const radarChartData = solidWaveScanner.map(stock => ({
    name: stock.name,
    'مطابقة النمط AI (%)': stock.patternScore,
    'العائد المتوقع (%)': stock.expectedGain
  })).slice(0, 6);

  const barChartData = solidWaveScanner.map(stock => ({
    name: stock.name,
    'الحجم اليومي': Math.floor(stock.volume / 1000)
  })).slice(0, 6);

  return (
    <div className={`min-h-screen font-sans selection:bg-royal-gold selection:text-slate-950 text-slate-100 flex flex-col justify-between transition-colors duration-500 ${ultraDarkMode ? 'ultra-dark bg-[#020204]' : 'bg-slate-950'}`} dir="rtl">
      
      {/* 1. Header Area - Dark Gold Luxury Aesthetic */}
      <header className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-royal-gold/30 p-4 sticky top-0 z-50 shadow-2xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo & Owner Badge */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-gradient-to-br from-royal-gold to-yellow-600 p-2.5 rounded-xl shadow-lg shadow-amber-500/15 border-2 border-royal-gold/40 relative group">
              <Crown className="w-6 h-6 text-slate-950 animate-bounce" />
              <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-xl font-black tracking-tight text-white font-sans">
                  نظام سكانر الموجة الصلبة الذكي
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-royal-gold/15 text-royal-gold font-mono border border-royal-gold/30">
                  V-BILLIONAIRE AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                المطور والمالك: <span className="text-royal-gold font-medium">أبو كيان (عمر) 👑</span> | منصة الذكاء الاصطناعي لإدارة المحافظ
              </p>
            </div>
          </div>

          {/* Core Metrics & Quick Indicators */}
          <div className="flex items-center flex-wrap gap-3">
            
            {/* Clock Indicator */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 px-3 flex items-center space-x-2 space-x-reverse text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-royal-gold" />
              <span>{currentTime || "00:00:00"} UTC</span>
            </div>

            {/* Voice alarm control */}
            <button
              onClick={() => {
                setSpeechEnabled(!speechEnabled);
                playVoiceAlert("تم تشغيل المنبه الصوتي الملكي لفرص المليار!");
              }}
              className={`flex items-center space-x-1.5 space-x-reverse py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                speechEnabled 
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4 animate-pulse text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{speechEnabled ? "المنبه الصوتي مفعل" : "المنبه الصوتي صامت"}</span>
            </button>

            {/* Ultra-Dark Eye Care Toggle */}
            <button
              onClick={() => {
                const next = !ultraDarkMode;
                setUltraDarkMode(next);
                try {
                  localStorage.setItem('vBillionaireUltraDark', String(next));
                } catch {}
                
                if (next) {
                  addLog('warn', '🌙 تم تنشيط الوضع المظلم الفائق (تعتيم حارس الليل). تم تقليل شدة توهج الرسوم البيانية لحماية العين.');
                  playVoiceAlert("تم تفعيل هدوء الرادار الملكي.");
                } else {
                  addLog('info', '☀️ تم تفعيل النمط الملكي المعتاد سكانر فيبوناتشي.');
                  playVoiceAlert("تم العودة للنمط العادي.");
                }
              }}
              title="تفعيل الوضع المظلم الفائق لراحة العين"
              className={`flex items-center space-x-1.5 space-x-reverse py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                ultraDarkMode 
                  ? 'bg-slate-950 border-royal-gold/40 text-royal-gold shadow-[0_0_8px_rgba(212,175,55,0.15)] animate-pulse' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {ultraDarkMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-royal-gold" />
                  <span>الوضع المظلم الفائق 🌃</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-slate-500" />
                  <span>الوضع العادي</span>
                </>
              )}
            </button>

            {/* Api connection status */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 px-3 flex items-center space-x-2 space-x-reverse text-xs">
              <span className={`w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-emerald-400' : 'bg-rose-400'} animate-ping`} />
              <span className="text-slate-350">{serverStatus === 'online' ? 'محرك الربط ملكي' : 'فصل الخادم'}</span>
              
              <div className="h-3 w-[1px] bg-slate-800 mx-1.5" />
              
              {hasGeminiKey ? (
                <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/20 px-1.5 py-0.2 rounded border border-emerald-500/20">GEMINI ACTIVE</span>
              ) : (
                <span className="text-amber-400 font-mono text-[10px] bg-amber-950/20 px-1.5 py-0.2 rounded border border-amber-500/20">OPTIMAL HEURISTIC</span>
              )}
            </div>

            {/* Manual refresh */}
            <button
              onClick={fetchInitialData}
              className="p-2 rounded bg-slate-900 border border-slate-850 text-slate-400 hover:text-royal-gold transition-colors cursor-pointer"
              title="إعادة جلب الخلايا"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Tickers bar */}
      <div className="bg-slate-950/90 border-b border-slate-900 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center space-x-4 space-x-reverse overflow-x-auto text-xs leading-none scrollbar-none">
          <span className="text-slate-500 font-bold whitespace-nowrap flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-royal-gold" />
            موجز الأسواق الملكية:
          </span>
          {globalMarkets.map((market, idx) => (
            <div key={idx} className="flex items-center space-x-2 space-x-reverse bg-slate-900/60 p-1.5 px-3 rounded border border-slate-850 whitespace-nowrap font-mono text-[11px]">
              <span className="text-slate-400">{market.name.split(' ')[0]}</span>
              <span className="text-white font-bold">{market.price.toLocaleString(undefined, { minimumFractionDigits: 1 })}</span>
              <span className={`flex items-center font-bold ${market.change30 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {market.change30 >= 0 ? <TrendingUp className="w-3 h-3 ml-0.5" /> : <TrendingDown className="w-3 h-3 ml-0.5" />}
                {market.change30 >= 0 ? '+' : ''}{market.change30}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Visual Dashboard Grid */}
      <main className="max-w-7xl mx-auto p-4 flex-1 w-full space-y-6">
        
        {/* Top Analytics Cards & Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-royal-card-bg border border-slate-800 rounded-xl p-4.5 relative overflow-hidden flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">إجمالي مؤشر تاسي (TASI)</span>
              <span className="text-3xl font-black font-mono text-royal-gold block mt-1">11,840.50</span>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                الموجة الدافعة رقم 3 ممتدة بقوة
              </p>
            </div>
            <div className="p-3 bg-royal-gold/10 text-royal-gold rounded-full border border-royal-gold/20">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-royal-card-bg border border-slate-800 rounded-xl p-4.5 relative overflow-hidden flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">فلاتر السيولة (Volume Min)</span>
              <span className="text-3xl font-black font-mono text-cyan-400 block mt-1">
                {(modelCriteria.minVolume / 1000).toFixed(0)}K
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                يصفي الصفقات الهشة ذات الزخم الضعيف
              </p>
            </div>
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">
              <Compass className="w-8 h-8 animate-spin" />
            </div>
          </div>

          <div className="bg-royal-card-bg border border-slate-800 rounded-xl p-4.5 relative overflow-hidden flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">الفرص المليارية المكتشفة</span>
              <div className="flex items-baseline space-x-1 space-x-reverse mt-1">
                <span className="text-3xl font-black font-mono text-emerald-400">
                  {solidWaveScanner.filter(s => s.signal === 'دبل 🔥').length}
                </span>
                <span className="text-xs text-slate-400">دبل حاسم 🔥</span>
              </div>
              <p className="text-[11px] text-amber-300 mt-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                جاهزة للبث نحو بوت التليجرام
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
              <Flame className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <div className="bg-royal-card-bg border border-slate-800 rounded-xl p-4.5 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between w-full">
              <div>
                <span className="text-[11px] text-slate-400 block">العائد التراكمي ونسبة النجاح</span>
                <div className="flex items-baseline space-x-2 space-x-reverse mt-1">
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    {currentCumulative >= 0 ? '+' : ''}{currentCumulative}%
                  </span>
                  <span className="text-[10px] text-royal-gold font-mono font-bold bg-royal-gold/15 border border-royal-gold/30 px-1.5 py-0.5 rounded">
                    دقة {winRate}%
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-royal-gold/10 text-royal-gold rounded-full border border-royal-gold/25">
                <Award className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            
            <div className="mt-2 text-[10px]">
              <div className="flex justify-between items-center text-slate-400 mb-1">
                <span>نمو المحفظة التاريخي</span>
                <span className="font-mono text-emerald-400">{winRate}% دقة</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-l from-royal-gold to-emerald-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${winRate}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-500 mt-1 block">
                مبني على {totalDeals} صفقات مسجلة بذكاء AI
              </span>
            </div>
          </div>

        </div>

        {/* Middle Visualization Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="flex flex-col gap-4">
            <WaveChart 
              selectedStock={selectedStock} 
              minFib={modelCriteria.minFib} 
              chartColors={chartColors}
            />
            
            {/* Personal Trade Notes & Strategy Panel */}
            <div className="bg-royal-card-bg border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg" id="personal-strategy-notes">
              {/* Subtle background flair */}
              <div className="absolute -left-10 -top-10 w-32 h-32 rounded-full bg-royal-gold/5 blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-royal-gold animate-pulse" />
                    المفكرة الاستراتيجية وتدوين ملاحظات موجة سهم {selectedStock ? selectedStock.name : ''}
                  </h3>
                  {selectedStock ? (
                    <span className="text-[10px] font-mono text-royal-gold bg-royal-gold/15 px-2 py-0.5 rounded border border-royal-gold/30 font-bold">
                      {selectedStock.symbol.split(':')[1] || selectedStock.symbol}
                    </span>
                  ) : (
                    <span className="text-[10px] font-sans text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-bold">
                      لم يُختر سهم
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 mb-2 leading-relaxed font-sans">
                  أبو كيان الملكي، دون استراتيجية الدخول وإدارة مخاطر سعر الدعم الفركتلي أو تعليقات حركة الأسعار اللحظية هنا لحفظ فوري وآمن:
                </p>

                <textarea
                  className="w-full h-24 bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-200 outline-none focus:border-royal-gold/60 focus:ring-1 focus:ring-royal-gold/30 placeholder-slate-600 transition-all font-sans resize-none"
                  placeholder={
                    selectedStock 
                      ? `اكتب هنا ملاحظاتك الخاصة بسهم ${selectedStock.name}... (مثال: الشراء عند نقطة تصحيح الموجة الثانية وتجنب الكسر)` 
                      : "يرجى تحديد أي سهم من سكانر الموجة الصلبة في الجدول أدناه لتتمكن من كتابة ملاحظات مخصصة له."
                  }
                  disabled={!selectedStock}
                  value={selectedStock ? (stockNotes[selectedStock.symbol] || '') : ''}
                  onChange={(e) => {
                    if (selectedStock) {
                      handleUpdateNotes(selectedStock.symbol, e.target.value);
                    }
                  }}
                />
              </div>

              {selectedStock && (
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-sans">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    تم الحفظ التلقائي بنجاح ✓
                  </span>
                  <span>طول النص: { (stockNotes[selectedStock.symbol] || '').length } حرف</span>
                </div>
              )}
            </div>

            {/* Wave Chart Colors Customizer Panel */}
            <div className="bg-royal-card-bg border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg" id="chart-colors-customizer">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-center mb-3.5">
                  <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-sans">
                    <Palette className="w-4 h-4 text-royal-gold animate-pulse" />
                    تخصيص ألوان خطوط موجات إليوت ومستويات فيبوناتشي
                  </h3>
                  
                  <button 
                    onClick={handleResetChartColors}
                    className="text-[10px] text-royal-gold hover:text-white bg-royal-gold/10 hover:bg-royal-gold px-2.5 py-1 rounded border border-royal-gold/25 cursor-pointer whitespace-nowrap transition-all text-xs font-sans"
                  >
                    إعادة ضبط افتراضية 🔄
                  </button>
                </div>
                
                <p className="text-[11px] text-slate-400 mb-4 leading-relaxed font-sans">
                  قم بإنشاء نمط الرؤية الخاص بك عن طريق تبديل ألوان الموجات الخمس وقنوات نسب فيبوناتشي بشكل حي ولحظي:
                </p>

                <div className="grid grid-cols-2 gap-3.5">
                  {/* Wave 1 */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-900">
                    <span className="text-[11px] text-slate-300 font-sans">الموجة 1 الدافعة</span>
                    <div className="flex items-center gap-1.5 direction-ltr">
                      <span className="text-[10px] text-slate-500 font-mono">{chartColors.wave1}</span>
                      <input 
                        type="color" 
                        value={chartColors.wave1}
                        onChange={(e) => handleUpdateChartColor('wave1', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Wave 2 */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-900">
                    <span className="text-[11px] text-slate-300 font-sans">الموجة 2 التصحيحية</span>
                    <div className="flex items-center gap-1.5 direction-ltr">
                      <span className="text-[10px] text-slate-500 font-mono">{chartColors.wave2}</span>
                      <input 
                        type="color" 
                        value={chartColors.wave2}
                        onChange={(e) => handleUpdateChartColor('wave2', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Wave 3 */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-900">
                    <span className="text-[11px] text-slate-300 font-sans">الموجة 3 الانطلاقة</span>
                    <div className="flex items-center gap-1.5 direction-ltr">
                      <span className="text-[10px] text-slate-500 font-mono">{chartColors.wave3}</span>
                      <input 
                        type="color" 
                        value={chartColors.wave3}
                        onChange={(e) => handleUpdateChartColor('wave3', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Wave 4 */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-900">
                    <span className="text-[11px] text-slate-300 font-sans">الموجة 4 التصحيحية</span>
                    <div className="flex items-center gap-1.5 direction-ltr">
                      <span className="text-[10px] text-slate-500 font-mono">{chartColors.wave4}</span>
                      <input 
                        type="color" 
                        value={chartColors.wave4}
                        onChange={(e) => handleUpdateChartColor('wave4', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Wave 5 */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-900">
                    <span className="text-[11px] text-slate-300 font-sans">الموجة 5 القمة الملكية</span>
                    <div className="flex items-center gap-1.5 direction-ltr">
                      <span className="text-[10px] text-slate-500 font-mono">{chartColors.wave5}</span>
                      <input 
                        type="color" 
                        value={chartColors.wave5}
                        onChange={(e) => handleUpdateChartColor('wave5', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Fibonacci level lines */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-900">
                    <span className="text-[11px] text-slate-300 font-sans">خطوط مستويات فيبو</span>
                    <div className="flex items-center gap-1.5 direction-ltr">
                      <span className="text-[10px] text-slate-500 font-mono">{chartColors.fibLevel}</span>
                      <input 
                        type="color" 
                        value={chartColors.fibLevel}
                        onChange={(e) => handleUpdateChartColor('fibLevel', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Fibonacci Target Area */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-900 col-span-2">
                    <span className="text-[11px] text-slate-300 font-sans font-semibold text-royal-gold">منطقة مستهدفات فيبوناتشي 🎯</span>
                    <div className="flex items-center gap-1.5 direction-ltr">
                      <span className="text-[10px] text-slate-500 font-mono">{chartColors.fibZone}</span>
                      <input 
                        type="color" 
                        value={chartColors.fibZone}
                        onChange={(e) => handleUpdateChartColor('fibZone', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                    </div>
                  </div>

                </div>

              </div>
              
              <div className="text-[9.5px] text-slate-500 mt-3 font-sans text-left">
                * يتم حفظ اللوحة المخصصة للألوان بشكل تلقائي وآمن في متصفحك اليومي.
              </div>
            </div>
          </div>

          {/* AI Insights & Radar Allocation Comparisons */}
          <div className="bg-royal-card-bg border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-royal-gold animate-ping" />
                  مستشعر دقة النمط AI وتوزيعات الأرباح المتوقعة (%)
                </h3>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-900 border border-slate-800 p-1 px-2 rounded">
                  التحليل الفني الذكي
                </span>
              </div>
              
              {/* Radar charts comparing stocks expected profits vs score */}
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={9.5} />
                    <Radar name="تطابق النمط AI (%)" dataKey="مطابقة النمط AI (%)" stroke="#d4af37" fill="#d4af37" fillOpacity={0.12} />
                    <Radar name="العائد المتوقع (%)" dataKey="العائد المتوقع (%)" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f1422', borderColor: '#1e293b', color: '#fff', fontSize: '11px', borderRadius: '8px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex justify-around text-[11px] text-slate-400 border-t border-slate-800/60 pt-2.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-royal-gold" />
                مطابقة النمط AI للنسبة الذهبية
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                العام الحالي المتوقع %
              </span>
            </div>
          </div>

        </div>

        {/* 3. Real luxury Google Sheets mock-up with workbook tabs */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-royal-gold" />
                ورقة عمل بوت رادار المليارات (Google Sheet Master Frame)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                انقر على قيم الخلايا الرمادية والأموال لتعديل الحجم أو الأهداف فوراً. الفلاتر تُحدث أوتوماتيكياً.
              </p>
            </div>

            <div className="flex gap-2 font-semibold">
              {/* Apps Script Integration Code */}
              <button
                onClick={() => {
                  setIsAppsScriptModalOpen(true);
                  setActiveModalTab('instructions');
                }}
                className="flex items-center gap-1.5 shadow-lg bg-gradient-to-r from-royal-gold to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 text-xs font-bold p-2 px-3.5 rounded-lg transition-all cursor-pointer border border-royal-gold/10"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>كود قوقل شيت (Apps Script) 📊</span>
              </button>

              {/* Add custom Stock */}
              <button
                onClick={() => setIsCustomSymbolModalOpen(true)}
                className="flex items-center gap-1.5 shadow-lg bg-slate-900 border border-slate-800 hover:border-royal-gold text-xs text-slate-100 hover:text-royal-gold p-2 px-3.5 rounded-lg transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة رمز سهم مخصص</span>
              </button>
            </div>
          </div>

          <SpreadsheetGrid
            sheetData={{
              globalMarkets,
              solidWaveScanner,
              portfolio,
              modelCriteria,
              dealHistory
            }}
            activeTab={activeSpreadsheetTab}
            setActiveTab={setActiveSpreadsheetTab}
            onUpdateMarkets={setGlobalMarkets}
            onUpdateScanner={setSolidWaveScanner}
            onUpdatePortfolio={setPortfolio}
            onUpdateCriteria={setModelCriteria}
            onUpdateHistory={setDealHistory}
            onSelectStock={setSelectedStock}
            selectedStockSymbol={selectedStock ? selectedStock.symbol : null}
            priceAlerts={priceAlerts}
            onUpdatePriceAlert={handleUpdatePriceAlert}
          />
        </div>

        {/* Custom Stock Adder Modal Simulation */}
        {isCustomSymbolModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-royal-card-bg border border-royal-gold/40 rounded-xl p-5 shadow-2xl max-w-sm w-full space-y-4" dir="rtl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="font-bold text-royal-gold">إضافة سهم سعودي مخصص</span>
                <button 
                  onClick={() => setIsCustomSymbolModalOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">رمز السهم الفني (أرقام فقط مثال: 2010)</label>
                  <input
                    type="text"
                    value={newSym}
                    onChange={(e) => setNewSym(e.target.value)}
                    placeholder="مثال: 4030"
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-royal-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">اسم الشركة</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="مثال: البحري"
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-royal-gold"
                  />
                </div>
              </div>

              <div className="flex space-x-2 space-x-reverse pt-2">
                <button
                  onClick={handleAddCustomSymbol}
                  className="flex-1 bg-royal-gold text-slate-900 font-bold p-2 rounded hover:bg-amber-400 transition-colors cursor-pointer text-xs"
                >
                  حفظ في ورقة العمل
                </button>
                <button
                  onClick={() => setIsCustomSymbolModalOpen(false)}
                  className="flex-1 bg-slate-900 border border-slate-800 text-slate-400 p-2 rounded hover:text-white transition-colors cursor-pointer text-xs"
                >
                  إلغاء لغوية
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Scripts Panel & Live Telegram Console */}
        <div className="grid grid-cols-1 gap-6">
          <ConsolePanel
            onRunScanSim={handleRunScanSim}
            onAutoLearnSim={handleAutoLearnSim}
            logs={logs}
            telegramAlerts={telegramAlerts}
            isScanning={isScanning}
            isLearning={isLearning}
            onClearLogs={handleClearLogs}
            botToken="8697405191:AAEb-xv33Xsd--wZ0XijB4KTNBix3px2FYk"
            chatId="@the_radar_bott"
          />
        </div>

      </main>

      {/* 5. Footer and copyright details */}
      <footer className="bg-slate-950 border-t border-slate-900/60 p-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3 text-center">
          <div>
            <span>© 1.5-Flash / 3.5-Engine مليار الذكاء الاصطناعي - عمر أبو كيان 👑</span>
          </div>
          <div>
            <span className="font-mono">BUILD_STATION: ROYAL_TRADE_DESK://TADAWUL_SA</span>
          </div>
          <div className="flex items-center space-x-1.5 space-x-reverse justify-center">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>تم تنسيق وتطوير المظهر بالكامل ليليق بالملياردير أبو كيان</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
