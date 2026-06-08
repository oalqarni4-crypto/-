import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// Lazy initialize Gemini clients
let aiClient: GoogleGenAI | null = null;
const getGeminiClient = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY" || key.includes("SheetsGen") || key.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
};

// Initial database lists
let globalMarkets = [
  { symbol: "TADAWUL:TASI", name: "مؤشر تاسي (السوق السعودي)", price: 11840.50, change30: 2.15, trend: "صعود (الموجة الدافعة 3) 📈", forecast: "امتداد مستهدف فيبوناتشي 161.8%" },
  { symbol: "INDEX:INX", name: "مؤشر S&P 500 (سباكس)", price: 5910.30, change30: 1.85, trend: "تجمع وعرضي ⚖️", forecast: "استقرار وبناء مراكز" },
  { symbol: "INDEX:DJX", name: "مؤشر داو جونز (السوق الأمريكي)", price: 43250.10, change30: -0.90, trend: "تجمع وعرضي ⚖️", forecast: "استقرار وبناء مراكز" },
  { symbol: "GLD", name: "الذهب (الأوقية / دولار)", price: 2645.80, change30: 4.80, trend: "صعود (الموجة الدافعة 3) 📈", forecast: "اختبار القمة التاريخية" }
];

let solidWaveScanner = [
  { rank: 1, symbol: "TADAWUL:2370", name: "جاكو", price: 33.80, volume: 850000, price30: 31.20, momentum: 8.33, patternScore: 82, signal: "انطلاق 🚀" as const, stopLoss: 31.94, targetPrice: 54.68, expectedGain: 61.80 },
  { rank: 2, symbol: "TADAWUL:8150", name: "أسيج", price: 15.40, volume: 1200000, price30: 12.80, momentum: 20.31, patternScore: 92, signal: "دبل 🔥" as const, stopLoss: 14.55, targetPrice: 30.80, expectedGain: 100.00 },
  { rank: 3, symbol: "TADAWUL:1120", name: "الراجحي", price: 88.50, volume: 450000, price30: 89.00, momentum: -0.56, patternScore: 45, signal: "مراقبة 🛡️" as const, stopLoss: 83.63, targetPrice: 143.19, expectedGain: 61.80 },
  { rank: 4, symbol: "TADAWUL:2010", name: "سابك", price: 74.20, volume: 650000, price30: 71.50, momentum: 3.77, patternScore: 78, signal: "انطلاق 🚀" as const, stopLoss: 70.11, targetPrice: 120.05, expectedGain: 61.80 },
  { rank: 5, symbol: "TADAWUL:1150", name: "الإنماء", price: 34.15, volume: 1100000, price30: 33.90, momentum: 0.73, patternScore: 55, signal: "مراقبة 🛡️" as const, stopLoss: 32.27, targetPrice: 55.25, expectedGain: 61.80 },
  { rank: 6, symbol: "TADAWUL:2222", name: "أرامكو", price: 27.80, volume: 2200000, price30: 28.10, momentum: -1.06, patternScore: 35, signal: "مراقبة 🛡️" as const, stopLoss: 26.27, targetPrice: 44.98, expectedGain: 61.80 }
];

let portfolio = [
  { symbol: "TADAWUL:8150", name: "أسيج", quantity: 16, buyPrice: 15.40, price: 15.40, cashTotal: 246.40, profit: 0.00, marketValue: 246.40 }
];

let modelCriteria = {
  minVolume: 500000,
  minFib: 0.48,
  minScore: 75
};

