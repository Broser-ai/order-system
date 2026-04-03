import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";

/* ═══ PRINT CSS — injected once ═══ */
const printCSS = `@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}[data-noprint]{display:none!important}.print-doc{box-shadow:none!important;border:none!important;margin:0!important;padding:16px!important}}`;
if(typeof document!=="undefined"&&!document.getElementById("print-css")){const s=document.createElement("style");s.id="print-css";s.textContent=printCSS;document.head.appendChild(s);}

/* ═══ CURRENCIES ═══ */
const CURRENCIES={DKK:{symbol:"kr",label:"🇩🇰 DKK",name:"Danske kroner"},EUR:{symbol:"€",label:"🇪🇺 EUR",name:"Euro"},USD:{symbol:"$",label:"🇺🇸 USD",name:"US Dollar"},INR:{symbol:"₹",label:"🇮🇳 INR",name:"Indian Rupee"},CNY:{symbol:"¥",label:"🇨🇳 CNY",name:"Chinese Yuan"}};

/* ═══ TRANSLATIONS ═══ */
const T={
da:{title:"Bestillingssystem",sub:"Multi-brand indkøbsordre",pickBrand:"Vælg brand",pickBrandSub:"Vælg en leverandør for at se produkter",pickCat:"Vælg kategori",pickModel:"Vælg model",pickModelSub:"Konfigurér din bestilling",configs:"konfig.",variants:"varianter",size:"Størrelse",network:"Netværk",storage:"Lager",color:"Farve",qty:"Antal",moqNote:"MOQ",pcs:"stk.",addToOrder:"Tilføj til bestilling",config:"Konfiguration",cart:"Bestilling",cartEmpty:"Din bestilling er tom",cartEmptySub:"Konfigurér produkter fra kataloget",orderSummary:"Bestillingsoversigt",units:"enheder",product:"Produkt",gen:"Gen",chip:"Chip/Tech",screen:"Skærm",net:"Netværk",stor:"Lager",clr:"Farve",modelNr:"Model Nr",amount:"Antal",custInfo:"Kundeoplysninger",company:"Firmanavn",contact:"Kontaktperson",email:"Email",phone:"Telefon",address:"Leveringsadresse",notes:"Noter",continueShopping:"Fortsæt indkøb",submitOrder:"Send bestilling",proforma:"PROFORMA FAKTURA",po:"INDKØBSORDRE",billTo:"Faktureres til",orderNr:"Ordre nr",date:"Dato",dueDate:"Forfald",totalUnits:"TOTAL ENHEDER",proformaNote:"Proforma — ikke endelig faktura.",poNote:"Indkøbsordre — bekræftelse afventes.",printPdf:"Print / PDF",newOrder:"Ny bestilling",back:"← Tilbage",categories:"Kategorier",brands:"Brands",min:"Min.",remove:"Fjern",supplierInfo:"Leverandør",supplierName:"Leverandørnavn",supplierContact:"Kontakt",requestedDelivery:"Ønsket levering",skuEU:"SKU EU",skuIn:"SKU Indien",viewProforma:"Kundefaktura",viewPO:"Indkøbsordre",brand:"Brand",lines:"linjer",priceNotice:"Bemærk: Denne bestilling er uden priser. Endelig pris inkl. fragt vil blive fremsendt som separat tilbud efter modtagelse af bestilling.",visitSite:"Besøg officiel hjemmeside",priceLine:"Priser og fragt kalkuleres separat",exportExcel:"Eksportér til Excel",emailOrder:"Send som email",search:"Søg produkt, model, brand...",currency:"Valuta",prefCurrency:"Foretrukken tilbudsvaluta",searchResults:"søgeresultater",goToProduct:"Gå til produkt"},
en:{title:"Order System",sub:"Multi-brand purchase order",pickBrand:"Select brand",pickBrandSub:"Choose a supplier to browse products",pickCat:"Select category",pickModel:"Select model",pickModelSub:"Configure your order",configs:"configs",variants:"variants",size:"Size",network:"Network",storage:"Storage",color:"Color",qty:"Quantity",moqNote:"MOQ",pcs:"pcs",addToOrder:"Add to order",config:"Configuration",cart:"Order",cartEmpty:"Your order is empty",cartEmptySub:"Configure products from the catalog",orderSummary:"Order summary",units:"units",product:"Product",gen:"Gen",chip:"Chip/Tech",screen:"Screen",net:"Network",stor:"Storage",clr:"Color",modelNr:"Model No",amount:"Qty",custInfo:"Customer info",company:"Company",contact:"Contact",email:"Email",phone:"Phone",address:"Address",notes:"Notes",continueShopping:"Continue shopping",submitOrder:"Submit order",proforma:"PROFORMA INVOICE",po:"PURCHASE ORDER",billTo:"Bill to",orderNr:"Order no",date:"Date",dueDate:"Due",totalUnits:"TOTAL UNITS",proformaNote:"Proforma — not a final invoice.",poNote:"Purchase order — awaiting confirmation.",printPdf:"Print / PDF",newOrder:"New order",back:"← Back",categories:"Categories",brands:"Brands",min:"Min.",remove:"Remove",supplierInfo:"Supplier",supplierName:"Supplier",supplierContact:"Contact",requestedDelivery:"Delivery date",skuEU:"SKU EU",skuIn:"SKU India",viewProforma:"Customer invoice",viewPO:"Purchase order",brand:"Brand",lines:"lines",priceNotice:"Please note: This order does not include prices. Final pricing incl. shipping will be sent as a separate quotation upon receipt of order.",visitSite:"Visit official website",priceLine:"Prices and shipping calculated separately",exportExcel:"Export to Excel",emailOrder:"Send as email",search:"Search product, model, brand...",currency:"Currency",prefCurrency:"Preferred quotation currency",searchResults:"search results",goToProduct:"Go to product"},
de:{title:"Bestellsystem",sub:"Multi-Marken Bestellung",pickBrand:"Marke wählen",pickBrandSub:"Lieferant auswählen",pickCat:"Kategorie wählen",pickModel:"Modell wählen",pickModelSub:"Bestellung konfigurieren",configs:"Konfig.",variants:"Varianten",size:"Größe",network:"Netzwerk",storage:"Speicher",color:"Farbe",qty:"Menge",moqNote:"MOQ",pcs:"Stk.",addToOrder:"Hinzufügen",config:"Konfiguration",cart:"Bestellung",cartEmpty:"Bestellung ist leer",cartEmptySub:"Produkte konfigurieren",orderSummary:"Bestellübersicht",units:"Einheiten",product:"Produkt",gen:"Gen",chip:"Chip/Tech",screen:"Display",net:"Netzwerk",stor:"Speicher",clr:"Farbe",modelNr:"Modell-Nr",amount:"Menge",custInfo:"Kundeninfo",company:"Firma",contact:"Kontakt",email:"E-Mail",phone:"Telefon",address:"Adresse",notes:"Notizen",continueShopping:"Weiter einkaufen",submitOrder:"Absenden",proforma:"PROFORMA-RECHNUNG",po:"BESTELLUNG",billTo:"Rechnungsadresse",orderNr:"Bestell-Nr",date:"Datum",dueDate:"Fällig",totalUnits:"GESAMTMENGE",proformaNote:"Proforma — keine endgültige Rechnung.",poNote:"Bestellung — Bestätigung erwartet.",printPdf:"Drucken/PDF",newOrder:"Neue Bestellung",back:"← Zurück",categories:"Kategorien",brands:"Marken",min:"Min.",remove:"Entfernen",supplierInfo:"Lieferant",supplierName:"Lieferant",supplierContact:"Kontakt",requestedDelivery:"Lieferung",skuEU:"SKU EU",skuIn:"SKU Indien",viewProforma:"Kundenrechnung",viewPO:"Bestellung",brand:"Marke",lines:"Pos.",priceNotice:"Hinweis: Diese Bestellung enthält keine Preise. Endpreise inkl. Versand werden als separates Angebot zugesandt.",visitSite:"Offizielle Webseite",priceLine:"Preise und Versand separat",exportExcel:"Als Excel exportieren",emailOrder:"Per E-Mail senden",search:"Suche Produkt, Modell, Marke...",currency:"Währung",prefCurrency:"Bevorzugte Angebotswährung",searchResults:"Suchergebnisse",goToProduct:"Zum Produkt"},
hi:{title:"ऑर्डर सिस्टम",sub:"मल्टी-ब्रांड खरीद आदेश",pickBrand:"ब्रांड चुनें",pickBrandSub:"उत्पाद देखने के लिए चुनें",pickCat:"श्रेणी चुनें",pickModel:"मॉडल चुनें",pickModelSub:"ऑर्डर कॉन्फ़िगर करें",configs:"कॉन्फ़िग",variants:"वेरिएंट",size:"आकार",network:"नेटवर्क",storage:"स्टोरेज",color:"रंग",qty:"मात्रा",moqNote:"MOQ",pcs:"पीस",addToOrder:"जोड़ें",config:"कॉन्फ़िगरेशन",cart:"ऑर्डर",cartEmpty:"ऑर्डर खाली है",cartEmptySub:"कैटलॉग से चुनें",orderSummary:"ऑर्डर सारांश",units:"यूनिट",product:"उत्पाद",gen:"जेन",chip:"चिप",screen:"स्क्रीन",net:"नेटवर्क",stor:"स्टोरेज",clr:"रंग",modelNr:"मॉडल नं",amount:"मात्रा",custInfo:"ग्राहक जानकारी",company:"कंपनी",contact:"संपर्क",email:"ईमेल",phone:"फोन",address:"पता",notes:"नोट्स",continueShopping:"जारी रखें",submitOrder:"भेजें",proforma:"प्रोफॉर्मा",po:"खरीद आदेश",billTo:"प्राप्तकर्ता",orderNr:"ऑर्डर नं",date:"दिनांक",dueDate:"देय",totalUnits:"कुल",proformaNote:"प्रोफॉर्मा — अंतिम नहीं।",poNote:"खरीद आदेश — पुष्टि प्रतीक्षित।",printPdf:"प्रिंट/PDF",newOrder:"नया ऑर्डर",back:"← वापस",categories:"श्रेणियाँ",brands:"ब्रांड",min:"न्यूनतम",remove:"हटाएं",supplierInfo:"आपूर्तिकर्ता",supplierName:"नाम",supplierContact:"संपर्क",requestedDelivery:"डिलीवरी",skuEU:"SKU EU",skuIn:"SKU India",viewProforma:"इनवॉइस",viewPO:"खरीद आदेश",brand:"ब्रांड",lines:"लाइन",priceNotice:"कृपया ध्यान दें: कीमतें शामिल नहीं हैं। शिपिंग सहित अंतिम मूल्य अलग से भेजा जाएगा।",visitSite:"वेबसाइट",priceLine:"कीमतें अलग से",exportExcel:"Excel डाउनलोड",emailOrder:"ईमेल भेजें",search:"खोजें...",currency:"मुद्रा",prefCurrency:"पसंदीदा मुद्रा",searchResults:"परिणाम",goToProduct:"उत्पाद देखें"},
zh:{title:"订购系统",sub:"多品牌采购订单",pickBrand:"选择品牌",pickBrandSub:"选择供应商浏览产品",pickCat:"选择类别",pickModel:"选择型号",pickModelSub:"配置订单",configs:"配置",variants:"款式",size:"尺寸",network:"网络",storage:"存储",color:"颜色",qty:"数量",moqNote:"MOQ",pcs:"件",addToOrder:"加入订单",config:"配置详情",cart:"订单",cartEmpty:"订单为空",cartEmptySub:"前往目录配置",orderSummary:"订单摘要",units:"件",product:"产品",gen:"代",chip:"芯片",screen:"屏幕",net:"网络",stor:"存储",clr:"颜色",modelNr:"型号",amount:"数量",custInfo:"客户信息",company:"公司",contact:"联系人",email:"邮箱",phone:"电话",address:"地址",notes:"备注",continueShopping:"继续选购",submitOrder:"提交",proforma:"形式发票",po:"采购订单",billTo:"收票人",orderNr:"订单号",date:"日期",dueDate:"到期",totalUnits:"总数量",proformaNote:"形式发票——非最终。",poNote:"采购订单——等待确认。",printPdf:"打印/PDF",newOrder:"新订单",back:"← 返回",categories:"类别",brands:"品牌",min:"最少",remove:"移除",supplierInfo:"供应商",supplierName:"名称",supplierContact:"联系人",requestedDelivery:"交货日期",skuEU:"SKU欧洲",skuIn:"SKU印度",viewProforma:"客户发票",viewPO:"采购订单",brand:"品牌",lines:"行",priceNotice:"此订单不含价格，含运费的最终报价将单独发送。",visitSite:"官网",priceLine:"价格运费另计",exportExcel:"导出Excel",emailOrder:"发送邮件",search:"搜索...",currency:"货币",prefCurrency:"报价货币",searchResults:"结果",goToProduct:"查看产品"}};
const LANGS={da:"🇩🇰 Dansk",en:"🇬🇧 English",de:"🇩🇪 Deutsch",hi:"🇮🇳 हिन्दी",zh:"🇨🇳 中文"};

