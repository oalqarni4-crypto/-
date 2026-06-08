import React, { useState } from 'react';
import { 
  GlobalMarketRow, 
  SolidWaveScannerRow, 
  PortfolioRow, 
  ModelCriteria, 
  HistoryRow 
} from '../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { 
  Grid, 
  Save, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  TrendingUp, 
  Percent, 
  Briefcase, 
  Cpu, 
  History,
  FolderOpen,
  Edit2,
  Bell,
  Printer,
  FileText
} from 'lucide-react';

interface SpreadsheetGridProps {
  sheetData: {
    globalMarkets: GlobalMarketRow[];
    solidWaveScanner: SolidWaveScannerRow[];
    portfolio: PortfolioRow[];
    modelCriteria: ModelCriteria;
    dealHistory: HistoryRow[];
  };
  activeTab: number;
  setActiveTab: (tab: number) => void;
  onUpdateMarkets: (markets: GlobalMarketRow[]) => void;
  onUpdateScanner: (scanner: SolidWaveScannerRow[]) => void;
  onUpdatePortfolio: (portfolio: PortfolioRow[]) => void;
  onUpdateCriteria: (criteria: ModelCriteria) => void;
  onUpdateHistory: (history: HistoryRow[]) => void;
  onSelectStock: (stock: SolidWaveScannerRow) => void;
  selectedStockSymbol: string | null;
  priceAlerts: Record<string, { price: number; triggered: boolean }>;
  onUpdatePriceAlert: (symbol: string, price: number | null) => void;
}

function Sparkline({ symbol, currentPrice, price30 }: { symbol: string, currentPrice: number, price30: number }) {
  const points = React.useMemo(() => {
    const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const totalDays = 7;
    // Approximating 7 days ago based on 30-day price, and incorporating waves
    const startPriceEstimated = price30 + (currentPrice - price30) * 0.76;
    const res: number[] = [];
    
    for (let i = 0; i < totalDays; i++) {
      const fraction = i / (totalDays - 1);
      const basePrice = startPriceEstimated + (currentPrice - startPriceEstimated) * fraction;
      
      // Dynamic Elliott Wave and golden ratio fluctuation
      const wave = Math.sin(fraction * Math.PI * 2.5 + seed) * (currentPrice * 0.015) +
                   Math.cos(fraction * Math.PI * 5 + seed * 1.618) * (currentPrice * 0.008);
      
      let val = basePrice + wave;
      if (i === totalDays - 1) {
        val = currentPrice;
      }
      res.push(val);
    }
    return res;
  }, [symbol, currentPrice, price30]);

  const width = 64;
  const height = 18;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((p, idx) => {
    const x = (idx / 6) * width;
    const y = height - ((p - min) / range) * (height - 6) - 3;
    return { x, y };
  });

  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  const isUp = points[6] >= points[0];
  const strokeColor = isUp ? '#34d399' : '#f87171'; // emerald-400 or rose-400
  const fillGradientId = `sparkline-grad-${symbol.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg width={width} height={height} className="overflow-visible opacity-80 hover:opacity-100 transition-opacity" style={{ direction: 'ltr' }}>
      <defs>
        <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${fillGradientId})`} />
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r={1.5} fill={strokeColor} />
      <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r={3} fill={strokeColor} className="animate-ping opacity-60" />
    </svg>
  );
}

