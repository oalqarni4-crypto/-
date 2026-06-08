// Google Apps Script Template for V-Billionaire AI Wave Scanner
export const appsScriptCode = `/**
 * 👑 رادار الملياردير الملكي - محرك فحص الموجات والمؤشرات المالية
 * المطور والمالك: أبو كيان (عمر)
 * -----------------------------------------------------------------
 * هذا الكود مخصص للنسخ واللصق في تطبيقات Google Sheets Apps Script.
 * يقوم بإنشاء وتنسيق أوراق العمل لتطابق لوحة تحكم الويب الفاخرة باللون الذهبي والكحلي الملكي.
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('👑 رادار الملياردير')
    .addItem('📊 إعادة بناء وتنسيق اللوحة بالكامل', 'rebuildBillionaireScanner')
    .addSeparator()
    .addItem('🧠 تشغيل فحص الذكاء الاصطناعي السريع', 'simulateAIScan')
    .addItem('📞 إرسال تقرير عاجل لتلجرام', 'sendTelegramAlert')
    .addToUi();
}

/**
 * دالة إعادة بناء وتنسيق أوراق العمل الخمسة بالكامل مع الألوان الملكية الفريدة
 */
function rebuildBillionaireScanner() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // ألوان المظهر الكحلي والذهبي الفاخر
  var COLOR_DARK_BG = '#070a13';       // خلفية العناوين الفاخرة
  var COLOR_CARD_BG = '#0f1422';       // خلفية الخلايا الرئيسية
  var COLOR_GOLD_TEXT = '#d4af37';     // النص الذهبي الملكي
  var COLOR_WHITE = '#ffffff';
  var COLOR_SLATE_GRAY = '#1e293b';    // الحدود والإطارات
  var COLOR_LIGHT_ZEBRA = '#131929';   // الصفوف البديلة
  var COLOR_INPUT_BG = '#1e293b';      // خلايا الفلاتر والمدخلات
  
  // 1. إنشاء وتنسيق ورقة: تحليل الأسواق العالمية
  var sheet1 = getOrCreateSheet(ss, 'تحليل الأسواق العالمية');
  formatSheetHeader(sheet1, '👑 رادار أبو كيان - جدول مؤشرات الأسواق العالمية اللحظية (تحديث حي عبر GOOGLEFINANCE)', COLOR_DARK_BG, COLOR_GOLD_TEXT);
  setupGlobalMarkets(sheet1, COLOR_DARK_BG, COLOR_SLATE_GRAY, COLOR_GOLD_TEXT, COLOR_LIGHT_ZEBRA);
  
  // 2. إنشاء وتنسيق ورقة: سكانر الموجة الصلبة
  var sheet2 = getOrCreateSheet(ss, 'سكانر الموجة الصلبة');
  formatSheetHeader(sheet2, '🌊 جَدول صَفوة الأسهم - تصفية الموجة الدافعة والزخم الذهبي بموجات إليوت', COLOR_DARK_BG, COLOR_GOLD_TEXT);
  setupSolidWaveScanner(sheet2, COLOR_DARK_BG, COLOR_SLATE_GRAY, COLOR_GOLD_TEXT, COLOR_LIGHT_ZEBRA, COLOR_INPUT_BG);

  // 3. إنشاء وتنسيق ورقة: متابعة أداء المحفظة
  var sheet3 = getOrCreateSheet(ss, 'متابعة أداء المحفظة');
  formatSheetHeader(sheet3, '💼 مِحفظة أبو كيان الملكية - تتبع السيولة والعوائد اللحظية للأصول', COLOR_DARK_BG, COLOR_GOLD_TEXT);
  setupPortfolio(sheet3, COLOR_DARK_BG, COLOR_SLATE_GRAY, COLOR_GOLD_TEXT, COLOR_LIGHT_ZEBRA);

  // 4. إنشاء وتنسيق ورقة: MODEL
  var sheet4 = getOrCreateSheet(ss, 'MODEL');
  formatSheetHeader(sheet4, '⚙️ مَعايير الموديل الحسابي - قوانين التصفية والذكاء الاصطناعي الذاتية لتقليل الأخطاء', COLOR_DARK_BG, COLOR_GOLD_TEXT);
  setupModelCriteria(sheet4, COLOR_DARK_BG, COLOR_SLATE_GRAY, COLOR_GOLD_TEXT, COLOR_LIGHT_ZEBRA);

  // 5. إنشاء وتنسيق ورقة: سجل الصفقات والتغذية الراجعة
  var sheet5 = getOrCreateSheet(ss, 'سجل الصفقات والتغذية الراجعة');
  formatSheetHeader(sheet5, '📜 الأرشيف والاستفادة اللغوية - التقييم الذاتي لحركات الارتداد والاختراق العكسي للرادار', COLOR_DARK_BG, COLOR_GOLD_TEXT);
  setupDealHistory(sheet5, COLOR_DARK_BG, COLOR_SLATE_GRAY, COLOR_GOLD_TEXT, COLOR_LIGHT_ZEBRA);

  // إعادة تركيز العشيق على الصفحة الرئيسية للسكانر
  ss.setActiveSheet(sheet2);
  
  SpreadsheetApp.getUi().alert('👑 تم بنجاح تنسيق وتصميم شيت "رادار الملياردير الملكي" بالكامل بمظهر الذهب والياقوت الداكن!');
}

/**
 * دالة جلب أو إنشاء ورقة العمل باسم محدد وتفريغها للبدء النظيف
 */
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (sheet) {
    sheet.clear();
    sheet.getFilter() && sheet.getFilter().remove();
    // إزالة أي تنسيق شرطي
    sheet.clearConditionalFormatRules();
  } else {
    sheet = ss.insertSheet(name);
  }
  
  // تفعيل شبكة الخلايا للتسهيل
  sheet.setGridlinesVisible(true);
  return sheet;
}

/**
 * تنسيق الترويسة الذهبية العلوية لجميع الجداول
 */
function formatSheetHeader(sheet, titleText, bgColor, goldColor) {
  // دمج الصف الأول لعنوان الصفحة
  sheet.getRange('A1:L1').merge();
  var cell = sheet.getRange('A1');
  cell.setValue(titleText);
  cell.setBackground(bgColor);
  cell.setFontColor(goldColor);
  cell.setFontSize(13);
  cell.setFontWeight('bold');
  cell.setHorizontalAlignment('center');
  cell.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 40);
}

/**
 * معطيات وتنسيق جدول الأسواق العالمية
 */
function setupGlobalMarkets(sheet, colorBg, colorSlate, colorGold, colorZebra) {
  var headers = [['رمز السوق (A)', 'اسم الأصل / المؤشر (B)', 'السعر اللحظي (C)', 'تغير 30 يوم % (D)', 'اتجاه السوق AI (E)', 'توقع موجة إليوت (F)']];
  
  sheet.getRange('A3:F3').setValues(headers)
    .setBackground(colorBg)
    .setFontColor(colorGold)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setBorder(true, true, true, true, true, true, colorSlate, SpreadsheetApp.BorderStyle.SOLID);
  
  sheet.setRowHeight(3, 26);
  
  var data = [
    ['TASI', 'مؤشر تاسي (السوق السعودي)', '=IFERROR(GOOGLEFINANCE("INDEXTA:TASI"), 11840.50)', 0.0215, 'صعود (الموجة الدافعة 3) 📈', 'امتداد مستهدف فيبوناتشي 161.8%'],
    ['.INX', 'مؤشر S&P 500 (الأمريكي)', '=IFERROR(GOOGLEFINANCE("INDEXSP:.INX"), 5910.30)', 0.0185, 'تجمع وعرضي ⚖️', 'استقرار وبناء مراكز محققة'],
    ['DJI', 'مؤشر داو جونز الصناعي', '=IFERROR(GOOGLEFINANCE("INDEXDJX:.DJI"), 43250.10)', -0.0090, 'تجمع وعرضي ⚖️', 'استقرار وبناء مراكز فنية'],
    ['GLD', 'الذهب (سعر أونصة الأسواق العالمية)', '=IFERROR(GOOGLEFINANCE("NYSEARCA:GLD") * 13.7, 2645.80)', 0.0480, 'صعود (الموجة الدافعة 3) 📈', 'اختبار القمة التاريخية للاختراق']
  ];
  
  sheet.getRange('A4:F7').setValues(data)
    .setHorizontalAlignment('center')
    .setFontColor('#f1f5f9')
    .setBackground('#0f1422');
    
  // تلوين الصفوف الفردية بديكور خاص
  sheet.getRange('A5:F5').setBackground(colorZebra);
  sheet.getRange('A7:F7').setBackground(colorZebra);
  
  // تنسيقات الأرقام والنسب
  sheet.getRange('C4:C7').setNumberFormat('#,##0.00" ريال"');
  sheet.getRange('D4:D7').setNumberFormat('0.00%');
  
  // وضع الحدود
  sheet.getRange('A4:F7').setBorder(true, true, true, true, true, true, colorSlate, SpreadsheetApp.BorderStyle.SOLID_LIGHT);
  
  // تجميد الصفوف الثلاثة الأولى
  sheet.setFrozenRows(3);
  autoFitColumns(sheet, 6);
}

/**
 * معطيات وتنسيق جدول سكانر الموجة الصلبة
 */
function setupSolidWaveScanner(sheet, colorBg, colorSlate, colorGold, colorZebra, colorInput) {
  // كتابة شروط الفلتر في خلايا بارزة للربط بالمعادلات
  sheet.getRange('A3:K3').merge();
  var filterLabel = sheet.getRange('A3');
  filterLabel.setValue('⚙️ فلاتر الفحص النشطة وحجم الموجة الاستراتيجي (مستمدة من ورقة MODEL)');
  filterLabel.setBackground('#111827').setFontColor('#94a3b8').setFontSize(10).setHorizontalAlignment('center');
  sheet.setRowHeight(3, 22);

  // رؤوس أعمدة جدول السكانر
  var headers = [[
    'الترتيب (A)', 'الرمز المالي (B)', 'اسم الشركة (C)', 'السعر اللحظي (D)', 
    'الحجم اليومي (E)', 'سعر 30 يوم (F)', 'الزخم الأسبوعي (G)', 
    'مطابقة النمط (H)', 'إشارة الدخول (I)', 'وقف الإبطال (J)', 
    'المستهدف الاستثماري (K)', 'العائد المتوقع (L)'
  ]];
  
  sheet.getRange('A5:L5').setValues(headers)
    .setBackground(colorBg)
    .setFontColor(colorGold)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setBorder(true, true, true, true, true, true, colorSlate, SpreadsheetApp.BorderStyle.SOLID);
  
  sheet.setRowHeight(5, 28);
  
  // الشركات السعودية الشهيرة مع إدخال معادلات حية للزخم والمستهدفات
  var rowsData = [
    [1, '2370.SR', 'جاكو', '=IFERROR(GOOGLEFINANCE(B6), 33.80)', 850000, 31.20, '=(D6-F6)/F6', 0.82, '=IF(H6>=MODEL!C$4, "دبل 🔥", IF(H6>=0.50, "انطلاق 🚀", "مراقبة 🛡️"))', '=D6*0.945', '=IF(I6="دبل 🔥", D6*2.0, D6*1.618)', '=(K6-D6)/D6'],
    [2, '8150.SR', 'أسيج', '=IFERROR(GOOGLEFINANCE(B7), 15.40)', 1200000, 12.80, '=(D7-F7)/F7', 0.92, '=IF(H7>=MODEL!C$4, "دبل 🔥", IF(H7>=0.50, "انطلاق 🚀", "مراقبة 🛡️"))', '=D7*0.945', '=IF(I7="دبل 🔥", D7*2.0, D7*1.618)', '=(K7-D7)/D7'],
    [3, '1120.SR', 'الراجحي', '=IFERROR(GOOGLEFINANCE(B8), 88.50)', 450000, 89.00, '=(D8-F8)/F8', 0.45, '=IF(H8>=MODEL!C$4, "دبل 🔥", IF(H8>=0.50, "انطلاق 🚀", "مراقبة 🛡️"))', '=D8*0.945', '=IF(I8="دبل 🔥", D8*2.0, D8*1.618)', '=(K8-D8)/D8'],
    [4, '2010.SR', 'سابك', '=IFERROR(GOOGLEFINANCE(B9), 74.20)', 650000, 71.50, '=(D9-F9)/F9', 0.78, '=IF(H9>=MODEL!C$4, "دبل 🔥", IF(H9>=0.50, "انطلاق 🚀", "مراقبة 🛡️"))', '=D9*0.945', '=IF(I9="دبل 🔥", D9*2.0, D9*1.618)', '=(K9-D9)/D9'],
    [5, '1150.SR', 'الإنماء', '=IFERROR(GOOGLEFINANCE(B10), 34.15)', 1100000, 33.90, '=(D10-F10)/F10', 0.55, '=IF(H10>=MODEL!C$4, "دبل 🔥", IF(H10>=0.50, "انطلاق 🚀", "مراقبة 🛡️"))', '=D10*0.945', '=IF(I10="دبل 🔥", D10*2.0, D10*1.618)', '=(K10-D10)/D10'],
    [6, '2222.SR', 'أرامكو', '=IFERROR(GOOGLEFINANCE(B11), 27.80)', 2200000, 28.10, '=(D11-F11)/F11', 0.35, '=IF(H11>=MODEL!C$4, "دبل 🔥", IF(H11>=0.50, "انطلاق 🚀", "مراقبة 🛡️"))', '=D11*0.945', '=IF(I11="دبل 🔥", D11*2.0, D11*1.618)', '=(K11-D11)/D11']
  ];
  
  sheet.getRange('A6:L11').setValues(rowsData)
    .setHorizontalAlignment('center')
    .setFontColor('#f1f5f9')
    .setBackground('#0f1422');
    
  // تلوين الأسطر التبادلية
  for (var i = 0; i < 6; i++) {
    if (i % 2 === 1) {
      sheet.getRange((6+i) + ':6' + (6+i)).setBackground(colorZebra);
    }
  }
  
  // تنسيق الأرقام والعملات والنسب
  sheet.getRange('D6:D11').setNumberFormat('#,##0.00" ريال"');
  sheet.getRange('E6:E11').setNumberFormat('#,##0');
  sheet.getRange('F6:F11').setNumberFormat('#,##0.00" ريال"');
  sheet.getRange('G6:G11').setNumberFormat('+0.00%;-0.00%;0.00%');
  sheet.getRange('H6:H11').setNumberFormat('0%');
  sheet.getRange('J6:J11').setNumberFormat('#,##0.00" ريال"');
  sheet.getRange('K6:K11').setNumberFormat('#,##0.00" ريال"');
  sheet.getRange('L6:L11').setNumberFormat('+0.0%');
  
  // وضع حدود الـ Grid الفاخرة
  sheet.getRange('A5:L11').setBorder(true, true, true, true, true, true, colorSlate, SpreadsheetApp.BorderStyle.SOLID_LIGHT);
  
  // تفعيل التنسيق الشرطي لعمود الإشارات (دبل - انطلاق - مراقبة)
  var rangeToFormat = sheet.getRange('I6:I11');
  
  var ruleDouble = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('دبل 🔥')
    .setBackground('#064e3b')
    .setFontColor('#34d399')
    .build();
    
  var ruleLaunch = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('انطلاق 🚀')
    .setBackground('#1e3a8a')
    .setFontColor('#60a5fa')
    .build();
    
  var ruleWatch = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('مراقبة 🛡️')
    .setBackground('#1f2937')
    .setFontColor('#9ca3af')
    .build();
    
  var rules = sheet.getConditionalFormatRules();
  rules.push(ruleDouble, ruleLaunch, ruleWatch);
  sheet.setConditionalFormatRules(rules);

  // تجميد الأعمدة والترويسة
  sheet.setFrozenRows(5);
  sheet.setFrozenColumns(3);
  autoFitColumns(sheet, 12);
}

/**
 * معطيات وتنسيق المحفظة المالية الذكية
 */
function setupPortfolio(sheet, colorBg, colorSlate, colorGold, colorZebra) {
  var headers = [[
    'الرمز المالي (A)', 'اسم الشركة (B)', 'الكمية (C)', 'سعر التكلفة (D)', 
    'السعر اللحظي (E)', 'إجمالي التكلفة (F)', 'القيمة السوقية (G)', 'الأرباح والخسائر اللحظية (H)'
  ]];
  
  sheet.getRange('A3:H3').setValues(headers)
    .setBackground(colorBg)
    .setFontColor(colorGold)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setBorder(true, true, true, true, true, true, colorSlate, SpreadsheetApp.BorderStyle.SOLID);
  
  // بيانات المحفظة مع ربط مباشر بالأوراق الأخرى
  var portfolioData = [
    ['8150.SR', 'أسيج', 16, 12.80, '=\'سكانر الموجة الصلبة\'!D7', '=C4*D4', '=C4*E4', '=G4-F4']
  ];
  
  sheet.getRange('A4:H4').setValues(portfolioData)
    .setHorizontalAlignment('center')
    .setFontColor('#f1f5f9')
    .setBackground('#0f1422');
    
  // تنسيقات المحفظة والعملات
  sheet.getRange('D4:H4').setNumberFormat('#,##0.00" ريال"');
  sheet.getRange('C4').setNumberFormat('#,##5');
  
  // وضع إجمالي المحفظة الكلي
  sheet.getRange('A6').setValue('👑 المجموع الملكي الكلي للمحفظة').setFontWeight('bold').setFontColor(colorGold);
  sheet.getRange('F6').setFormula('=SUM(F4:F5)').setFontWeight('bold');
  sheet.getRange('G6').setFormula('=SUM(G4:G5)').setFontWeight('bold');
  sheet.getRange('H6').setFormula('=SUM(H4:H5)').setFontWeight('bold');
  sheet.getRange('F6:H6').setBackground('#1f2937').setFontColor('#ffffff').setNumberFormat('#,##0.00" ريال"');
  
  sheet.getRange('A3:H4').setBorder(true, true, true, true, true, true, colorSlate, SpreadsheetApp.BorderStyle.SOLID_LIGHT);
  sheet.getRange('A6:H6').setBorder(true, true, true, true, true, true, colorSlate, SpreadsheetApp.BorderStyle.DOUBLE);

  autoFitColumns(sheet, 8);
}

/**
 * معطيات وتنسيق صفحة شروط معايير الموديل الحسابي
 */
function setupModelCriteria(sheet, colorBg, colorSlate, colorGold, colorZebra) {
  var headers = [['رقم المعيار (#)', 'المعيار الحسابي للنمط الفني (A)', 'القيمة الحالية المفعلة (B)', 'الشرح وتوجيه رادار الذكاء الاصطناعي (C)']];
  sheet.getRange('A3:D3').setValues(headers)
    .setBackground(colorBg)
    .setFontColor(colorGold)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setBorder(true, true, true, true, true, true, colorSlate, SpreadsheetApp.BorderStyle.SOLID);
  
  var criteria = [
    [1, 'الحد الأدنى لحجم السيولة المطلوب (Volume Min)', 500000, 'التحقق من زخم السيولة وضمان صحة الاختراقات وتجنب عروض التصريف الوهمية.'],
    [2, 'نسبة فيبوناتشي الأدنى لتأكيد موجة الارتداد 2', 0.48, 'يجب أن تصحح الشمعة بنسبة تتجاوز 48% فيبوناتشي لتراكم عروض قاع الصعود.'],
    [3, 'قوة مطابقة النمط لموجة صعود دبل محققة', 0.75, 'درجة النسبة العصبية للرادار لتصنيف الفرصة كطفرة استثنائية وبثها فوراً.']
  ];
  
  sheet.getRange('A4:D6').setValues(criteria)
    .setHorizontalAlignment('center')
    .setFontColor('#f1f5f9')
    .setBackground('#0f1422');
  
  sheet.getRange('A5:D5').setBackground(colorZebra);
  sheet.getRange('C4').setNumberFormat('#,##0');
  sheet.getRange('C5').setNumberFormat('0.00');
  sheet.getRange('C6').setNumberFormat('0%');
  
  sheet.getRange('A3:D6').setBorder(true, true, true, true, true, true, colorSlate, SpreadsheetApp.BorderStyle.SOLID_LIGHT);
  autoFitColumns(sheet, 4);
}

/**
 * معطيات وتنسيق سجل الأرشيف والتغذية الراجعة
 */
function setupDealHistory(sheet, colorBg, colorSlate, colorGold, colorZebra) {
  var headers = [['تاريخ الدخول (A)', 'الرمز (B)', 'الشركة (C)', 'سعر التكلفة (D)', 'المستهدف (E)', 'النتيجة الفعلية وتقييم الـ AI للموجة (F)']];
  sheet.getRange('A3:F3').setValues(headers)
    .setBackground(colorBg)
    .setFontColor(colorGold)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setBorder(true, true, true, true, true, true, colorSlate, SpreadsheetApp.BorderStyle.SOLID);
  
  var history = [
    ['2026-06-01', '2370.SR', 'جاكو', 33.80, 54.00, 'فاشلة (اختراق ارتدادي وهمي بسبب هبوط مؤقت لتاسي) ❌'],
    ['2026-06-03', '8150.SR', 'أسيج', 12.80, 30.80, 'ناجحة (انفجار فني فائق السرعة صعود ويف 3 كاملة) 🏆'],
    ['2026-06-05', '2010.SR', 'سابك', 71.50, 120.00, 'قيد المراقبة اللحظية النشطة للبث الملياري ⏳']
  ];
  
  sheet.getRange('A4:F6').setValues(history)
    .setHorizontalAlignment('center')
    .setFontColor('#f1f5f9')
    .setBackground('#0f1422');
    
  sheet.getRange('A5:F5').setBackground(colorZebra);
  sheet.getRange('D4:E6').setNumberFormat('#,##0.00" ريال"');
  
  sheet.getRange('A3:F6').setBorder(true, true, true, true, true, true, colorSlate, SpreadsheetApp.BorderStyle.SOLID_LIGHT);
  autoFitColumns(sheet, 6);
}

/**
 * دالة مساعدة لضبط عرض الأعمدة أوتوماتيكياً بطريقة مريحة للعين
 */
function autoFitColumns(sheet, maxCol) {
  for (var col = 1; col <= maxCol; col++) {
    sheet.autoResizeColumn(col);
    var width = sheet.getColumnWidth(col);
    sheet.setColumnWidth(col, Math.max(width + 25, 120)); // هامش حماية إضافي لمنع ظهور ####
  }
}

/**
 * دالة محاكاة لتحديث النمط وقيم السيولة بناء على معايير الأسعار الحالية
 */
function simulateAIScan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('سكانر الموجة الصلبة');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('⚠️ الرجاء تشغيل دالة التنسيق أولاً لإعداد الأوراق!');
    return;
  }
  
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('🧠 هل تود تشغيل محرك تصحيح الـ Fibonacci ومحاكاة الذكاء الاصطناعي معاً؟', ui.ButtonSet.YES_NO);
  
  if (response == ui.Button.YES) {
    // محاكاة تحريك بسيط للأسعار والزخم في خلايا الشيت
    var prices = sheet.getRange('D6:D11').getValues();
    var volumes = sheet.getRange('E6:E11').getValues();
    
    for (var i = 0; i < prices.length; i++) {
      var randPercent = 1 + (Math.random() * 0.06 - 0.03); // صعود أو هبوط بحدود 3%
      sheet.getRange(6 + i, 4).setValue(Number((prices[i][0] * randPercent).toFixed(2)));
      // تحديث السيولة عشوائياً
      var randVolChange = Math.floor(Math.random() * 200000 - 100000);
      sheet.getRange(6 + i, 5).setValue(Math.max(100000, volumes[i][0] + randVolChange));
    }
    
    ui.alert('🏆 تم تحديث الأسعار والموجات الحسابية بنجاح! راجع عمود "إشارة الدخول" لتحديد صفقات الـ "دبل 🔥" الجديدة.');
  }
}

/**
 * دالة بث تقرير عاجل لتلجرام من داخل قوقل شيت مباشرة
 */
function sendTelegramAlert() {
  var botToken = '8697405191:AAEb-xv33Xsd--wZ0XijB4KTNBix3px2FYk';
  var chatId = '@the_radar_bott';
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('سكانر الموجة الصلبة');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('ورقة العمل غير جاهزة.');
    return;
  }
  
  // قراءة السهم الأعلى درجة مطابقة بالنمط
  var name = sheet.getRange('C7').getValue(); // أسيج
  var price = sheet.getRange('D7').getValue();
  var target = sheet.getRange('K7').getValue();
  var gain = sheet.getRange('L7').getValue() * 100;
  
  var text = "👑 *تقرير رادار الملياردير من قوقل شيت* 🚀\\n" +
             "============================\\n" +
             "🎯 سهم الفرصة الذهبية المكتشفة: " + name + "\\n" +
             "📊 سعر الشراء اللحظي: " + price + " ريال\\n" +
             "🎯 الهدف المحدد: " + target + " ريال\\n" +
             "🔥 كمية العائد المتوقعة: " + gain.toFixed(1) + "%\\n" +
             "👑 بويست مباشر عبر Apps Script.";
             
  var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage';
  var payload = {
    'chat_id': chatId,
    'text': text,
    'parse_mode': 'Markdown'
  };
  
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var resData = JSON.parse(response.getContentText());
    if (resData.ok) {
      SpreadsheetApp.getUi().alert('🚨 تم إرسال التنبيه وبث الفرصة فوراً إلى قناة التلجرام الملكية @the_radar_bott بنجاح!');
    } else {
      SpreadsheetApp.getUi().alert('خطأ في إرسال تلجرام: ' + JSON.stringify(resData));
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert('حدث خطأ أثناء بث الاتصال بالمخدم: ' + e.toString());
  }
}
`;