/* ═══ BRANDS ═══ */
const BRANDS={
  Apple:{name:"Apple",logo:"",bg:"linear-gradient(145deg,#0a0a0a,#1a1a2e)",accent:"#0071e3",url:"https://www.apple.com",defaultSupplier:"Apple Distribution International Ltd.",cats:["iPhone","iPad","MacBook","Apple Watch","AirPods"],catIcons:{iPhone:"📱",iPad:"📋",MacBook:"💻","Apple Watch":"⌚",AirPods:"🎧"}},
  JBL:{name:"JBL",logo:"🔊",bg:"linear-gradient(145deg,#ff6600,#cc3300)",accent:"#ff6600",url:"https://www.jbl.com",defaultSupplier:"HARMAN International (Samsung)",cats:["Headphones","Earbuds","Portable Speakers","Party Speakers","Home Speakers"],catIcons:{Headphones:"🎧",Earbuds:"🎵","Portable Speakers":"📢","Party Speakers":"🎉","Home Speakers":"🏠"}},
  Marshall:{name:"Marshall",logo:"🎸",bg:"linear-gradient(145deg,#1a1a1a,#3d2b1f)",accent:"#c8a84e",url:"https://www.marshall.com",defaultSupplier:"Marshall Group / Zound Industries",cats:["Headphones","Earbuds","Portable Speakers","Home Speakers","Soundbars"],catIcons:{Headphones:"🎧",Earbuds:"🎵","Portable Speakers":"📢","Home Speakers":"🏠",Soundbars:"📺"}},
};