export default function SpreadsheetGrid({
  sheetData,
  activeTab,
  setActiveTab,
  onUpdateMarkets,
  onUpdateScanner,
  onUpdatePortfolio,
  onUpdateCriteria,
  onUpdateHistory,
  onSelectStock,
  selectedStockSymbol,
  priceAlerts,
  onUpdatePriceAlert
}: SpreadsheetGridProps) {
  
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Dynamic Cumulative Return Calculations
  const getCumulativeData = () => {
    let currentCumulative = 22.0; // Base baseline return from historical weeks
    const baseWeeks = [
      { name: "الأسبوع 1", return: 0.0, label: "إطلاق التداول" },
      { name: "الأسبوع 2", return: 4.8, label: "موجة تاسي الأولى" },
      { name: "الأسبوع 3", return: 12.3, label: "صفقة الراجحي الناجحة" },
      { name: "الأسبوع 4", return: 9.5, label: "تصحيح فيبو فرعي" },
      { name: "الأسبوع 5", return: 18.2, label: "انفجار سهم البحري" },
      { name: "الأسبوع 6", return: 22.0, label: "اختبار دعم الموجة 4" }
    ];

    const dealsWithReturn = sheetData.dealHistory.map((deal) => {
      let profitPercent = 0;
      if (deal.result.includes("ناجحة")) {
        profitPercent = deal.target > deal.entryPrice 
          ? Number((((deal.target / deal.entryPrice) - 1) * 105).toFixed(1)) // factoring weight
          : 15.4;
      } else if (deal.result.includes("فاشلة")) {
        profitPercent = -5.5; // stop loss
      } else {
        const liveStock = sheetData.solidWaveScanner.find(s => s.symbol === deal.symbol);
        const currentPrice = liveStock ? liveStock.price : deal.entryPrice;
        profitPercent = Number((((currentPrice / deal.entryPrice) - 1) * 100).toFixed(1));
      }
      return { ...deal, profitPercent };
    });

    const calculatedWeeks = dealsWithReturn.map((deal, idx) => {
      currentCumulative = Number((currentCumulative + deal.profitPercent).toFixed(1));
      return {
        name: `الأسبوع ${7 + idx}`,
        return: currentCumulative,
        label: `صفقة ${deal.name} (${deal.profitPercent >= 0 ? '+' : ''}${deal.profitPercent}%)`
      };
    });

    const fullChartData = [...baseWeeks, ...calculatedWeeks];

    const totalDeals = sheetData.dealHistory.length;
    const successfulDeals = sheetData.dealHistory.filter(d => d.result.includes("ناجحة")).length;
    const winRate = totalDeals > 0 ? Number(((successfulDeals / totalDeals) * 100).toFixed(1)) : 0;

    return {
      chartData: fullChartData,
      totalDeals,
      winRate,
      currentCumulative
    };
  };

  const { chartData, totalDeals, winRate, currentCumulative } = getCumulativeData();

  const handlePrintPDF = () => {
    // Generate the HTML for print
    const printContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تقرير أداء الصفقات الاستثمارية - أبو كيان الملكي</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
          
          body {
            font-family: 'Cairo', sans-serif;
            background-color: #ffffff;
            color: #1e293b;
            direction: rtl;
            padding: 40px;
            margin: 0;
          }
          
          .header-container {
            border-bottom: 3px double #d4af37;
            padding-bottom: 16px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .crown-badge {
            font-size: 28px;
            background: #fef08a;
            border: 2px solid #eab308;
            padding: 4px 10px;
            border-radius: 8px;
          }
          
          .logo-title h1 {
            margin: 0;
            font-size: 24px;
            color: #0f172a;
            font-weight: 800;
          }
          
          .logo-title p {
            margin: 4px 0 0 0;
            font-size: 11px;
            color: #b45309;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          
          .meta-info {
            text-align: left;
            font-size: 11px;
            color: #64748b;
            line-height: 1.6;
          }
          
          .meta-info p {
            margin: 2px 0;
          }
          
          .report-bar {
            background-color: #0f172a;
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .report-bar-title {
            font-size: 14px;
            font-weight: 700;
            color: #fef08a;
          }
          
          .metrics-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 25px;
          }
          
          .metric-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-right: 4px solid #d4af37;
            padding: 12px 16px;
            border-radius: 6px;
          }
          
          .metric-box.winrate {
            border-right-color: #10b981;
          }
          
          .metric-box.deals {
            border-right-color: #3b82f6;
          }
          
          .metric-box-title {
            font-size: 10px;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .metric-box-value {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          
          th {
            background-color: #0f172a;
            color: #ffffff;
            font-weight: 700;
            font-size: 11px;
            padding: 10px 12px;
            border: 1px solid #334155;
            text-align: right;
          }
          
          td {
            padding: 10px 12px;
            font-size: 11px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
          }
          
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          
          .text-center {
            text-align: center;
          }
          
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
          }
          
          .badge-success {
            background-color: #d1fae5;
            color: #065f46;
          }
          
          .badge-danger {
            background-color: #fee2e2;
            color: #991b1b;
          }
          
          .badge-info {
            background-color: #dbeafe;
            color: #1e40af;
          }
          
          .footer-note {
            margin-top: 50px;
            border-top: 1px dashed #cbd5e1;
            padding-top: 20px;
            text-align: center;
            font-size: 10px;
            color: #64748b;
            line-height: 1.8;
          }
          
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          <div class="logo-section">
            <span class="crown-badge">👑</span>
            <div class="logo-title">
              <h1>أبو كيان الملكي</h1>
              <p>رادار المحفظة المميزة واستراتيجيات إليوت الذكية</p>
            </div>
          </div>
          <div class="meta-info">
            <p><b>تاريخ إصدار التقرير:</b> ${new Date().toLocaleDateString('ar-SA')}</p>
            <p><b>التوقيت اللحظي:</b> ${new Date().toLocaleTimeString('ar-SA')}</p>
            <p><b>رابط النظام:</b> V-Billionaire Wave Scanner</p>
          </div>
        </div>
        
        <div class="report-bar">
          <span class="report-bar-title">سجل أدوات التداول المعتمدة والنتائج التفصيلية لصفقات رادار المحفظة</span>
          <span style="font-size: 11px; font-weight: 600;">سري للغاية ومخصص للاستخدام الشخصي</span>
        </div>
        
        <div class="metrics-row">
          <div class="metric-box">
            <div class="metric-box-title">إجمالي العائد التراكمي المحقق</div>
            <div class="metric-box-value">${currentCumulative >= 0 ? '+' : ''}${currentCumulative}%</div>
          </div>
          <div class="metric-box winrate">
            <div class="metric-box-title">معدل دقة وتطابق صفقات إليوت</div>
            <div class="metric-box-value">${winRate}%</div>
          </div>
          <div class="metric-box deals">
            <div class="metric-box-title">إجمالي الصفقات المغلقة والنشطة</div>
            <div class="metric-box-value">${totalDeals} صفقات</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 30px; text-align: center;">#</th>
              <th style="width: 100px;">التاريخ</th>
              <th style="width: 80px; text-align: center;">الرمز</th>
              <th>اسم الشركة</th>
              <th style="width: 100px; text-align: center;">سعر الدخول</th>
              <th style="width: 100px; text-align: center;">الأهداف الاستراتيجية</th>
              <th style="width: 180px; text-align: center;">النتيجة وتوجيه بوت AI</th>
            </tr>
          </thead>
          <tbody>
            ${sheetData.dealHistory.map((row, idx) => {
              const bgClass = row.result.includes("ناجحة") 
                ? "badge-success" 
                : row.result.includes("فاشلة") 
                ? "badge-danger" 
                : "badge-info";
              return `
                <tr>
                  <td class="text-center" style="font-weight: bold; color: #64748b;">${idx + 1}</td>
                  <td>${row.date}</td>
                  <td class="text-center" style="font-family: monospace; font-weight: bold;">${row.symbol}</td>
                  <td style="font-weight: 600;">${row.name}</td>
                  <td class="text-center" style="font-family: monospace;">${row.entryPrice.toFixed(2)} ريال</td>
                  <td class="text-center" style="font-family: monospace;">${row.target.toFixed(2)} ريال</td>
                  <td class="text-center">
                    <span class="badge ${bgClass}">${row.result}</span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="footer-note">
          <p>شعار "أبو كيان الملكي" هو علامة مسجلة وحصرية لمالك رادار سكانر الموجة الصلبة. تم استخراج وحفظ هذا التقرير بصفة رقمية وبدعم التنبؤات العقدية ومؤشرات القمم المليارديرية.</p>
          <p>© ${new Date().getFullYear()} V-Billionaire AI Wave Scanner. جميع الحقوق محفوظة لمالك المنصة.</p>
        </div>
      </body>
      </html>
    `;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(printContent);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  };

  const tabs = [
    { id: 0, name: "تحليل الأسواق العالمية", icon: TrendingUp, color: "text-blue-400" },
    { id: 1, name: "سكانر الموجة الصلبة", icon: Percent, color: "text-amber-400" },
    { id: 2, name: "متابعة أداء المحفظة", icon: Briefcase, color: "text-emerald-400" },
    { id: 3, name: "MODEL", icon: Cpu, color: "text-purple-400" },
    { id: 4, name: "سجل الصفقات والتغذية الراجعة", icon: History, color: "text-rose-400" }
  ];

  const handleCellClick = (row: number, col: number, value: any) => {
    setEditingCell({ row, col });
    setEditValue(String(value));
  };

  const handleCellSave = (rowIdx: number, field: string, type: 'market' | 'scanner' | 'portfolio' | 'criteria' | 'history') => {
    if (editingCell === null) return;
    
    let parsedVal: any = editValue;
    if (!isNaN(Number(editValue)) && editValue.trim() !== '') {
      parsedVal = Number(editValue);
    }

    if (type === 'market') {
      const updated = [...sheetData.globalMarkets];
      updated[rowIdx] = { ...updated[rowIdx], [field]: parsedVal };
      onUpdateMarkets(updated);
    } else if (type === 'scanner') {
      const updated = [...sheetData.solidWaveScanner];
      updated[rowIdx] = { ...updated[rowIdx], [field]: parsedVal };
      
      // Re-trigger calculation formulas dynamically inside scanner if price edited
      if (field === 'price' || field === 'volume' || field === 'price30') {
        const p = updated[rowIdx];
        p.momentum = Number((((p.price / p.price30) - 1) * 100).toFixed(2));
        // Recalculate Fib/score rule
        let aiScore = 0;
        if (p.price > p.price30) aiScore += 30;
        const fibRetracement = 0.50; // default template
        if (fibRetracement >= sheetData.modelCriteria.minFib && fibRetracement <= 0.65) aiScore += 50;
        if (p.volume >= sheetData.modelCriteria.minVolume) aiScore += 20;
        p.patternScore = Math.min(100, Math.max(0, aiScore));
        p.signal = p.patternScore >= sheetData.modelCriteria.minScore ? 'دبل 🔥' : (p.patternScore >= 50 ? 'انطلاق 🚀' : 'مراقبة 🛡️');
        p.stopLoss = Number((p.price * 0.945).toFixed(2));
        p.targetPrice = p.signal === 'دبل 🔥' ? Number((p.price * 2.0).toFixed(2)) : Number((p.price * 1.618).toFixed(2));
        p.expectedGain = Number((((p.targetPrice / p.price) - 1) * 100).toFixed(2));
      }
      
      onUpdateScanner(updated);
    } else if (type === 'portfolio') {
      const updated = [...sheetData.portfolio];
      updated[rowIdx] = { ...updated[rowIdx], [field]: parsedVal };
      // Recalc stats
      const p = updated[rowIdx];
      p.cashTotal = Number((p.quantity * p.buyPrice).toFixed(2));
      p.marketValue = Number((p.quantity * p.price).toFixed(2));
      p.profit = Number((p.marketValue - p.cashTotal).toFixed(2));
      onUpdatePortfolio(updated);
    } else if (type === 'criteria') {
      const updated = { ...sheetData.modelCriteria };
      if (field === 'minVolume') updated.minVolume = Number(parsedVal);
      if (field === 'minFib') updated.minFib = Number(parsedVal);
      if (field === 'minScore') updated.minScore = Number(parsedVal);
      onUpdateCriteria(updated);
    } else if (type === 'history') {
      const updated = [...sheetData.dealHistory];
      updated[rowIdx] = { ...updated[rowIdx], [field]: parsedVal };
      onUpdateHistory(updated);
    }

    setEditingCell(null);
  };

  // Grid letter formulas
  const colLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  return (
    <div className="bg-royal-card-bg border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full" id="luxury-spreadsheet">
      
      {/* Upper Sheet Formula Bar & Toolbar */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="p-1 px-2.5 bg-royal-gold/10 text-royal-gold font-bold font-mono text-xs rounded border border-royal-gold/20 flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5" />
            <span>EXCEL v-BILLIONAIRE</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="text-xs text-slate-400 font-medium">
            مساحة خلايا شيت الرادار الذكي
          </div>
        </div>

        {/* Fake Formula input */}
        <div className="flex-1 max-w-lg mx-3 flex items-center bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs">
          <span className="text-royal-gold font-mono font-semibold px-2 border-l border-slate-800 pl-3">fx</span>
          <input 
            type="text" 
            readOnly 
            value={editingCell ? `=CELL(${colLetters[editingCell.col]}${editingCell.row + 1})_VALUE` : "حدد أي خلية لتعديل قيمتها الحسابية بدقة..."}
            className="bg-transparent border-none text-slate-300 font-mono focus:outline-none w-full px-2"
          />
        </div>

        <div className="flex items-center space-x-2 space-x-reverse text-xs text-slate-400">
          <span className="text-[11px] font-sans">تحديث فوري لقوانين الموجة</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Main Grid View Container */}
      <div className="flex-1 overflow-auto max-h-[500px]">
        {activeTab === 0 && (
          <table className="w-full text-right border-collapse text-xs select-none">
            <thead>
              <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                <th className="p-2 border-l border-slate-800 w-10 text-center bg-slate-950/40">#</th>
                <th className="p-2 border-l border-slate-800 text-center font-mono w-24">A (الرمز)</th>
                <th className="p-2 border-l border-slate-800 font-sans pr-4">B (الأصل / المؤشر)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-36">C (السعر اللحظي)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-36">D (التغير 30 يوم %)</th>
                <th className="p-2 border-l border-slate-800 font-sans w-48 text-center bg-amber-500/5">E (اتجاه السوق AI 🧭)</th>
                <th className="p-2 font-sans w-52 text-center bg-emerald-500/5">F (تنبؤ الحركة 🔮)</th>
              </tr>
            </thead>
            <tbody>
              {sheetData.globalMarkets.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800/80 hover:bg-slate-900/30 transition-colors">
                  <td className="p-2 bg-slate-950/20 text-slate-500 text-center font-mono border-l border-slate-800">{idx + 1}</td>
                  <td className="p-2 border-l border-slate-800 text-center font-mono text-slate-300">{row.symbol}</td>
                  <td className="p-2 border-l border-slate-800 text-slate-200 font-medium pr-4">{row.name}</td>
                  
                  {/* Price cell */}
                  <td 
                    onClick={() => handleCellClick(idx, 2, row.price)} 
                    className="p-2 border-l border-slate-800 text-center font-mono text-amber-300 cursor-pointer hover:bg-slate-800/40"
                  >
                    {editingCell?.row === idx && editingCell?.col === 2 ? (
                      <input 
                        type="text" 
                        autoFocus 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleCellSave(idx, 'price', 'market')}
                        onKeyDown={(e) => e.key === 'Enter' && handleCellSave(idx, 'price', 'market')}
                        className="bg-slate-950 text-amber-300 w-full text-center outline-none border border-royal-gold rounded px-0.5"
                      />
                    ) : (
                      `${row.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} ريال`
                    )}
                  </td>

                  {/* Change 30d cell */}
                  <td 
                    onClick={() => handleCellClick(idx, 3, row.change30)} 
                    className={`p-2 border-l border-slate-800 text-center font-mono cursor-pointer hover:bg-slate-800/40 ${row.change30 >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {editingCell?.row === idx && editingCell?.col === 3 ? (
                      <input 
                        type="text" 
                        autoFocus 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleCellSave(idx, 'change30', 'market')}
                        onKeyDown={(e) => e.key === 'Enter' && handleCellSave(idx, 'change30', 'market')}
                        className="bg-slate-950 text-center w-full outline-none border border-royal-gold rounded px-0.5"
                      />
                    ) : (
                      `${row.change30 >= 0 ? "+" : ""}${row.change30}%`
                    )}
                  </td>

                  <td className="p-2 border-l border-slate-800 text-center font-bold text-teal-400 bg-teal-950/10">
                    {row.trend}
                  </td>
                  <td className="p-2 text-center text-slate-300 bg-slate-900/40 font-medium">
                    {row.forecast}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 1 && (
          <table className="w-full text-right border-collapse text-xs select-none">
            <thead>
              <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                <th className="p-2 border-l border-slate-800 w-10 text-center bg-slate-950/40">#</th>
                <th className="p-2 border-l border-slate-800 text-center font-mono w-24">A (الرمز)</th>
                <th className="p-2 border-l border-slate-800 pr-3 w-32">B (اسم الشركة)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-28">C (السعر الحالي)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-28">D (الحجم)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-28">E (سعر 30 يوم)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-28">F (الزخم %)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-28 bg-amber-500/5">G (مطابقة النمط)</th>
                <th className="p-2 border-l border-slate-800 pr-3 w-28 text-center bg-slate-900/80">H (الإشارة)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-28 text-rose-300">I (وقف الإبطال)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-28 text-emerald-300">J (المستهدف 🎯)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-48 text-emerald-400 font-sans">K (العائد والمسار 📈)</th>
                <th className="p-2 font-mono text-center w-36 text-royal-gold bg-slate-900/60 font-sans">L (تنبيه مخصص 🔔)</th>
              </tr>
            </thead>
            <tbody>
              {sheetData.solidWaveScanner.map((row, idx) => {
                const isSelected = selectedStockSymbol === row.symbol;
                const alertInfo = priceAlerts[row.symbol];
                return (
                  <tr 
                    key={idx} 
                    onClick={() => onSelectStock(row)}
                    className={`border-b border-slate-800/80 hover:bg-slate-800/30 transition-colors cursor-pointer ${isSelected ? "bg-amber-500/10 border-l-2 border-l-amber-400" : ""}`}
                  >
                    <td className="p-2 bg-slate-950/20 text-slate-500 text-center font-mono border-l border-slate-800">{row.rank}</td>
                    <td className="p-2 border-l border-slate-800 text-center font-mono text-slate-300">{row.symbol}</td>
                    <td className="p-2 border-l border-slate-800 text-slate-150 font-semibold pr-3">{row.name}</td>
                    
                    {/* Price cell */}
                    <td 
                      onClick={(e) => { e.stopPropagation(); handleCellClick(idx, 3, row.price); }} 
                      className="p-2 border-l border-slate-800 text-center font-mono text-amber-400 cursor-pointer hover:bg-slate-700/40"
                    >
                      {editingCell?.row === idx && editingCell?.col === 3 ? (
                        <input 
                          type="text" 
                          autoFocus 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(idx, 'price', 'scanner')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(idx, 'price', 'scanner')}
                          className="bg-slate-950 text-amber-400 w-full text-center outline-none border border-royal-gold rounded px-0.5"
                        />
                      ) : (
                        `${row.price.toFixed(2)}ريال`
                      )}
                    </td>

                    {/* Volume cell */}
                    <td 
                      onClick={(e) => { e.stopPropagation(); handleCellClick(idx, 4, row.volume); }} 
                      className="p-2 border-l border-slate-800 text-center font-mono text-slate-400 cursor-pointer hover:bg-slate-700/40"
                    >
                      {editingCell?.row === idx && editingCell?.col === 4 ? (
                        <input 
                          type="text" 
                          autoFocus 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(idx, 'volume', 'scanner')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(idx, 'volume', 'scanner')}
                          className="bg-slate-950 text-slate-300 w-full text-center outline-none border border-royal-gold rounded px-0.5"
                        />
                      ) : (
                        row.volume.toLocaleString()
                      )}
                    </td>

                    {/* Price 30 days cell */}
                    <td 
                      onClick={(e) => { e.stopPropagation(); handleCellClick(idx, 5, row.price30); }} 
                      className="p-2 border-l border-slate-800 text-center font-mono text-slate-400 cursor-pointer hover:bg-slate-700/40"
                    >
                      {editingCell?.row === idx && editingCell?.col === 5 ? (
                        <input 
                          type="text" 
                          autoFocus 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(idx, 'price30', 'scanner')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(idx, 'price30', 'scanner')}
                          className="bg-slate-950 text-slate-300 w-full text-center outline-none border border-royal-gold rounded px-0.5"
                        />
                      ) : (
                        `${row.price30.toFixed(2)}ريال`
                      )}
                    </td>

                    {/* Momentum cell */}
                    <td className={`p-2 border-l border-slate-800 text-center font-mono font-medium ${row.momentum >= 0 ? "text-emerald-400 bg-emerald-900/5" : "text-rose-400 bg-rose-900/5"}`}>
                      {row.momentum >= 0 ? "+" : ""}{row.momentum}%
                    </td>

                    {/* Pattern Score */}
                    <td className="p-2 border-l border-slate-800 text-center font-mono font-bold text-amber-400 bg-amber-950/10">
                      {row.patternScore}%
                    </td>

                    {/* Signal Tag */}
                    <td className="p-2 border-l border-slate-800 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        row.signal === 'دبل 🔥' 
                          ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400' 
                          : row.signal === 'انطلاق 🚀'
                          ? 'bg-blue-950 border border-blue-500/30 text-blue-400'
                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}>
                        {row.signal}
                      </span>
                    </td>

                    <td className="p-2 border-l border-slate-800 text-center font-mono text-rose-400 font-medium">
                      {row.stopLoss.toFixed(2)}ريال
                    </td>
                    <td className="p-2 border-l border-slate-800 text-center font-mono text-emerald-400 font-bold">
                      {row.targetPrice.toFixed(2)}ريال
                    </td>
                    <td className="p-2 border-l border-slate-800 bg-slate-950/40">
                      <div className="flex items-center justify-between gap-2 px-1 bg-transparent select-none">
                        <span className="font-mono text-emerald-400 font-extrabold text-[11px]">+{row.expectedGain}%</span>
                        <div className="flex items-center justify-center">
                          <Sparkline symbol={row.symbol} currentPrice={row.price} price30={row.price30} />
                        </div>
                      </div>
                    </td>

                    {/* Price Alert cell */}
                    <td 
                      onClick={(e) => { e.stopPropagation(); handleCellClick(idx, 11, alertInfo?.price || ''); }} 
                      className="p-2 text-center font-mono text-royal-gold cursor-pointer hover:bg-slate-700/40 relative"
                    >
                      {editingCell?.row === idx && editingCell?.col === 11 ? (
                        <input 
                          type="text" 
                          autoFocus 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => {
                            const val = parseFloat(editValue);
                            onUpdatePriceAlert(row.symbol, isNaN(val) ? null : val);
                            setEditingCell(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = parseFloat(editValue);
                              onUpdatePriceAlert(row.symbol, isNaN(val) ? null : val);
                              setEditingCell(null);
                            }
                          }}
                          className="bg-[#070a13] text-royal-gold w-full text-center outline-none border border-royal-gold rounded px-0.5 text-xs font-mono"
                        />
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          {alertInfo ? (
                            <>
                              <Bell className={`w-3.5 h-3.5 text-royal-gold ${alertInfo.triggered ? 'opacity-40' : 'animate-pulse'}`} />
                              <span>{alertInfo.price.toFixed(2)}ريال</span>
                              {alertInfo.triggered && (
                                <span className="text-emerald-400 text-[9px] font-sans font-semibold bg-emerald-950/30 px-1 rounded border border-emerald-500/25 mr-1 select-none">وصل 🔔</span>
                              )}
                            </>
                          ) : (
                            <>
                              <Bell className="w-3.5 h-3.5 text-slate-600 hover:text-royal-gold transition-colors" />
                              <span className="text-slate-600 text-[10px]">—</span>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {activeTab === 2 && (
          <table className="w-full text-right border-collapse text-xs select-none">
            <thead>
              <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                <th className="p-2 border-l border-slate-800 w-10 text-center bg-slate-950/40">#</th>
                <th className="p-2 border-l border-slate-800 text-center font-mono w-24">A (الرمز)</th>
                <th className="p-2 border-l border-slate-800 pr-3">B (اسم الشركة)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-28">C (عدد الأسهم)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-28">D (سعر التكلفة)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-28 text-amber-300 bg-amber-500/5">E (السعر اللحظي)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-36">F (إجمالي التكلفة)</th>
                <th className="p-2 border-l border-slate-800 font-mono text-center w-36">G (إجمالي الربح / الخسارة)</th>
                <th className="p-2 font-mono text-center w-36 bg-emerald-500/5">H (القيمة السوقية المليارية)</th>
              </tr>
            </thead>
            <tbody>
              {sheetData.portfolio.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800/80 hover:bg-slate-900/30 transition-colors">
                  <td className="p-2 bg-slate-950/20 text-slate-500 text-center font-mono border-l border-slate-800">{idx + 1}</td>
                  <td className="p-2 border-l border-slate-800 text-center font-mono text-slate-300">{row.symbol}</td>
                  <td className="p-2 border-l border-slate-800 text-slate-200 font-medium pr-3">{row.name}</td>
                  
                  {/* Quantity cell */}
                  <td 
                    onClick={() => handleCellClick(idx, 3, row.quantity)} 
                    className="p-2 border-l border-slate-800 text-center font-mono text-slate-300 cursor-pointer hover:bg-slate-800/40"
                  >
                    {editingCell?.row === idx && editingCell?.col === 3 ? (
                      <input 
                        type="text" 
                        autoFocus 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleCellSave(idx, 'quantity', 'portfolio')}
                        onKeyDown={(e) => e.key === 'Enter' && handleCellSave(idx, 'quantity', 'portfolio')}
                        className="bg-slate-950 text-slate-350 w-full text-center outline-none border border-royal-gold rounded px-0.5"
                      />
                    ) : (
                      row.quantity
                    )}
                  </td>

                  {/* buyPrice cell */}
                  <td 
                    onClick={() => handleCellClick(idx, 4, row.buyPrice)} 
                    className="p-2 border-l border-slate-800 text-center font-mono text-slate-300 cursor-pointer hover:bg-slate-800/40"
                  >
                    {editingCell?.row === idx && editingCell?.col === 4 ? (
                      <input 
                        type="text" 
                        autoFocus 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleCellSave(idx, 'buyPrice', 'portfolio')}
                        onKeyDown={(e) => e.key === 'Enter' && handleCellSave(idx, 'buyPrice', 'portfolio')}
                        className="bg-slate-950 text-slate-350 w-full text-center outline-none border border-royal-gold rounded px-0.5"
                      />
                    ) : (
                      `${row.buyPrice.toFixed(2)}ريال`
                    )}
                  </td>

                  <td className="p-2 border-l border-slate-800 text-center font-mono text-amber-400 font-semibold bg-amber-950/10">
                    {row.price.toFixed(2)} ريال
                  </td>

                  <td className="p-2 border-l border-slate-800 text-center font-mono text-slate-400">
                    {row.cashTotal.toFixed(2)} ريال
                  </td>

                  <td className={`p-2 border-l border-slate-800 text-center font-mono font-bold ${row.profit >= 0 ? "text-emerald-400 bg-emerald-950/10" : "text-rose-400 bg-rose-950/10"}`}>
                    {row.profit >= 0 ? "+" : ""}{row.profit.toFixed(2)} ريال
                  </td>

                  <td className="p-2 text-center font-mono text-emerald-400 font-extrabold bg-emerald-950/5">
                    {row.marketValue.toFixed(2)} ريال
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 3 && (
          <table className="w-full text-right border-collapse text-xs select-none">
            <thead>
              <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                <th className="p-2 border-l border-slate-800 w-10 text-center bg-slate-950/40">#</th>
                <th className="p-2 border-l border-slate-800 pr-4">A (المعيار الاستراتيجي الحركي لموديل الرادار)</th>
                <th className="p-2 font-mono text-center w-[300px] text-royal-gold bg-amber-500/5">B (القيمة الذكية الحالية المستردة)</th>
              </tr>
            </thead>
            <tbody>
              {/* Volume criteria */}
              <tr className="border-b border-slate-800 hover:bg-slate-900/30">
                <td className="p-3 text-center bg-slate-950/20 text-slate-500 border-l border-slate-800 font-mono">2</td>
                <td className="p-3 pr-4 text-slate-200 font-medium font-sans">الحد الأدنى لحجم السيولة المطلوب (Volume Threshold)</td>
                <td 
                  onClick={() => handleCellClick(0, 1, sheetData.modelCriteria.minVolume)}
                  className="p-3 text-center font-mono text-amber-300 border-l border-slate-800 font-bold bg-amber-500/5 cursor-pointer hover:bg-slate-800"
                >
                  {editingCell?.row === 0 && editingCell?.col === 1 ? (
                    <input 
                      type="text" 
                      autoFocus 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleCellSave(0, 'minVolume', 'criteria')}
                      onKeyDown={(e) => e.key === 'Enter' && handleCellSave(0, 'minVolume', 'criteria')}
                      className="bg-slate-950 text-amber-300 text-center w-full outline-none border border-royal-gold rounded px-0.5"
                    />
                  ) : (
                    sheetData.modelCriteria.minVolume.toLocaleString()
                  )}
                </td>
              </tr>

              {/* Fibonacci criteria */}
              <tr className="border-b border-slate-800 hover:bg-slate-900/30">
                <td className="p-3 text-center bg-slate-950/20 text-slate-500 border-l border-slate-800 font-mono">3</td>
                <td className="p-3 pr-4 text-slate-200 font-medium font-sans">نسبة فيبوناتشي الأدنى لتأكيد الارتداد (Fibonacci Retracement Min)</td>
                <td 
                  onClick={() => handleCellClick(1, 1, sheetData.modelCriteria.minFib)}
                  className="p-3 text-center font-mono text-teal-300 border-l border-slate-800 font-bold bg-teal-500/5 cursor-pointer hover:bg-slate-800"
                >
                  {editingCell?.row === 1 && editingCell?.col === 1 ? (
                    <input 
                      type="text" 
                      autoFocus 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleCellSave(1, 'minFib', 'criteria')}
                      onKeyDown={(e) => e.key === 'Enter' && handleCellSave(1, 'minFib', 'criteria')}
                      className="bg-slate-950 text-teal-300 text-center w-full outline-none border border-royal-gold rounded px-0.5"
                    />
                  ) : (
                    sheetData.modelCriteria.minFib
                  )}
                </td>
              </tr>

              {/* Score criteria */}
              <tr className="border-b border-slate-800 hover:bg-slate-900/30">
                <td className="p-3 text-center bg-slate-950/20 text-slate-500 border-l border-slate-800 font-mono">4</td>
                <td className="p-3 pr-4 text-slate-200 font-medium font-sans">الحد الأدنى لقوة نمط AI للتصنيف كفرصة دبل 🔥 (Pattern Score Requirement)</td>
                <td 
                  onClick={() => handleCellClick(2, 1, sheetData.modelCriteria.minScore)}
                  className="p-3 text-center font-mono text-purple-300 border-l border-slate-800 font-bold bg-purple-500/5 cursor-pointer hover:bg-slate-800"
                >
                  {editingCell?.row === 2 && editingCell?.col === 1 ? (
                    <input 
                      type="text" 
                      autoFocus 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleCellSave(2, 'minScore', 'criteria')}
                      onKeyDown={(e) => e.key === 'Enter' && handleCellSave(2, 'minScore', 'criteria')}
                      className="bg-slate-950 text-purple-300 text-center w-full outline-none border border-royal-gold rounded px-0.5"
                    />
                  ) : (
                    `${sheetData.modelCriteria.minScore}%`
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {activeTab === 4 && (
          <div className="p-4 space-y-4 bg-slate-950/40">
            {/* Action Bar with Signature & Print Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">👑</span>
                <div>
                  <h4 className="text-xs font-bold text-royal-gold font-sans">بوابة التصدير الملكي لأبو كيان</h4>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">توليد تقارير أداء المحفظة الاستثمارية ونموذج معالجة الموجات إليوت بصيغة PDF</p>
                </div>
              </div>
              
              <button 
                onClick={handlePrintPDF}
                className="w-full sm:w-auto bg-gradient-to-r from-royal-gold to-[#b3922e] hover:from-[#e3c153] hover:to-royal-gold text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs font-sans flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>تحميل تقرير صفقات رادار أبو كيان الملكي PDF 📄</span>
              </button>
            </div>

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex justify-between items-center shadow-md">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">العائد التراكمي للمحفظة</span>
                  <span className="text-lg font-bold font-mono text-royal-gold mt-1 block">
                    {currentCumulative >= 0 ? '+' : ''}{currentCumulative}%
                  </span>
                </div>
                <div className="p-2 bg-royal-gold/10 text-royal-gold rounded-lg border border-royal-gold/15">
                  <TrendingUp className="w-5 h-5 text-royal-gold" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex justify-between items-center shadow-md">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">معدل دقة صفقات إليوت</span>
                  <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
                    {winRate}%
                  </span>
                </div>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/15">
                  <Percent className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex justify-between items-center shadow-md">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">إجمالي الصفقات المغلقة</span>
                  <span className="text-lg font-bold font-mono text-blue-400 mt-1 block">
                    {totalDeals} صفقات
                  </span>
                </div>
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/15">
                  <History className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Chart Column & Feedback Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-200 font-sans">صعود المحفظة التراكمي على مدار الأسابيع الماضية</span>
                  <span className="text-[10px] text-royal-gold font-mono bg-royal-gold/10 px-2 py-0.5 rounded border border-royal-gold/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-royal-gold rounded-full animate-ping" />
                    مؤشر بياني تفاعلي
                  </span>
                </div>

                <div className="h-44 w-full mt-2 font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4af37" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9.5} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={9.5} tickFormatter={(val) => `+${val}%`} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f1422', borderColor: '#1e293b', color: '#fff', fontSize: '11px', borderRadius: '8px', direction: 'rtl' }}
                        formatter={(value: any, name: any, props: any) => [`+${value}%`, "العائد التراكمي", props.payload.label]}
                      />
                      <Area type="monotone" dataKey="return" stroke="#d4af37" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCumulative)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center gap-1.5 text-royal-gold font-bold text-xs mb-3 font-sans">
                    <span>👑 رادار العائد الملياري لأبو كيان</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    أبو كيان الملكي، يوضح مؤشر العائد التراكمي التطور المالي لصفقات نموذج إليوت. التزامك بوقف الخسائر الصارم وتجنب الارتدادات الوهمية ساعد في تحقيق نمو متواصل وتفادي الارتدادات الهابطة.
                  </p>
                </div>
                <div className="border-t border-slate-800/80 pt-2.5 mt-3 flex justify-between items-center text-[10px] text-slate-400 font-sans">
                  <span>الأسبوع الحالي: <b>{chartData[chartData.length - 1]?.name}</b></span>
                  <span>حالة المحفظة: <b className="text-emerald-400 animate-pulse">ربح ممتد 🚀</b></span>
                </div>
              </div>
            </div>

            {/* Interactive Spreadsheet Table */}
            <div className="border border-slate-800 rounded-lg overflow-x-auto shadow-md">
              <table className="w-full text-right border-collapse text-xs select-none">
                <thead>
                  <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                    <th className="p-2 border-l border-slate-800 w-10 text-center bg-slate-950/40">#</th>
                    <th className="p-2 border-l border-slate-800 text-center font-mono w-28">A (التاريخ)</th>
                    <th className="p-2 border-l border-slate-800 text-center font-mono w-24">B (الرمز)</th>
                    <th className="p-2 border-l border-slate-800 pr-3 font-sans">C (اسم الشركة)</th>
                    <th className="p-2 border-l border-slate-800 font-mono text-center w-28">D (سعر الدخول)</th>
                    <th className="p-2 border-l border-slate-800 font-mono text-center w-28">E (الهدف الاستراتيجي)</th>
                    <th className="p-2 text-center w-60 bg-slate-900/60 font-sans">F (النتيجة الفعلية والتغذية الراجعة لبوت AI)</th>
                  </tr>
                </thead>
                <tbody>
                  {sheetData.dealHistory.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-800/80 hover:bg-slate-900/30 transition-colors">
                      <td className="p-2 bg-slate-950/20 text-slate-500 text-center font-mono border-l border-slate-800">{idx + 1}</td>
                      <td className="p-2 border-l border-slate-800 text-center font-mono text-slate-400">{row.date}</td>
                      <td className="p-2 border-l border-slate-800 text-center font-mono text-slate-300">{row.symbol}</td>
                      <td className="p-2 border-l border-slate-800 text-slate-100 font-semibold pr-3 font-sans">{row.name}</td>
                      
                      {/* Entry price cell */}
                      <td 
                        onClick={() => handleCellClick(idx, 4, row.entryPrice)} 
                        className="p-2 border-l border-slate-800 text-center font-mono text-amber-300 cursor-pointer hover:bg-slate-800/40"
                      >
                        {editingCell?.row === idx && editingCell?.col === 4 ? (
                          <input 
                            type="text" 
                            autoFocus 
                            value={editValue} 
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleCellSave(idx, 'entryPrice', 'history')}
                            onKeyDown={(e) => e.key === 'Enter' && handleCellSave(idx, 'entryPrice', 'history')}
                            className="bg-slate-950 text-amber-300 text-center w-full outline-none border border-royal-gold rounded px-0.5"
                          />
                        ) : (
                          `${row.entryPrice.toFixed(2)}ريال`
                        )}
                      </td>

                      {/* Target cell */}
                      <td 
                        onClick={() => handleCellClick(idx, 5, row.target)} 
                        className="p-2 border-l border-slate-800 text-center font-mono text-emerald-300 cursor-pointer hover:bg-slate-800/40"
                      >
                        {editingCell?.row === idx && editingCell?.col === 5 ? (
                          <input 
                            type="text" 
                            autoFocus 
                            value={editValue} 
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleCellSave(idx, 'target', 'history')}
                            onKeyDown={(e) => e.key === 'Enter' && handleCellSave(idx, 'target', 'history')}
                            className="bg-slate-950 text-emerald-300 text-center w-full outline-none border border-royal-gold rounded px-0.5"
                          />
                        ) : (
                          `${row.target.toFixed(2)}ريال`
                        )}
                      </td>

                      {/* Result cell */}
                      <td 
                        onClick={() => handleCellClick(idx, 6, row.result)}
                        className={`p-2 font-medium text-center cursor-pointer hover:bg-slate-800/40 ${
                          row.result.includes("ناجحة") 
                            ? "text-emerald-400 bg-emerald-950/15" 
                            : row.result.includes("فاشلة") 
                            ? "text-rose-400 bg-rose-950/15" 
                            : "text-blue-400 bg-blue-950/10"
                        }`}
                      >
                        {editingCell?.row === idx && editingCell?.col === 6 ? (
                          <input 
                            type="text" 
                            autoFocus 
                            value={editValue} 
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleCellSave(idx, 'result', 'history')}
                            onKeyDown={(e) => e.key === 'Enter' && handleCellSave(idx, 'result', 'history')}
                            className="bg-slate-950 text-center w-full outline-none border border-royal-gold rounded px-0.5"
                          />
                        ) : (
                          row.result
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Sheets Bottom Workbook Tabs representing Real Google Sheets Layout */}
      <div className="bg-slate-900 border-t border-slate-800 p-1 flex items-center justify-between text-xs overflow-x-auto">
        <div className="flex items-center space-x-1 space-x-reverse ml-3 flex-shrink-0">
          <div className="p-1 px-1.5 hover:bg-slate-800 rounded text-slate-400 cursor-pointer">
            <FolderOpen className="w-4 h-4" />
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
        </div>

        {/* Tab List */}
        <div className="flex items-center space-x-1 space-x-reverse overflow-x-auto scrollbar-none flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 space-x-reverse px-4 py-1.5 rounded-t-lg transition-all font-medium whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? "bg-royal-card-bg text-royal-gold border-t-2 border-t-royal-gold shadow-md" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                <span>{tab.name}</span>
                {isActive && <Edit2 className="w-3 h-3 text-royal-gold animate-pulse mr-1" />}
              </button>
            );
          })}
        </div>

        {/* Scroll helper arrows */}
        <div className="flex items-center space-x-1 space-x-reverse flex-shrink-0 mr-3">
          <button className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-slate-300">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-slate-300">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