let dealHistory = [
  { date: "2026-06-01", symbol: "TADAWUL:2370", name: "جاكو", entryPrice: 33.80, target: 54.00, result: "فاشلة (ارتداد وهمي)" },
  { date: "2026-06-03", symbol: "TADAWUL:8150", name: "أسيج", entryPrice: 12.80, target: 30.80, result: "ناجحة (انفجار فني)" },
  { date: "2026-06-05", symbol: "TADAWUL:2010", name: "سابك", entryPrice: 71.50, target: 120.00, result: "قيد المراقبة" }
];

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Check Status
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      owner: "أبو كيان (عمر)",
      brand: "V-Billionaire AI Wave Scanner Engine",
      hasGeminiApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
    });
  });

  // Get current sheets state
  app.get("/api/sheets", (req, res) => {
    res.json({
      globalMarkets,
      solidWaveScanner,
      portfolio,
      modelCriteria,
      dealHistory
    });
  });

  // Run the full scanner engine (Elliott Wave simulation)
  app.post("/api/scan", (req, res) => {
    const { minVolume, minFib, minScore, customSymbols } = req.body;
    
    // Update model criteria
    if (minVolume !== undefined) modelCriteria.minVolume = Number(minVolume);
    if (minFib !== undefined) modelCriteria.minFib = Number(minFib);
    if (minScore !== undefined) modelCriteria.minScore = Number(minScore);

    const symbolsToScan = customSymbols || [
      { sym: "2370", name: "جاكو" },
      { sym: "8150", name: "أسيج" },
      { sym: "1120", name: "الراجحي" },
      { sym: "2010", name: "سابك" },
      { sym: "1150", name: "الإنماء" },
      { sym: "2222", name: "أرامكو" },
      { sym: "4030", name: "البحري" },
      { sym: "2080", name: "غازكو" }
    ];

    const updatedScanner: typeof solidWaveScanner = [];

    symbolsToScan.forEach((item: any) => {
      const symStr = "TADAWUL:" + item.sym;
      // Get existing or randomize slightly to simulate active market pricing
      const existing = solidWaveScanner.find(s => s.symbol === symStr);
      let price = existing ? existing.price : (Math.random() * 80 + 10);
      
      // Slightly fluctuate price for visual refreshment
      price = Number((price * (1 + (Math.random() * 0.04 - 0.02))).toFixed(2));
      
      const volume = existing ? existing.volume : Math.floor(Math.random() * 1500000 + 100000);
      // price 30 days ago
      const price30 = existing ? existing.price30 : Number((price * 0.9).toFixed(2));
      
      const momentum = Number((((price / price30) - 1) * 100).toFixed(2));
      
      // Elliott Wave calculations
      const wave1Length = price * 0.2;
      const fibRetracement = Number((0.38 + Math.random() * 0.25).toFixed(2)); // target between 0.38 and 0.63
      
      let aiScore = 0;
      if (price > price30) aiScore += 30;
      if (fibRetracement >= modelCriteria.minFib && fibRetracement <= 0.65) aiScore += 50;
      if (volume >= modelCriteria.minVolume) aiScore += 20;

      // Cap at 100
      aiScore = Math.min(100, Math.max(0, aiScore));

      let signal: "دبل 🔥" | "انطلاق 🚀" | "مراقبة 🛡️" = "مراقبة 🛡️";
      if (aiScore >= modelCriteria.minScore) {
        signal = "دبل 🔥";
      } else if (aiScore >= 50) {
        signal = "انطلاق 🚀";
      }

      const stopLoss = Number((price * 0.945).toFixed(2));
      const targetPrice = signal === "دبل 🔥" ? Number((price * 2.0).toFixed(2)) : Number((price * 1.618).toFixed(2));
      const expectedGain = Number((((targetPrice / price) - 1) * 100).toFixed(2));

      updatedScanner.push({
        rank: 0,
        symbol: symStr,
        name: item.name,
        price,
        volume,
        price30,
        momentum,
        patternScore: aiScore,
        signal,
        stopLoss,
        targetPrice,
        expectedGain
      });
    });

    // Sort by patternScore
    updatedScanner.sort((a, b) => b.patternScore - a.patternScore);
    updatedScanner.forEach((row, idx) => {
      row.rank = idx + 1;
    });

    solidWaveScanner = updatedScanner;

    // Simulate portfolio update with live prices
    portfolio = portfolio.map(item => {
      const live = solidWaveScanner.find(s => s.symbol === item.symbol);
      const currentPrice = live ? live.price : item.price;
      const marketValue = Number((item.quantity * currentPrice).toFixed(2));
      const profit = Number((marketValue - item.cashTotal).toFixed(2));
      return {
        ...item,
        price: currentPrice,
        marketValue,
        profit
      };
    });

    res.json({
      success: true,
      solidWaveScanner,
      portfolio,
      modelCriteria
    });
  });

  // Call the Gemini cognitive optimizer via API
  app.post("/api/learn", async (req, res) => {
    const gemini = getGeminiClient();

    if (!gemini) {
      // API Key fallback logic, simulated optimization rule
      console.log("No valid GEMINI_API_KEY. Using mathematical optimization solver.");
      const historicalSuccessPercent = dealHistory.filter(h => h.result.includes("ناجحة")).length / dealHistory.length;
      
      // Calculate optimized figures heuristically
      const volumeAdjust = 550000;
      const fibAdjust = 0.50;
      const scoreAdjust = 78;

      modelCriteria.minVolume = volumeAdjust;
      modelCriteria.minFib = fibAdjust;
      modelCriteria.minScore = scoreAdjust;

      return res.json({
        success: true,
        optimized: {
          volume: volumeAdjust,
          fib: fibAdjust,
          score: scoreAdjust,
        },
        fallback: true,
        summary: "تم محاكاة التعلم الذاتي والخوارزميات بنجاح! نظراً لعدم وجود مفتاح Gemini مفعل في الإعدادات، تم تطبيق نموذج التعديل الرياضي المقاوم للاختراقات الوهمية تلقائياً لتقليل هامش الخطأ التاريخي."
      });
    }

    try {
      const prompt = `أنت المحرك الذكي لرادار الموجة الصلبة الملياري الخاصة بالمستثمر أبو كيان (عمر). بناء على أداء الصفقات السابقة والفلتر الحالي، قم بتحديث الفلتر لتجنب الاختراقات الوهمية وزيادة دقة الإصابة.
      
      الفلتر الحالي:
      ${JSON.stringify(modelCriteria)}
      
      سجل أداء الصفقات الأخيرة والتغذية الراجعة ليتعلم منها البوت:
      ${JSON.stringify(dealHistory)}
      
      المطلوب: قم بالرد بصيغة JSON فقط تحتوي على القيم الجديدة المقترحة للحد الأدنى للحجم (volume)، والحد الأدنى للفيبوناتشي (fib)، والحد الأدنى لدرجة دقة تطابق النمط (score)، ونص توضيحي لسبب هذا التغيير المالي باللغة العربية بأسلوب راقي يليق بمستثمر ملياردير (أبو كيان).
      مثال للرد بصيغة JSON نظيفة تماماً:
      {
        "volume": 550000,
        "fib": 0.50,
        "score": 78,
        "explanation": "أبو كيان الملكي: تم رفع الحد الأدنى للسيولة لتفادي الاختراقات المصطنعة مع تعديل الفيبوناتشي لضمان الارتداد من قاع ويف مأمون."
      }`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const resultText = response.text || "{}";
      const cleanJson = JSON.parse(resultText.trim());

      modelCriteria.minVolume = Number(cleanJson.volume) || modelCriteria.minVolume;
      modelCriteria.minFib = Number(cleanJson.fib) || modelCriteria.minFib;
      modelCriteria.minScore = Number(cleanJson.score) || modelCriteria.minScore;

      res.json({
        success: true,
        optimized: {
          volume: modelCriteria.minVolume,
          fib: modelCriteria.minFib,
          score: modelCriteria.minScore
        },
        fallback: false,
        summary: cleanJson.explanation || "تم التعلم الذاتي بنجاح وتلافي أخطاء الصفقات السابقة لموجة إليوت!"
      });
    } catch (error: any) {
      console.error("Gemini optimization error: ", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Simulate Telegram message sending
  app.post("/api/telegram", (req, res) => {
    const { message } = req.body;
    console.log("Simulating Telegram broadcast to @the_radar_bott: ", message);
    res.json({
      success: true,
      broadcastTo: "@the_radar_bott",
      messagePreview: message
    });
  });

  // Vite development integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Billionaire Trading Server running on http://localhost:${PORT}`);
  });
}

startServer();