/* ═══ PRODUCTS ═══ */
const RAW=[
["Apple","iPhone","iPhone 17 Pro Max","2025","A19 Pro","6.9\"",["5G"],["256GB","512GB","1TB","2TB"],["Silver","Cosmic Orange","Deep Blue"],"A3257"],
["Apple","iPhone","iPhone 17 Pro","2025","A19 Pro","6.3\"",["5G"],["256GB","512GB","1TB"],["Silver","Cosmic Orange","Deep Blue"],"A3256"],
["Apple","iPhone","iPhone Air","2025","A19 Pro","6.5\"",["5G"],["256GB","512GB","1TB"],["Space Black","Cloud White","Light Gold","Sky Blue"],"A3260"],
["Apple","iPhone","iPhone 17","2025","A19","6.3\"",["5G"],["256GB","512GB"],["Black","Lavender","Mist Blue","Sage","White"],"A3254"],
["Apple","iPhone","iPhone 17e","2026","A19","6.1\"",["5G"],["256GB","512GB"],["Black","White","Soft Pink"],"A3500"],
["Apple","iPhone","iPhone 16 Pro Max","2024","A18 Pro","6.9\"",["5G"],["256GB","512GB","1TB"],["Desert Titanium","Natural Titanium","Black Titanium","White Titanium"],"A3295"],
["Apple","iPhone","iPhone 16 Pro","2024","A18 Pro","6.3\"",["5G"],["128GB","256GB","512GB","1TB"],["Desert Titanium","Natural Titanium","Black Titanium","White Titanium"],"A3293"],
["Apple","iPhone","iPhone 16 Plus","2024","A18","6.7\"",["5G"],["128GB","256GB","512GB"],["Ultramarine","Teal","Pink","White","Black"],"A3290"],
["Apple","iPhone","iPhone 16","2024","A18","6.1\"",["5G"],["128GB","256GB","512GB"],["Ultramarine","Teal","Pink","White","Black"],"A3287"],
["Apple","iPhone","iPhone 16e","2025","A18","6.1\"",["5G"],["128GB","256GB","512GB"],["Black","White"],"A3410"],
["Apple","iPad","iPad Pro 11\"","2025","M5","11\"",["Wi-Fi","Wi-Fi + Cellular"],["256GB","512GB","1TB","2TB"],["Space Black","Silver"],"A3357"],
["Apple","iPad","iPad Pro 13\"","2025","M5","13\"",["Wi-Fi","Wi-Fi + Cellular"],["256GB","512GB","1TB","2TB"],["Space Black","Silver"],"A3358"],
["Apple","iPad","iPad Air 11\"","2025","M3","11\"",["Wi-Fi","Wi-Fi + Cellular"],["128GB","256GB","512GB","1TB"],["Space Gray","Blue","Purple","Starlight"],"A3340"],
["Apple","iPad","iPad Air 13\"","2025","M3","13\"",["Wi-Fi","Wi-Fi + Cellular"],["128GB","256GB","512GB","1TB"],["Space Gray","Blue","Purple","Starlight"],"A3341"],
["Apple","iPad","iPad mini (7. gen)","2024","A17 Pro","8.3\"",["Wi-Fi","Wi-Fi + Cellular"],["128GB","256GB","512GB"],["Space Gray","Blue","Purple","Starlight"],"A3030"],
["Apple","iPad","iPad (10. gen)","2024","A14 Bionic","10.9\"",["Wi-Fi","Wi-Fi + Cellular"],["64GB","256GB"],["Blue","Pink","Yellow","Silver"],"A2696"],
["Apple","MacBook","MacBook Air 13\" (M4)","2025","M4","13.6\"",["–"],["256GB","512GB","1TB","2TB"],["Midnight","Starlight","Space Gray","Sky Blue"],"A3550"],
["Apple","MacBook","MacBook Air 15\" (M4)","2025","M4","15.3\"",["–"],["256GB","512GB","1TB","2TB"],["Midnight","Starlight","Space Gray","Sky Blue"],"A3551"],
["Apple","MacBook","MacBook Pro 14\" (M4)","2024","M4","14.2\"",["–"],["512GB","1TB","2TB"],["Space Black","Silver"],"A3530"],
["Apple","MacBook","MacBook Pro 14\" (M4 Pro)","2024","M4 Pro","14.2\"",["–"],["512GB","1TB","2TB","4TB"],["Space Black","Silver"],"A3531"],
["Apple","MacBook","MacBook Pro 14\" (M4 Max)","2024","M4 Max","14.2\"",["–"],["1TB","2TB","4TB"],["Space Black","Silver"],"A3532"],
["Apple","MacBook","MacBook Pro 16\" (M4 Pro)","2024","M4 Pro","16.2\"",["–"],["512GB","1TB","2TB","4TB"],["Space Black","Silver"],"A3535"],
["Apple","MacBook","MacBook Pro 16\" (M4 Max)","2024","M4 Max","16.2\"",["–"],["1TB","2TB","4TB"],["Space Black","Silver"],"A3536"],
["Apple","Apple Watch","Watch Series 11 (Alu)","2025","S10","42mm / 46mm",["GPS","GPS + Cellular + 5G"],["64GB"],["Jet Black","Rose Gold","Silver","Space Gray"],"A3300"],
["Apple","Apple Watch","Watch Series 11 (Ti)","2025","S10","42mm / 46mm",["GPS + Cellular + 5G"],["64GB"],["Natural Titanium","Slate Titanium","Gold Titanium"],"A3304"],
["Apple","Apple Watch","Watch Ultra 3","2025","S10","49mm",["GPS + Cell + 5G + Sat"],["64GB"],["Natural Titanium","Black Titanium"],"A3310"],
["Apple","Apple Watch","Watch SE 3","2025","S10","40mm / 44mm",["GPS","GPS + Cellular + 5G"],["32GB"],["Midnight","Starlight","Silver"],"A3160"],
["Apple","Apple Watch","Watch Series 10","2024","S10","42mm / 46mm",["GPS","GPS + Cellular"],["64GB"],["Jet Black","Rose Gold","Silver"],"A3000"],
["Apple","Apple Watch","Watch Ultra 2","2024","S9","49mm",["GPS + Cellular"],["64GB"],["Natural Titanium","Black Titanium"],"A2986"],
["Apple","AirPods","AirPods Pro 3","2025","H2","–",["Bluetooth 5.3"],["–"],["White"],"A3430"],
["Apple","AirPods","AirPods 4","2024","H2","–",["Bluetooth 5.3"],["–"],["White"],"A3200"],
["Apple","AirPods","AirPods 4 (ANC)","2024","H2","–",["Bluetooth 5.3"],["–"],["White"],"A3201"],
["Apple","AirPods","AirPods Pro 2 (USB-C)","2024","H2","–",["Bluetooth 5.3"],["–"],["White"],"A3048"],
["Apple","AirPods","AirPods Max (USB-C)","2024","H2","–",["Bluetooth 5.3"],["–"],["Midnight","Starlight","Blue","Orange","Purple"],"A3210"],
["JBL","Headphones","JBL Tour ONE M3","2025","40mm Mica","Over-ear",["BT 5.3 + Auracast"],["–"],["Black","Mocha","Blue"],"TOURM3"],
["JBL","Headphones","JBL Live 770NC","2024","40mm","Over-ear",["BT 5.3"],["–"],["Black","Blue","White"],"LIVE770"],
["JBL","Headphones","JBL Live 670NC","2024","40mm","On-ear",["BT 5.3"],["–"],["Black","Blue","White","Rose"],"LIVE670"],
["JBL","Headphones","JBL Tune 770NC","2024","32mm","Over-ear",["BT 5.3"],["–"],["Black","Blue","Purple","White"],"TUNE770"],
["JBL","Headphones","JBL Tune 720BT","2024","32mm","Over-ear",["BT 5.3"],["–"],["Black","Blue","Purple","White"],"TUNE720"],
["JBL","Headphones","JBL Tune 520BT","2024","32mm","On-ear",["BT 5.3"],["–"],["Black","Blue","Purple","White"],"TUNE520"],
["JBL","Earbuds","JBL Tour Pro 3","2025","Dual driver","In-ear",["BT 5.3 + LDAC"],["–"],["Black","Latte"],"TOURPRO3"],
["JBL","Earbuds","JBL Live Buds 3","2024","10mm","TWS",["BT 5.3"],["–"],["Black","Silver","Blue"],"LIVEBUDS3"],
["JBL","Earbuds","JBL Tune Buds 2","2025","10mm","TWS",["BT 5.3"],["–"],["Black","White","Turquoise"],"TUNEBUDS2"],
["JBL","Earbuds","JBL Endurance Race 2","2025","8mm","Sport TWS",["BT 5.3"],["–"],["Black","Blue","Coral"],"ENDRACE2"],
["JBL","Earbuds","JBL Vibe Buds 2","2025","8mm","TWS",["BT 5.3"],["–"],["Black","White","Blue","Pink"],"VIBEBUDS2"],
["JBL","Portable Speakers","JBL Flip 7","2025","IP68","Portable",["BT 5.4 + Auracast"],["–"],["Black","Blue","Red","Pink","Green","White"],"FLIP7"],
["JBL","Portable Speakers","JBL Charge 6","2025","IP67","Portable",["BT 5.4"],["–"],["Black","Blue","Red","Grey","Teal"],"CHARGE6"],
["JBL","Portable Speakers","JBL Xtreme 4","2024","IP67","Portable",["BT 5.3"],["–"],["Black","Blue","Squad (Camo)"],"XTREME4"],
["JBL","Portable Speakers","JBL Go 4","2024","IP67","Ultra-portable",["BT 5.3"],["–"],["Black","Blue","Red","Pink","Purple","White"],"GO4"],
["JBL","Portable Speakers","JBL Clip 5","2024","IP67","Clip-on",["BT 5.3"],["–"],["Black","Blue","Red","Pink","White"],"CLIP5"],
["JBL","Party Speakers","JBL PartyBox 520","2025","400W","Party",["BT 5.4 + Auracast"],["–"],["Black"],"PB520"],
["JBL","Party Speakers","JBL PartyBox Stage 320","2024","240W","Party",["BT 5.4"],["–"],["Black"],"PBS320"],
["JBL","Party Speakers","JBL PartyBox Encore 2","2025","100W","Party",["BT 5.4"],["–"],["Black"],"PBE2"],
["JBL","Home Speakers","JBL Authentics 300","2025","Wi-Fi+BT","Home",["Wi-Fi + BT 5.3"],["–"],["Black/Gold"],"AUTH300"],
["JBL","Home Speakers","JBL Authentics 200","2025","Wi-Fi+BT","Home",["Wi-Fi + BT 5.3"],["–"],["Black/Gold"],"AUTH200"],
["Marshall","Headphones","Monitor III A.N.C.","2024","50mm","Over-ear ANC",["BT 5.4"],["–"],["Black","Cream"],"MONIII"],
["Marshall","Headphones","Major V","2024","40mm","On-ear",["BT 5.3"],["–"],["Black","Brown"],"MAJV"],
["Marshall","Headphones","Major IV","2024","40mm","On-ear",["BT 5.3"],["–"],["Black","Brown"],"MAJIV"],
["Marshall","Earbuds","Minor IV","2024","12mm","TWS",["BT 5.3"],["–"],["Black","Brown","Cream"],"MINIV"],
["Marshall","Earbuds","Motif II A.N.C.","2024","6mm","ANC TWS",["BT 5.3"],["–"],["Black","Cream"],"MOTII"],
["Marshall","Portable Speakers","Emberton III","2025","Stereophonic","Portable",["BT 5.3 LE"],["–"],["Black & Brass","Cream","Forest"],"EMBIII"],
["Marshall","Portable Speakers","Middleton II","2025","Stereophonic","Portable",["BT 5.3 LE"],["–"],["Black & Brass","Cream"],"MIDII"],
["Marshall","Portable Speakers","Willen II","2025","Full-range","Ultra-portable",["BT 5.3"],["–"],["Black & Brass","Cream"],"WILII"],
["Marshall","Portable Speakers","Kilburn III","2024","Stereophonic","Portable",["BT 5.3"],["–"],["Black & Brass","Brown","Cream"],"KILIII"],
["Marshall","Portable Speakers","Tufton","2024","Stereophonic","Portable",["BT 5.0"],["–"],["Black & Brass"],"TUFT"],
["Marshall","Home Speakers","Stanmore III","2024","Stereophonic","Home",["BT 5.2"],["–"],["Black","Cream","Brown"],"STIII"],
["Marshall","Home Speakers","Woburn III","2024","Stereophonic","Home",["BT 5.2"],["–"],["Black","Cream"],"WOBIII"],
["Marshall","Home Speakers","Acton III","2024","Compact","Home",["BT 5.2"],["–"],["Black","Cream"],"ACTIII"],
["Marshall","Soundbars","Heston 120","2025","Dolby Atmos","Soundbar 3.1.2",["Wi-Fi+BT+HDMI eARC"],["–"],["Black"],"HEST120"],
["Marshall","Soundbars","Heston 60","2025","Dolby Atmos","Soundbar 2.0",["Wi-Fi+BT+HDMI eARC"],["–"],["Black"],"HEST60"],
["Marshall","Soundbars","Sub 200","2025","Wireless","Subwoofer",["Wi-Fi"],["–"],["Black"],"SUB200"],
];