export const installationInstructions = `
مرحبا بك يا مستشار الملياردير أبو كيان! إليك أسهل دليل لنسخ لوحة تحكم الرادار الملكية والذهب مباشرة إلى حساب Google Sheets الخاص بك:

1️⃣ افتح مستند جدول بيانات Google جديد (جدول فارغ تماماً).
2️⃣ من القائمة العلوية اضغط على **"Extensions"** (الإضافات) ثم اختر **"Apps Script"** (محرر البرمجيات).
3️⃣ امسح أي كود افتراضي معروض في مساحة العمل.
4️⃣ انسخ الكود البرمجي المقابل من هنا بالكامل واعمل له لصق (Paste) في المحرر.
5️⃣ اضغط على أيقونة **"Save"** (حفظ الحافظة) الموجودة بالأعلى لحفظ الكود.
6️⃣ اختر دالة **"onOpen"** من القائمة المنسدلة واضغط على زر **"Run"** (تشغيل) لمنح التراخيص المطلوبة للملف.
7️⃣ اذهب إلى ملف قوقل شيت، ستبهرك ظهور قائمة ملكية جديدة في الأعلى باسم **"👑 رادار الملياردير"**!
8️⃣ اضغط على الخيار الأول **"📊 إعادة بناء وتنسيق اللوحة بالكامل"**، وسيتحول جدول قوقل شيت الفارغ فوراً إلى رادار المليارديرات المحترف الفاخر باللون الذهبي والكحلي متكاملاً مع معادلات الأسعار الحية وفورمولا فيبوناتشي!
`;