function hSKU(s){let h=0;for(let i=0;i<s.length;i++)h=((h<<5)-h+s.charCodeAt(i))&0xffffff;return Math.abs(h).toString(16).toUpperCase().padStart(4,"0").slice(0,4);}
function buildP(){let id=0;const o=[];for(const[br,kat,mod,gen,chip,sk,nets,stors,colors,mnr]of RAW){for(const n of nets)for(const s of stors)for(const c of colors){const h=hSKU(`${mnr}${n}${s}${c}`);o.push({id:id++,brand:br,kategori:kat,model:mod,gen,chip,skaerm:sk,netvaerk:n,lager:s,farve:c,modelNr:mnr,skuEU:`${h}-EU`,skuIn:`${h}-IN`});}}return o;}
const P=buildP();
const CM={"Space Black":"#1d1d1f","Black Titanium":"#2c2c2e","Natural Titanium":"#c5b9a8","White Titanium":"#f5f5f0","Desert Titanium":"#c4a882","Slate Titanium":"#555","Gold Titanium":"#d4af37",Black:"#1d1d1f","Black & Brass":"#1d1d1f",White:"#f5f5f7",Silver:"#c0c0c0","Space Gray":"#6e6e73",Blue:"#4e7eff",Ultramarine:"#3c3cff",Teal:"#30bfbf",Pink:"#ff6482","Soft Pink":"#ffb3c6",Purple:"#bf5af2",Starlight:"#f0e4d3","Sky Blue":"#7ec8e3","Cloud White":"#f0f0f0","Light Gold":"#e8d5a8",Midnight:"#1a2744",Yellow:"#ffe066","Rose Gold":"#e8b4b4","Jet Black":"#0a0a0a",Gold:"#d4af37",Orange:"#ff9500",Lavender:"#b4a7d6","Mist Blue":"#a8c4d4",Sage:"#a8c4a8","Cosmic Orange":"#e86830","Deep Blue":"#1a3d7c",Cream:"#f5f0e0",Brown:"#5c3a21",Forest:"#2d5a27",Mocha:"#6b4c3b","Black/Gold":"#1d1d1f",Red:"#e31937",Green:"#22813a",Coral:"#ff6b5a",Grey:"#8a8a8e","Squad (Camo)":"#4a5a3a",Rose:"#e8a0b4",Latte:"#c8b89a",Turquoise:"#40c9c2"};
const LC=["White","Starlight","White Titanium","Yellow","Natural Titanium","Silver","Rose Gold","Sky Blue","Cloud White","Light Gold","Gold","Gold Titanium","Soft Pink","Lavender","Mist Blue","Sage","Cream","Latte"];
const MOQ=5;
function uniq(a){return[...new Set(a)];}
function genOrd(){const d=new Date();return`PO-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${Math.floor(1e3+Math.random()*9e3)}`;}

function BrandLogo({brand,size=50}){
  if(brand==="Apple") return <svg viewBox="0 0 24 24" width={size} height={size} fill="#f5f5f7"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>;
  if(brand==="JBL") return <svg viewBox="0 0 100 36" width={size*2} height={size*.7}><text x="50" y="30" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontSize="34" fontWeight="900" fill="#fff">JBL</text></svg>;
  return <svg viewBox="0 0 160 28" width={size*2.5} height={size*.45}><text x="80" y="22" textAnchor="middle" fontFamily="serif" fontSize="20" fontWeight="700" fill="#c8a84e" letterSpacing="3">MARSHALL</text></svg>;
}

/* ═══ MAIN APP ═══ */
export default function App(){
  const[lang,setLang]=useState("da");const t=T[lang];
  const[cur,setCur]=useState("EUR");
  const[step,setStep]=useState("brand");
  const[brand,setBrand]=useState(null);
  const[cat,setCat]=useState(null);
  const[selMod,setSelMod]=useState(null);
  const[picks,setPicks]=useState({size:null,net:null,stor:null,color:null});
  const[qty,setQty]=useState(MOQ);
  const[cart,setCart]=useState([]);
  const[cust,setCust]=useState({firma:"",kontakt:"",email:"",tel:"",adresse:"",noter:""});
  const[supplier,setSupplier]=useState({name:"",contact:"",delivery:""});
  const[orderNr,setOrderNr]=useState("");
  const[docView,setDocView]=useState("proforma");
  const[searchQ,setSearchQ]=useState("");
  const[showSearch,setShowSearch]=useState(false);

  const brandData=brand?BRANDS[brand]:null;
  const brandItems=useMemo(()=>P.filter(p=>p.brand===brand),[brand]);
  const catItems=useMemo(()=>brandItems.filter(p=>p.kategori===cat),[brandItems,cat]);
  const modelNames=useMemo(()=>uniq(catItems.map(p=>p.model)),[catItems]);
  const modItems=useMemo(()=>catItems.filter(p=>p.model===selMod),[catItems,selMod]);
  const sizes=useMemo(()=>uniq(modItems.map(p=>p.skaerm)),[modItems]);
  const afterSz=useMemo(()=>picks.size?modItems.filter(p=>p.skaerm===picks.size):modItems,[modItems,picks.size]);
  const nets=useMemo(()=>uniq(afterSz.map(p=>p.netvaerk)),[afterSz]);
  const afterNt=useMemo(()=>picks.net?afterSz.filter(p=>p.netvaerk===picks.net):afterSz,[afterSz,picks.net]);
  const stors=useMemo(()=>uniq(afterNt.map(p=>p.lager).filter(l=>l!=="–")),[afterNt]);
  const afterSt=useMemo(()=>picks.stor?afterNt.filter(p=>p.lager===picks.stor):afterNt,[afterNt,picks.stor]);
  const clrs=useMemo(()=>uniq(afterSt.map(p=>p.farve)),[afterSt]);
  const final=useMemo(()=>picks.color?afterSt.find(p=>p.farve===picks.color):null,[afterSt,picks.color]);
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);

  // Search results
  const searchResults=useMemo(()=>{
    if(!searchQ||searchQ.length<2) return[];
    const q=searchQ.toLowerCase();
    const seen=new Set();
    return P.filter(p=>{
      const key=`${p.brand}-${p.model}`;
      if(seen.has(key))return false;
      const match=[p.brand,p.model,p.kategori,p.chip,p.farve,p.modelNr].some(v=>v.toLowerCase().includes(q));
      if(match)seen.add(key);
      return match;
    }).slice(0,12);
  },[searchQ]);

  useEffect(()=>{
    if(step!=="configure")return;
    let ns=picks.size,nn=picks.net,nt=picks.stor,nc=picks.color,ch=false;
    if(!ns&&sizes.length===1){ns=sizes[0];ch=true;}
    if(ns&&!nn&&nets.length===1){nn=nets[0];ch=true;}
    if(!ns&&!nn&&nets.length===1){nn=nets[0];ch=true;}
    if(nn&&!nt&&stors.length===0){nt="–";ch=true;}
    if(nn&&!nt&&stors.length===1){nt=stors[0];ch=true;}
    if((nt||stors.length===0)&&!nc&&clrs.length===1){nc=clrs[0];ch=true;}
    if(ch)setPicks({size:ns,net:nn,stor:nt,color:nc});
  },[step,selMod,picks.size,picks.net,picks.stor,picks.color]);

  const reset=()=>setPicks({size:null,net:null,stor:null,color:null});
  const goHome=()=>{setStep("brand");setBrand(null);setCat(null);setSelMod(null);reset();setQty(MOQ);setShowSearch(false);};
  const goBrand=b=>{setBrand(b);setStep("category");setCat(null);setSelMod(null);reset();setSupplier(s=>({...s,name:BRANDS[b].defaultSupplier}));};
  const goCat=c=>{setCat(c);setStep("model");setSelMod(null);reset();};
  const goMod=m=>{setSelMod(m);setStep("configure");reset();setQty(MOQ);};
  const addToCart=()=>{if(!final||qty<MOQ)return;const idx=cart.findIndex(i=>i.skuEU===final.skuEU&&i.brand===final.brand);if(idx>=0)setCart(c=>c.map((x,i)=>i===idx?{...x,qty:x.qty+qty}:x));else setCart(c=>[...c,{...final,qty}]);reset();setQty(MOQ);setStep("model");};
  const submit=()=>{setOrderNr(genOrd());setDocView("proforma");setStep("invoice");};

  // Excel export
  const exportExcel=()=>{
    const rows=cart.map((it,i)=>({[t.brand]:it.brand,[t.product]:it.model,[t.gen]:it.gen,[t.chip]:it.chip,[t.screen]:it.skaerm,[t.net]:it.netvaerk,[t.stor]:it.lager,[t.clr]:it.farve,[t.modelNr]:it.modelNr,"SKU EU":it.skuEU,"SKU India":it.skuIn,[t.amount]:it.qty}));
    const ws=XLSX.utils.json_to_sheet(rows);
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,orderNr||"Order");
    // Add info sheet
    const info=[[t.orderNr,orderNr],[t.date,new Date().toLocaleDateString()],[t.company,cust.firma],[t.contact,cust.kontakt],[t.email,cust.email],[t.phone,cust.tel],[t.address,cust.adresse],[t.currency,`${CURRENCIES[cur].name} (${cur})`],[t.supplierName,supplier.name],[""],[t.priceLine,t.priceNotice]];
    const ws2=XLSX.utils.aoa_to_sheet(info);
    XLSX.utils.book_append_sheet(wb,ws2,"Info");
    XLSX.writeFile(wb,`${orderNr||"bestilling"}.xlsx`);
  };

  // Email mailto
  const sendEmail=()=>{
    const lines=cart.map((it,i)=>`${i+1}. ${it.brand} ${it.model} | ${it.farve} ${it.lager!=="–"?it.lager:""} | ${it.modelNr} | ${it.qty}x`).join("%0A");
    const body=`${t.orderNr}: ${orderNr}%0A${t.company}: ${cust.firma}%0A${t.contact}: ${cust.kontakt}%0A${t.currency}: ${cur}%0A%0A${t.orderSummary}:%0A${lines}%0A%0A${t.totalUnits}: ${cartCount} ${t.pcs}%0A%0A${t.priceLine}%0A${t.notes}: ${cust.noter||"–"}`;
    window.open(`mailto:?subject=${encodeURIComponent(`${t.po} ${orderNr}`)}&body=${body}`);
  };

  const goToSearchResult=(r)=>{
    setBrand(r.brand);setStep("category");
    setTimeout(()=>{setCat(r.kategori);setStep("model");
      setTimeout(()=>{setSelMod(r.model);setStep("configure");reset();setQty(MOQ);},50);
    },50);
    setShowSearch(false);setSearchQ("");
  };

  const f="'SF Pro Display',-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif";
  const ac=brandData?.accent||"#0071e3";
  const oS={color:"#1d1d1f",background:"#fff",fontSize:13,padding:6}; // option style

  const S={
    root:{fontFamily:f,background:"#f5f5f7",minHeight:"100vh",color:"#1d1d1f"},
    nav:{background:"#000",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100,flexWrap:"wrap",gap:6},
    logo:{color:"#f5f5f7",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",gap:6,cursor:"pointer"},
    navR:{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"},
    sel:{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",borderRadius:7,padding:"5px 22px 5px 8px",color:"#f5f5f7",fontSize:11,outline:"none",cursor:"pointer",WebkitAppearance:"none",appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23fff'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 7px center"},
    searchBtn:{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",borderRadius:7,padding:"5px 10px",color:"#f5f5f7",cursor:"pointer",fontSize:12},
    cartBtn:{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",borderRadius:7,padding:"5px 12px",color:"#f5f5f7",cursor:"pointer",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:5},
    badge:{background:ac,borderRadius:7,padding:"1px 6px",fontSize:9,fontWeight:800,color:"#fff"},
    bc:{padding:"8px 16px",display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#86868b",flexWrap:"wrap",background:"#fff",borderBottom:"1px solid #e8e8ed"},
    bcL:{color:ac,cursor:"pointer",fontWeight:500,background:"none",border:"none",fontSize:11,padding:0},
    main:{padding:"14px 16px 60px",maxWidth:1100,margin:"0 auto"},
    h1:{fontSize:22,fontWeight:800,letterSpacing:"-1px",marginBottom:3},
    sub:{fontSize:11,color:"#86868b",marginBottom:14},
    bg:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12},
    bc2:b=>({background:BRANDS[b].bg,borderRadius:18,padding:"32px 24px",cursor:"pointer",transition:"all .3s",border:"3px solid transparent",textAlign:"center",color:"#f5f5f7",display:"flex",flexDirection:"column",alignItems:"center",gap:8}),
    cg:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(135px,1fr))",gap:8},
    cc:{borderRadius:12,padding:"18px 10px",cursor:"pointer",transition:"all .3s",border:"2px solid transparent",textAlign:"center",color:"#f5f5f7"},
    mg:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8},
    mc:{background:"#fff",borderRadius:10,padding:"14px 12px",cursor:"pointer",transition:"all .2s",border:"2px solid #e8e8ed"},
    box:{background:"#fff",borderRadius:10,padding:"14px",marginBottom:8,border:"1px solid #e8e8ed"},
    lbl:{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",color:"#86868b",marginBottom:6},
    og:{display:"flex",flexWrap:"wrap",gap:5},
    ob:a=>({padding:"7px 14px",borderRadius:8,border:a?`2px solid ${ac}`:"2px solid #e8e8ed",background:a?`${ac}15`:"#fff",cursor:"pointer",fontSize:12,fontWeight:a?700:500,color:a?ac:"#1d1d1f"}),
    cb:(c,a)=>({width:28,height:28,borderRadius:"50%",border:a?`3px solid ${ac}`:`2px solid ${LC.includes(c)?"#ddd":"#555"}`,background:CM[c]||"#ccc",cursor:"pointer",outline:a?`2px solid ${ac}44`:"none",outlineOffset:2}),
    cl:{fontSize:8,color:"#86868b",textAlign:"center",marginTop:1,maxWidth:40,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},
    sum:{background:"#f5f5f7",borderRadius:8,padding:"10px",marginTop:8,border:"1px solid #e8e8ed"},
    sr:{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:11},
    aBtn:{background:ac,color:"#fff",border:"none",borderRadius:10,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%",marginTop:10},
    sec:{background:"#fff",borderRadius:12,border:"1px solid #e8e8ed",padding:"14px",marginBottom:10},
    st:{fontSize:14,fontWeight:700,marginBottom:10},
    tbl:{width:"100%",borderCollapse:"collapse",fontSize:9},
    th:{textAlign:"left",padding:"5px 3px",borderBottom:"2px solid #1d1d1f",fontWeight:700,fontSize:8,textTransform:"uppercase",color:"#86868b"},
    td:{padding:"5px 3px",borderBottom:"1px solid #f0f0f5",verticalAlign:"middle"},
    ig:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6},
    inp:{width:"100%",padding:"8px 10px",border:"1px solid #d2d2d7",borderRadius:6,fontSize:12,outline:"none",boxSizing:"border-box"},
    il:{display:"block",fontSize:8,fontWeight:700,color:"#86868b",marginBottom:2,textTransform:"uppercase"},
    pBtn:{background:ac,color:"#fff",border:"none",borderRadius:8,padding:"8px 18px",fontSize:12,fontWeight:600,cursor:"pointer"},
    sBtn:{background:"#f5f5f7",color:"#1d1d1f",border:"1px solid #d2d2d7",borderRadius:8,padding:"8px 18px",fontSize:12,fontWeight:600,cursor:"pointer"},
    dBtn:{background:"none",border:"none",color:"#ff3b30",cursor:"pointer",fontSize:9,fontWeight:600},
    bl:{color:ac,cursor:"pointer",fontSize:11,fontWeight:500,border:"none",background:"none",padding:0,marginBottom:8},
    stamp:c=>({display:"inline-block",border:`2px solid ${c}`,color:c,borderRadius:6,padding:"3px 10px",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",transform:"rotate(-4deg)"}),
    docTab:a=>({padding:"7px 14px",borderRadius:"8px 8px 0 0",border:a?`2px solid ${ac}`:"2px solid #e8e8ed",borderBottom:a?"2px solid #fff":"2px solid #e8e8ed",background:a?"#fff":"#f5f5f7",cursor:"pointer",fontSize:11,fontWeight:a?700:500,color:a?ac:"#86868b",marginBottom:-2}),
    moq:{fontSize:8,color:"#ff9500",fontWeight:600,marginTop:1},
    // Search overlay
    searchOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",zIndex:200,display:"flex",justifyContent:"center",paddingTop:80},
    searchBox:{background:"#fff",borderRadius:16,width:"90%",maxWidth:520,maxHeight:"70vh",overflow:"auto",padding:20,boxShadow:"0 20px 60px rgba(0,0,0,.3)"},
    searchInput:{width:"100%",padding:"12px 16px",border:"2px solid #e8e8ed",borderRadius:10,fontSize:15,outline:"none",boxSizing:"border-box"},
    searchResult:{padding:"10px 12px",borderBottom:"1px solid #f0f0f5",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"},
  };

  // ═══ SEARCH OVERLAY ═══
  const SearchOverlay=()=>(<div style={S.searchOverlay} onClick={()=>setShowSearch(false)}><div style={S.searchBox} onClick={e=>e.stopPropagation()}>
    <input autoFocus style={S.searchInput} placeholder={t.search} value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
    {searchQ.length>=2&&<div style={{marginTop:12,fontSize:11,color:"#86868b"}}>{searchResults.length} {t.searchResults}</div>}
    <div style={{marginTop:8}}>{searchResults.map((r,i)=>(<div key={i} style={S.searchResult} onClick={()=>goToSearchResult(r)} onMouseEnter={e=>e.currentTarget.style.background="#f5f5f7"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <div><div style={{fontWeight:600,fontSize:13}}>{r.model}</div><div style={{fontSize:10,color:"#86868b"}}>{r.brand} · {r.kategori} · {r.chip} · {r.gen}</div></div>
      <span style={{fontSize:10,color:ac,fontWeight:600}}>{t.goToProduct} →</span>
    </div>))}</div>
  </div></div>);

  // ═══ BRAND DASHBOARD ═══
  const BrandV=()=>(<div style={S.main}>
    <h1 style={S.h1}>{t.pickBrand}</h1><p style={S.sub}>{t.pickBrandSub}</p>
    <div style={S.bg}>{Object.keys(BRANDS).map(b=>(<div key={b} style={S.bc2(b)} onClick={()=>goBrand(b)} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.4)";e.currentTarget.style.transform="translateY(-3px) scale(1.02)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.transform="none";}}>
      <BrandLogo brand={b}/>
      <div style={{fontSize:11,opacity:.7}}>{BRANDS[b].cats.length} {t.categories} · {P.filter(p=>p.brand===b).length} {t.variants}</div>
      <a href={BRANDS[b].url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:"rgba(255,255,255,.8)",textDecoration:"underline"}}>🔗 {t.visitSite} →</a>
    </div>))}</div>
    <div style={{marginTop:16,padding:"14px 16px",background:"#fff",borderRadius:10,border:"1px solid #e8e8ed",display:"flex",alignItems:"flex-start",gap:10}}>
      <span style={{fontSize:16,flexShrink:0}}>ℹ️</span>
      <div style={{fontSize:11,color:"#555",lineHeight:1.5}}>{t.priceNotice}</div>
    </div>
  </div>);

  // ═══ CATEGORY ═══
  const CatV=()=>(<div style={S.main}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6,marginBottom:3}}><h1 style={S.h1}>{brandData.name}</h1><a href={brandData.url} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:ac,fontWeight:600,textDecoration:"none"}}>🔗 {brandData.url.replace("https://www.","")}</a></div><p style={S.sub}>{t.pickCat}</p><div style={S.cg}>{brandData.cats.map(c=>{const n=brandItems.filter(p=>p.kategori===c).length;return(<div key={c} style={{...S.cc,background:brandData.bg}} onClick={()=>goCat(c)} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.3)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";}}><span style={{fontSize:24,display:"block",marginBottom:3}}>{brandData.catIcons[c]}</span><div style={{fontSize:12,fontWeight:700}}>{c}</div><div style={{fontSize:9,opacity:.6}}>{n} {t.variants}</div></div>);})}</div></div>);

  // ═══ MODEL ═══
  const ModV=()=>{const info=modelNames.map(m=>{const its=catItems.filter(p=>p.model===m);return{name:m,chip:uniq(its.map(i=>i.chip)).join("/"),gen:uniq(its.map(i=>i.gen)).join(","),screen:uniq(its.map(i=>i.skaerm)).join("/"),n:its.length};});return(<div style={S.main}><h1 style={S.h1}>{cat}</h1><p style={S.sub}>{t.pickModelSub}</p><div style={S.mg}>{info.map(m=>(<div key={m.name} style={S.mc} onClick={()=>goMod(m.name)} onMouseEnter={e=>{e.currentTarget.style.borderColor=ac;}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#e8e8ed";}}><div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{m.name}</div><div style={{fontSize:10,color:"#86868b"}}>{m.chip} · {m.screen} · {m.gen}</div><div style={{display:"inline-block",background:"#f0f0f5",borderRadius:4,padding:"1px 6px",fontSize:9,fontWeight:600,marginTop:4,color:"#555"}}>{m.n} {t.configs}</div></div>))}</div></div>);};

  // ═══ CONFIGURE ═══
  const CfgV=()=>{const ref=modItems[0];const showSz=sizes.length>1;const showNet=nets.length>1;const showStor=stors.length>0;const ready=!!final;const pc=picks.color||clrs[0]||"Black";const bg=CM[pc]||"#999";
  return(<div style={S.main}><h1 style={S.h1}>{selMod}</h1><p style={S.sub}>{ref?.chip} · {ref?.skaerm} · {ref?.gen}</p>
    <div style={{display:"flex",justifyContent:"center",padding:"14px",background:"linear-gradient(180deg,#f5f5f7,#e8e8ed)",borderRadius:10,marginBottom:8}}>
      <div style={{width:80,height:80,borderRadius:cat?.includes("Watch")?40:cat?.includes("Ear")||cat?.includes("AirPods")||cat?.includes("Buds")?30:14,background:bg,border:`3px solid ${LC.includes(pc)?"#ccc":"#333"}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 24px rgba(0,0,0,.15)",transition:"all .3s"}}><span style={{fontSize:9,color:LC.includes(pc)?"#333":"#eee",fontWeight:700,textAlign:"center",padding:6,lineHeight:1.2}}>{selMod}</span></div></div>
    {showSz&&<div style={S.box}><div style={S.lbl}>{t.size}</div><div style={S.og}>{sizes.map(sz=>(<button key={sz} style={S.ob(picks.size===sz)} onClick={()=>setPicks({size:sz,net:null,stor:null,color:null})}>{sz}</button>))}</div></div>}
    {(picks.size||!showSz)&&showNet&&<div style={S.box}><div style={S.lbl}>{t.network}</div><div style={S.og}>{nets.map(n=>(<button key={n} style={S.ob(picks.net===n)} onClick={()=>setPicks(p=>({...p,net:n,stor:null,color:null}))}>{n}</button>))}</div></div>}
    {(picks.net||(!showNet&&(picks.size||!showSz)))&&showStor&&<div style={S.box}><div style={S.lbl}>{t.storage}</div><div style={S.og}>{stors.map(s=>(<button key={s} style={S.ob(picks.stor===s)} onClick={()=>setPicks(p=>({...p,stor:s,color:null}))}>{s}</button>))}</div></div>}
    {(picks.stor||(!showStor&&(picks.net||!showNet)))&&clrs.length>0&&<div style={S.box}><div style={S.lbl}>{t.color}</div><div style={S.og}>{clrs.map(c=>(<div key={c} style={{display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer"}} onClick={()=>setPicks(p=>({...p,color:c}))}><div style={S.cb(c,picks.color===c)}/><div style={S.cl}>{c}</div></div>))}</div></div>}
    {ready&&<div style={S.box}>
      <div style={S.lbl}>{t.qty} ({t.moqNote}: {MOQ})</div>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><button style={{padding:"5px 12px",fontSize:16,border:"2px solid #e8e8ed",borderRadius:6,background:"#fff",cursor:"pointer",fontWeight:700}} onClick={()=>setQty(q=>Math.max(MOQ,q-1))}>−</button><input type="number" min={MOQ} value={qty} onChange={e=>setQty(Math.max(MOQ,+e.target.value||MOQ))} style={{width:50,padding:"5px",border:"1px solid #d2d2d7",borderRadius:6,fontSize:13,textAlign:"center",outline:"none"}}/><button style={{padding:"5px 12px",fontSize:16,border:"2px solid #e8e8ed",borderRadius:6,background:"#fff",cursor:"pointer",fontWeight:700}} onClick={()=>setQty(q=>q+1)}>+</button></div>
      <div style={S.sum}>{[[t.brand,final.brand],[t.product,final.model],[t.gen,final.gen],[t.chip,final.chip],[t.clr,final.farve],[t.stor,final.lager],[t.modelNr,final.modelNr],["SKU",final.skuEU],[t.qty,`${qty} ${t.pcs}`]].filter(([,v])=>v&&v!=="–").map(([l,v])=>(<div key={l} style={S.sr}><span style={{color:"#86868b"}}>{l}</span><span style={{fontWeight:600,fontSize:10}}>{v}</span></div>))}</div>
      <button style={S.aBtn} onClick={addToCart}>{t.addToOrder} ({qty} {t.pcs})</button>
    </div>}
  </div>);};

  // ═══ CART ═══
  const CartV=()=>(<div style={S.main} data-noprint><button style={S.bl} onClick={goHome}>{t.back} {t.brands}</button>{cart.length===0?(<div style={{textAlign:"center",padding:"30px 16px",color:"#86868b"}}><div style={{fontSize:34,opacity:.3}}>🛒</div><div style={{fontSize:13,fontWeight:600,marginTop:6}}>{t.cartEmpty}</div></div>):(<>
    <div style={S.sec}><div style={S.st}>{t.orderSummary} ({cartCount} {t.units})</div><div style={{overflowX:"auto"}}><table style={S.tbl}><thead><tr>{["#",t.brand,t.product,t.gen,t.chip,t.clr,t.stor,t.modelNr,"SKU",t.amount,""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead><tbody>{cart.map((it,i)=><tr key={i}><td style={{...S.td,color:"#86868b"}}>{i+1}</td><td style={{...S.td,fontWeight:600,fontSize:8}}>{it.brand}</td><td style={{...S.td,fontWeight:600,whiteSpace:"nowrap"}}>{it.model}</td><td style={S.td}>{it.gen}</td><td style={{...S.td,fontSize:8}}>{it.chip}</td><td style={S.td}>{it.farve}</td><td style={S.td}>{it.lager}</td><td style={{...S.td,fontSize:8}}>{it.modelNr}</td><td style={{...S.td,fontFamily:"monospace",fontSize:7}}>{it.skuEU}</td><td style={S.td}><input type="number" min={MOQ} value={it.qty} onChange={e=>{const v=Math.max(MOQ,+e.target.value||MOQ);setCart(c=>c.map((x,j)=>j===i?{...x,qty:v}:x));}} style={{width:44,padding:"3px",border:"1px solid #d2d2d7",borderRadius:4,fontSize:11,textAlign:"center"}}/></td><td style={S.td}><button style={S.dBtn} onClick={()=>setCart(c=>c.filter((_,j)=>j!==i))}>✕</button></td></tr>)}</tbody><tfoot><tr style={{background:"#f5f5f7",fontWeight:700}}><td colSpan={9} style={{...S.td,textAlign:"right",fontSize:10}}>{t.totalUnits}</td><td style={S.td}>{cartCount}</td><td/></tr></tfoot></table></div></div>
    <div style={S.sec}><div style={S.st}>{t.custInfo}</div><div style={S.ig}><div><label style={S.il}>{t.company} *</label><input style={S.inp} value={cust.firma} onChange={e=>setCust(c=>({...c,firma:e.target.value}))}/></div><div><label style={S.il}>{t.contact} *</label><input style={S.inp} value={cust.kontakt} onChange={e=>setCust(c=>({...c,kontakt:e.target.value}))}/></div></div><div style={S.ig}><div><label style={S.il}>{t.email} *</label><input style={S.inp} type="email" value={cust.email} onChange={e=>setCust(c=>({...c,email:e.target.value}))}/></div><div><label style={S.il}>{t.phone}</label><input style={S.inp} value={cust.tel} onChange={e=>setCust(c=>({...c,tel:e.target.value}))}/></div></div><div style={{marginBottom:6}}><label style={S.il}>{t.address}</label><input style={S.inp} value={cust.adresse} onChange={e=>setCust(c=>({...c,adresse:e.target.value}))}/></div><div style={{marginBottom:6}}><label style={S.il}>{t.notes}</label><textarea style={{...S.inp,minHeight:36,resize:"vertical",fontFamily:f}} value={cust.noter} onChange={e=>setCust(c=>({...c,noter:e.target.value}))}/></div></div>
    <div style={S.sec}><div style={S.st}>{t.supplierInfo}</div><div style={S.ig}><div><label style={S.il}>{t.supplierName}</label><input style={S.inp} value={supplier.name} onChange={e=>setSupplier(s=>({...s,name:e.target.value}))}/></div><div><label style={S.il}>{t.supplierContact}</label><input style={S.inp} value={supplier.contact} onChange={e=>setSupplier(s=>({...s,contact:e.target.value}))}/></div></div><div style={{marginBottom:6}}><label style={S.il}>{t.requestedDelivery}</label><input style={S.inp} type="date" value={supplier.delivery} onChange={e=>setSupplier(s=>({...s,delivery:e.target.value}))}/></div></div>
    <div style={{display:"flex",gap:6,justifyContent:"flex-end",flexWrap:"wrap"}}><button style={S.sBtn} onClick={goHome}>{t.continueShopping}</button><button style={{...S.pBtn,opacity:(!cust.firma||!cust.kontakt||!cust.email)?.5:1}} onClick={submit} disabled={!cust.firma||!cust.kontakt||!cust.email}>{t.submitOrder}</button></div>
  </>)}</div>);

  // ═══ INVOICE ═══
  const InvV=()=>{const now=new Date();const dl=lang==="da"?"da-DK":lang==="de"?"de-DE":lang==="zh"?"zh-CN":lang==="hi"?"hi-IN":"en-GB";const d1=now.toLocaleDateString(dl,{day:"numeric",month:"long",year:"numeric"});const d2=new Date(now.getTime()+14*864e5).toLocaleDateString(dl,{day:"numeric",month:"long",year:"numeric"});const isPO=docView==="po";
  return(<div style={S.main}>
    <div data-noprint style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
      <button style={S.sBtn} onClick={()=>window.print()}>🖨 {t.printPdf}</button>
      <button style={S.sBtn} onClick={exportExcel}>📊 {t.exportExcel}</button>
      <button style={S.sBtn} onClick={sendEmail}>📧 {t.emailOrder}</button>
      <button style={S.pBtn} onClick={()=>{setCart([]);setCust({firma:"",kontakt:"",email:"",tel:"",adresse:"",noter:""});setOrderNr("");goHome();}}>+ {t.newOrder}</button>
    </div>
    <div data-noprint style={{display:"flex",gap:3}}><button style={S.docTab(docView==="proforma")} onClick={()=>setDocView("proforma")}>{t.viewProforma}</button><button style={S.docTab(docView==="po")} onClick={()=>setDocView("po")}>{t.viewPO}</button></div>
    <div className="print-doc" style={{...S.sec,maxWidth:1000,borderTopLeftRadius:0,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:8}}>
        <div><div style={{fontSize:18,fontWeight:800,letterSpacing:"-.5px",marginBottom:1}}>{isPO?t.po:t.proforma}</div><div style={{color:"#86868b",fontSize:10}}>{uniq(cart.map(i=>i.brand)).join(" · ")}</div></div>
        <div style={S.stamp(isPO?"#0071e3":"#34c759")}>{isPO?"PO":"PROFORMA"}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div><div style={{fontSize:8,fontWeight:700,color:"#86868b",textTransform:"uppercase",marginBottom:3}}>{isPO?t.supplierInfo:t.billTo}</div>{isPO?(<><div style={{fontWeight:700,fontSize:12}}>{supplier.name}</div>{supplier.contact&&<div style={{fontSize:10}}>{supplier.contact}</div>}{supplier.delivery&&<div style={{fontSize:10}}>{t.requestedDelivery}: {supplier.delivery}</div>}</>):(<><div style={{fontWeight:700,fontSize:12}}>{cust.firma}</div><div style={{fontSize:10}}>{cust.kontakt} · {cust.email}</div>{cust.tel&&<div style={{fontSize:10}}>{cust.tel}</div>}{cust.adresse&&<div style={{fontSize:10}}>{cust.adresse}</div>}</>)}</div>
        <div style={{textAlign:"right"}}>{[[t.orderNr+":",orderNr],[t.date+":",d1],[t.dueDate+":",d2],[t.currency+":",`${CURRENCIES[cur].name} (${CURRENCIES[cur].symbol})`]].map(([l,v])=>(<div key={l} style={{fontSize:10,marginBottom:2}}><span style={{color:"#86868b"}}>{l} </span><span style={{fontWeight:600}}>{v}</span></div>))}</div>
      </div>
      {isPO&&<div style={{background:"#f5f5f7",borderRadius:6,padding:8,marginBottom:12,fontSize:10}}><strong>{t.custInfo}:</strong> {cust.firma} — {cust.kontakt} — {cust.email}</div>}
      <div style={{overflowX:"auto"}}><table style={S.tbl}><thead><tr>{["#",t.brand,t.product,t.gen,t.chip,t.clr,t.stor,t.modelNr,"SKU EU","SKU IN",t.amount].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead><tbody>{cart.map((it,i)=><tr key={i}><td style={{...S.td,color:"#86868b"}}>{i+1}</td><td style={{...S.td,fontWeight:600,fontSize:8}}>{it.brand}</td><td style={{...S.td,fontWeight:600,whiteSpace:"nowrap"}}>{it.model}</td><td style={S.td}>{it.gen}</td><td style={{...S.td,fontSize:8}}>{it.chip}</td><td style={S.td}>{it.farve}</td><td style={S.td}>{it.lager}</td><td style={{...S.td,fontSize:8}}>{it.modelNr}</td><td style={{...S.td,fontFamily:"monospace",fontSize:7}}>{it.skuEU}</td><td style={{...S.td,fontFamily:"monospace",fontSize:7}}>{it.skuIn}</td><td style={{...S.td,fontWeight:700,textAlign:"center"}}>{it.qty}</td></tr>)}</tbody><tfoot><tr style={{background:"#0a0a0a",color:"#fff"}}><td colSpan={10} style={{...S.td,textAlign:"right",fontWeight:700,fontSize:10,color:"#fff"}}>{t.totalUnits}</td><td style={{...S.td,fontWeight:700,fontSize:10,color:"#fff",textAlign:"center"}}>{cartCount} {t.pcs}</td></tr></tfoot></table></div>
      {cust.noter&&<div style={{marginTop:10,padding:8,background:"#f5f5f7",borderRadius:6,fontSize:9}}><strong>{t.notes}:</strong> {cust.noter}</div>}
      <div style={{marginTop:12,paddingTop:8,borderTop:"1px solid #e8e8ed",fontSize:8,color:"#86868b",textAlign:"center"}}>{isPO?t.poNote:t.proformaNote} {t.moqNote}: {MOQ} {t.pcs}.</div>
      <div style={{marginTop:8,padding:"8px 12px",background:"#fffbeb",border:"1px solid #f5e6a3",borderRadius:6,fontSize:9,color:"#92700c",textAlign:"center",fontWeight:600}}>⚠️ {t.priceLine} — {t.prefCurrency}: {CURRENCIES[cur].name} ({CURRENCIES[cur].symbol})</div>
    </div></div>);};

  return(<div style={S.root}>
    <div style={S.nav}>
      <div style={S.logo} onClick={goHome}><span style={{fontSize:14}}>📦</span><div><span>{t.title}</span><div style={{fontSize:7,opacity:.5,textTransform:"uppercase",letterSpacing:"1.5px"}}>{t.sub}</div></div></div>
      <div style={S.navR}>
        <button style={S.searchBtn} onClick={()=>setShowSearch(true)}>🔍</button>
        <select style={S.sel} value={lang} onChange={e=>setLang(e.target.value)}>{Object.entries(LANGS).map(([k,v])=><option key={k} value={k} style={oS}>{v}</option>)}</select>
        <select style={S.sel} value={cur} onChange={e=>setCur(e.target.value)}>{Object.entries(CURRENCIES).map(([k,v])=><option key={k} value={k} style={oS}>{v.label}</option>)}</select>
        <button style={S.cartBtn} onClick={()=>setStep("cart")}>🛒 {cartCount>0&&<span style={S.badge}>{cartCount}</span>}</button>
      </div>
    </div>
    {showSearch&&<SearchOverlay/>}
    {!["brand","invoice"].includes(step)&&<div style={S.bc}><button style={S.bcL} onClick={goHome}>{t.brands}</button>{brand&&<><span style={{color:"#ccc"}}>›</span>{step==="category"?<span style={{fontWeight:600,color:"#1d1d1f"}}>{brand}</span>:<button style={S.bcL} onClick={()=>{setStep("category");setCat(null);setSelMod(null);reset();}}>{brand}</button>}</>}{cat&&<><span style={{color:"#ccc"}}>›</span>{step==="model"?<span style={{fontWeight:600,color:"#1d1d1f"}}>{cat}</span>:<button style={S.bcL} onClick={()=>{setStep("model");setSelMod(null);reset();}}>{cat}</button>}</>}{selMod&&step==="configure"&&<><span style={{color:"#ccc"}}>›</span><span style={{fontWeight:600,color:"#1d1d1f"}}>{selMod}</span></>}</div>}
    {step==="brand"&&<BrandV/>}{step==="category"&&<CatV/>}{step==="model"&&<ModV/>}{step==="configure"&&<CfgV/>}{step==="cart"&&<CartV/>}{step==="invoice"&&<InvV/>}
  </div>);
}