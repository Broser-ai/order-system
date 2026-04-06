/* ═══════════════════════════════════════════════════════════════
   GoOrder — Komplet B2B Bestillingssystem  v2.0
   ═══════════════════════════════════════════════════════════════ */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/* ── Supabase ── */
const SB_URL = 'https://jesskkrtdcrjkhqbvwqo.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implc3Nra3J0ZGNyamtocWJ2d3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyOTgyMjAsImV4cCI6MjA5MDg3NDIyMH0.BtJMQ5NOY6oL0HqaSweLtAZZoD0YHWmUTyV_XWK0CDw';
const sb = createClient(SB_URL, SB_KEY);

/* ── PayPal ── */
const PP_CLIENT = 'AWNe2YsLSrlWLWWxPTk4rHiyMPxdbMrLhJGUpzy9gu3Z7esEfhxFaAV6WAonnZxYPRFtkBOStXqbl76Z';

/* ── Stripe ── */
const STRIPE_PK = 'pk_live_51TIqr06NFoDjdMVn30sJKO7tC1CdNgaR1v4VlkKyAZbRUUw5EGcgF1N1lCHJtyKx2Lr0tuY9ZLGRo5HBS8Op0jtt00lXOKFO2q';

/* ── Contact ── */
const CONTACT_EMAIL = 'ma@goorder.dk';

/* ── Currencies ── */
const CURRENCIES = {
  DKK: { symbol: 'kr', rate: 1, code: 'DKK', decimals: 2 },
  EUR: { symbol: '€', rate: 0.134, code: 'EUR', decimals: 2 },
  USD: { symbol: '$', rate: 0.145, code: 'USD', decimals: 2 },
  INR: { symbol: '₹', rate: 12.1, code: 'INR', decimals: 0 },
  CNY: { symbol: '¥', rate: 1.05, code: 'CNY', decimals: 2 },
};

/* ── Translations ── */
const T = {
  da: {
    appName:'GoOrder', login:'Log ind', logout:'Log ud', username:'Brugernavn', password:'Adgangskode',
    dashboard:'Dashboard', orders:'Ordrer', newOrder:'Ny ordre', products:'Produkter', customers:'Kunder',
    invoices:'Fakturaer', creditNotes:'Kreditnotaer', reports:'Rapporter', settings:'Indstillinger', profile:'Profil',
    myOrders:'Mine ordrer', search:'Søg...', save:'Gem', cancel:'Annuller', delete:'Slet', edit:'Rediger',
    add:'Tilføj', close:'Luk', confirm:'Bekræft', total:'Total', subtotal:'Subtotal', vat:'Moms', qty:'Antal',
    price:'Pris', status:'Status', date:'Dato', actions:'Handlinger', name:'Navn', email:'E-mail',
    phone:'Telefon', address:'Adresse', company:'Firma', vatNo:'CVR-nr', city:'By', zip:'Postnr',
    country:'Land', notes:'Noter', deliveryAddr:'Leveringsadresse', billingAddr:'Faktureringsadresse',
    received:'Modtaget', processing:'Behandler', shipped:'Afsendt', delivered:'Leveret', cancelled:'Annulleret',
    proforma:'Proforma', finalInvoice:'Endelig faktura', creditNote:'Kreditnota',
    payNow:'Betal nu', payWithPayPal:'Betal med PayPal', paid:'Betalt', unpaid:'Ubetalt',
    partialDelivery:'Dellevering', deliveryProof:'Leveringsbevis', uploadPhoto:'Upload foto',
    signature:'Signatur', stock:'Lager', inStock:'På lager', lowStock:'Få på lager', outOfStock:'Ikke på lager',
    exportExcel:'Eksporter Excel', exportPDF:'Eksporter PDF', exportCSV:'Eksporter CSV',
    language:'Sprog', currency:'Valuta', orderNo:'Ordrenr', invoiceNo:'Fakturanr',
    from:'Fra', to:'Til', quantity:'Antal', unitPrice:'Enhedspris', lineTotal:'Linjetotal',
    createOrder:'Opret ordre', updateOrder:'Opdater ordre', brand:'Mærke', model:'Model',
    category:'Kategori', totalOrders:'Ordrer i alt', revenue:'Omsætning', avgOrder:'Gns. ordre',
    topProducts:'Top produkter', recentOrders:'Seneste ordrer', noOrders:'Ingen ordrer endnu',
    selectCustomer:'Vælg kunde', addItem:'Tilføj vare', removeItem:'Fjern', orderCreated:'Ordre oprettet!',
    orderUpdated:'Ordre opdateret!', savedOk:'Gemt!', error:'Fejl', tryAgain:'Prøv igen',
    installApp:'Installér app', loginFail:'Forkert brugernavn eller adgangskode',
    deliveredQty:'Leveret antal', remainingQty:'Resterende', generateInvoice:'Generer faktura',
    generateCredit:'Opret kreditnota', reason:'Årsag', amount:'Beløb', allBrands:'Alle mærker',
    allStatuses:'Alle statusser', welcome:'Velkommen', back:'Tilbage', orderDetails:'Ordredetaljer',
    statusHistory:'Statushistorik', emailSent:'Email sendt', noData:'Ingen data',
    period:'Periode', today:'I dag', thisWeek:'Denne uge', thisMonth:'Denne måned', allTime:'Al tid',
    items:'Varer', customer:'Kunde', admin:'Administrator', demo:'Demo', printInvoice:'Print faktura',
    downloadPDF:'Download PDF', tax:'Moms (25%)', grandTotal:'Total inkl. moms',
    signatureCapture:'Signatur-optagelse', clear:'Ryd', done:'Færdig',
    partialShip:'Dellevering', shipQty:'Send antal', markShipped:'Markér afsendt',
    viewOrder:'Se ordre', editProfile:'Rediger profil', changePassword:'Skift adgangskode',
    multiAddr:'Leveringsadresser', addAddress:'Tilføj adresse', primaryAddr:'Primær',
    setPrimary:'Sæt som primær', removeAddr:'Fjern adresse',
    orderSummary:'Ordreoversigt', paymentStatus:'Betalingsstatus', stockLevel:'Lagerniveau',
  },
  en: {
    appName:'GoOrder', login:'Log in', logout:'Log out', username:'Username', password:'Password',
    dashboard:'Dashboard', orders:'Orders', newOrder:'New order', products:'Products', customers:'Customers',
    invoices:'Invoices', creditNotes:'Credit notes', reports:'Reports', settings:'Settings', profile:'Profile',
    myOrders:'My orders', search:'Search...', save:'Save', cancel:'Cancel', delete:'Delete', edit:'Edit',
    add:'Add', close:'Close', confirm:'Confirm', total:'Total', subtotal:'Subtotal', vat:'VAT', qty:'Qty',
    price:'Price', status:'Status', date:'Date', actions:'Actions', name:'Name', email:'Email',
    phone:'Phone', address:'Address', company:'Company', vatNo:'VAT No', city:'City', zip:'Zip',
    country:'Country', notes:'Notes', deliveryAddr:'Delivery address', billingAddr:'Billing address',
    received:'Received', processing:'Processing', shipped:'Shipped', delivered:'Delivered', cancelled:'Cancelled',
    proforma:'Proforma', finalInvoice:'Final invoice', creditNote:'Credit note',
    payNow:'Pay now', payWithPayPal:'Pay with PayPal', paid:'Paid', unpaid:'Unpaid',
    partialDelivery:'Partial delivery', deliveryProof:'Delivery proof', uploadPhoto:'Upload photo',
    signature:'Signature', stock:'Stock', inStock:'In stock', lowStock:'Low stock', outOfStock:'Out of stock',
    exportExcel:'Export Excel', exportPDF:'Export PDF', exportCSV:'Export CSV',
    language:'Language', currency:'Currency', orderNo:'Order no', invoiceNo:'Invoice no',
    from:'From', to:'To', quantity:'Quantity', unitPrice:'Unit price', lineTotal:'Line total',
    createOrder:'Create order', updateOrder:'Update order', brand:'Brand', model:'Model',
    category:'Category', totalOrders:'Total orders', revenue:'Revenue', avgOrder:'Avg order',
    topProducts:'Top products', recentOrders:'Recent orders', noOrders:'No orders yet',
    selectCustomer:'Select customer', addItem:'Add item', removeItem:'Remove', orderCreated:'Order created!',
    orderUpdated:'Order updated!', savedOk:'Saved!', error:'Error', tryAgain:'Try again',
    installApp:'Install app', loginFail:'Wrong username or password',
    deliveredQty:'Delivered qty', remainingQty:'Remaining', generateInvoice:'Generate invoice',
    generateCredit:'Create credit note', reason:'Reason', amount:'Amount', allBrands:'All brands',
    allStatuses:'All statuses', welcome:'Welcome', back:'Back', orderDetails:'Order details',
    statusHistory:'Status history', emailSent:'Email sent', noData:'No data',
    period:'Period', today:'Today', thisWeek:'This week', thisMonth:'This month', allTime:'All time',
    items:'Items', customer:'Customer', admin:'Admin', demo:'Demo', printInvoice:'Print invoice',
    downloadPDF:'Download PDF', tax:'Tax (25%)', grandTotal:'Grand total',
    signatureCapture:'Signature capture', clear:'Clear', done:'Done',
    partialShip:'Partial ship', shipQty:'Ship qty', markShipped:'Mark shipped',
    viewOrder:'View order', editProfile:'Edit profile', changePassword:'Change password',
    multiAddr:'Delivery addresses', addAddress:'Add address', primaryAddr:'Primary',
    setPrimary:'Set as primary', removeAddr:'Remove address',
    orderSummary:'Order summary', paymentStatus:'Payment status', stockLevel:'Stock level',
  },
  de: {
    appName:'GoOrder', login:'Anmelden', logout:'Abmelden', username:'Benutzername', password:'Passwort',
    dashboard:'Dashboard', orders:'Bestellungen', newOrder:'Neue Bestellung', products:'Produkte', customers:'Kunden',
    invoices:'Rechnungen', creditNotes:'Gutschriften', reports:'Berichte', settings:'Einstellungen', profile:'Profil',
    myOrders:'Meine Bestellungen', search:'Suchen...', save:'Speichern', cancel:'Abbrechen', delete:'Löschen', edit:'Bearbeiten',
    add:'Hinzufügen', close:'Schließen', confirm:'Bestätigen', total:'Gesamt', subtotal:'Zwischensumme', vat:'MwSt', qty:'Menge',
    price:'Preis', status:'Status', date:'Datum', actions:'Aktionen', name:'Name', email:'E-Mail',
    phone:'Telefon', address:'Adresse', company:'Firma', vatNo:'USt-IdNr', city:'Stadt', zip:'PLZ',
    country:'Land', notes:'Notizen', deliveryAddr:'Lieferadresse', billingAddr:'Rechnungsadresse',
    received:'Empfangen', processing:'In Bearbeitung', shipped:'Versandt', delivered:'Geliefert', cancelled:'Storniert',
    proforma:'Proforma', finalInvoice:'Endrechnung', creditNote:'Gutschrift',
    payNow:'Jetzt bezahlen', payWithPayPal:'Mit PayPal bezahlen', paid:'Bezahlt', unpaid:'Unbezahlt',
    partialDelivery:'Teillieferung', deliveryProof:'Liefernachweis', uploadPhoto:'Foto hochladen',
    signature:'Unterschrift', stock:'Lager', inStock:'Auf Lager', lowStock:'Wenig Lager', outOfStock:'Nicht vorrätig',
    exportExcel:'Excel exportieren', exportPDF:'PDF exportieren', exportCSV:'CSV exportieren',
    language:'Sprache', currency:'Währung', orderNo:'Bestell-Nr', invoiceNo:'Rechnungs-Nr',
    from:'Von', to:'Bis', quantity:'Menge', unitPrice:'Stückpreis', lineTotal:'Zeilensumme',
    createOrder:'Bestellung erstellen', updateOrder:'Bestellung aktualisieren', brand:'Marke', model:'Modell',
    category:'Kategorie', totalOrders:'Bestellungen gesamt', revenue:'Umsatz', avgOrder:'Ø Bestellung',
    topProducts:'Top Produkte', recentOrders:'Letzte Bestellungen', noOrders:'Noch keine Bestellungen',
    selectCustomer:'Kunde wählen', addItem:'Artikel hinzufügen', removeItem:'Entfernen', orderCreated:'Bestellung erstellt!',
    orderUpdated:'Bestellung aktualisiert!', savedOk:'Gespeichert!', error:'Fehler', tryAgain:'Erneut versuchen',
    installApp:'App installieren', loginFail:'Falscher Benutzername oder Passwort',
    deliveredQty:'Gelieferte Menge', remainingQty:'Verbleibend', generateInvoice:'Rechnung erstellen',
    generateCredit:'Gutschrift erstellen', reason:'Grund', amount:'Betrag', allBrands:'Alle Marken',
    allStatuses:'Alle Status', welcome:'Willkommen', back:'Zurück', orderDetails:'Bestelldetails',
    statusHistory:'Statusverlauf', emailSent:'E-Mail gesendet', noData:'Keine Daten',
    period:'Zeitraum', today:'Heute', thisWeek:'Diese Woche', thisMonth:'Diesen Monat', allTime:'Gesamt',
    items:'Artikel', customer:'Kunde', admin:'Administrator', demo:'Demo', printInvoice:'Rechnung drucken',
    downloadPDF:'PDF herunterladen', tax:'MwSt (25%)', grandTotal:'Gesamtbetrag',
    signatureCapture:'Unterschrift erfassen', clear:'Löschen', done:'Fertig',
    partialShip:'Teillieferung', shipQty:'Versandmenge', markShipped:'Als versandt markieren',
    viewOrder:'Bestellung anzeigen', editProfile:'Profil bearbeiten', changePassword:'Passwort ändern',
    multiAddr:'Lieferadressen', addAddress:'Adresse hinzufügen', primaryAddr:'Primär',
    setPrimary:'Als primär setzen', removeAddr:'Adresse entfernen',
    orderSummary:'Bestellübersicht', paymentStatus:'Zahlungsstatus', stockLevel:'Lagerbestand',
  },
  hi: {
    appName:'GoOrder', login:'लॉग इन', logout:'लॉग आउट', username:'उपयोगकर्ता नाम', password:'पासवर्ड',
    dashboard:'डैशबोर्ड', orders:'ऑर्डर', newOrder:'नया ऑर्डर', products:'उत्पाद', customers:'ग्राहक',
    invoices:'चालान', creditNotes:'क्रेडिट नोट', reports:'रिपोर्ट', settings:'सेटिंग्स', profile:'प्रोफ़ाइल',
    myOrders:'मेरे ऑर्डर', search:'खोजें...', save:'सहेजें', cancel:'रद्द करें', delete:'हटाएं', edit:'संपादित करें',
    add:'जोड़ें', close:'बंद करें', confirm:'पुष्टि करें', total:'कुल', subtotal:'उप-कुल', vat:'वैट', qty:'मात्रा',
    price:'कीमत', status:'स्थिति', date:'तारीख', actions:'कार्रवाई', name:'नाम', email:'ईमेल',
    phone:'फ़ोन', address:'पता', company:'कंपनी', vatNo:'वैट नंबर', city:'शहर', zip:'पिन कोड',
    country:'देश', notes:'नोट्स', deliveryAddr:'डिलीवरी का पता', billingAddr:'बिलिंग का पता',
    received:'प्राप्त', processing:'प्रक्रिया में', shipped:'भेजा गया', delivered:'डिलीवर किया', cancelled:'रद्द',
    proforma:'प्रोफ़ॉर्मा', finalInvoice:'अंतिम चालान', creditNote:'क्रेडिट नोट',
    payNow:'अभी भुगतान करें', payWithPayPal:'PayPal से भुगतान', paid:'भुगतान किया', unpaid:'अवैतनिक',
    partialDelivery:'आंशिक डिलीवरी', deliveryProof:'डिलीवरी प्रमाण', uploadPhoto:'फोटो अपलोड',
    signature:'हस्ताक्षर', stock:'स्टॉक', inStock:'स्टॉक में', lowStock:'कम स्टॉक', outOfStock:'स्टॉक में नहीं',
    exportExcel:'Excel निर्यात', exportPDF:'PDF निर्यात', exportCSV:'CSV निर्यात',
    language:'भाषा', currency:'मुद्रा', orderNo:'ऑर्डर नं', invoiceNo:'चालान नं',
    from:'से', to:'तक', quantity:'मात्रा', unitPrice:'इकाई मूल्य', lineTotal:'कुल',
    createOrder:'ऑर्डर बनाएं', updateOrder:'ऑर्डर अपडेट', brand:'ब्रांड', model:'मॉडल',
    category:'श्रेणी', totalOrders:'कुल ऑर्डर', revenue:'राजस्व', avgOrder:'औसत ऑर्डर',
    topProducts:'शीर्ष उत्पाद', recentOrders:'हाल के ऑर्डर', noOrders:'कोई ऑर्डर नहीं',
    selectCustomer:'ग्राहक चुनें', addItem:'आइटम जोड़ें', removeItem:'हटाएं', orderCreated:'ऑर्डर बनाया!',
    orderUpdated:'ऑर्डर अपडेट किया!', savedOk:'सहेजा!', error:'त्रुटि', tryAgain:'फिर कोशिश करें',
    installApp:'ऐप इंस्टॉल', loginFail:'गलत उपयोगकर्ता नाम या पासवर्ड',
    deliveredQty:'डिलीवर मात्रा', remainingQty:'शेष', generateInvoice:'चालान बनाएं',
    generateCredit:'क्रेडिट नोट बनाएं', reason:'कारण', amount:'राशि', allBrands:'सभी ब्रांड',
    allStatuses:'सभी स्थितियां', welcome:'स्वागत', back:'वापस', orderDetails:'ऑर्डर विवरण',
    statusHistory:'स्थिति इतिहास', emailSent:'ईमेल भेजा', noData:'कोई डेटा नहीं',
    period:'अवधि', today:'आज', thisWeek:'इस सप्ताह', thisMonth:'इस महीने', allTime:'सभी समय',
    items:'आइटम', customer:'ग्राहक', admin:'व्यवस्थापक', demo:'डेमो', printInvoice:'चालान प्रिंट',
    downloadPDF:'PDF डाउनलोड', tax:'कर (25%)', grandTotal:'कुल राशि',
    signatureCapture:'हस्ताक्षर', clear:'साफ़', done:'हो गया',
    partialShip:'आंशिक शिपमेंट', shipQty:'शिपमेंट मात्रा', markShipped:'भेजा गया चिह्नित',
    viewOrder:'ऑर्डर देखें', editProfile:'प्रोफ़ाइल संपादित', changePassword:'पासवर्ड बदलें',
    multiAddr:'डिलीवरी पते', addAddress:'पता जोड़ें', primaryAddr:'प्राथमिक',
    setPrimary:'प्राथमिक सेट करें', removeAddr:'पता हटाएं',
    orderSummary:'ऑर्डर सारांश', paymentStatus:'भुगतान स्थिति', stockLevel:'स्टॉक स्तर',
  },
  zh: {
    appName:'GoOrder', login:'登录', logout:'退出', username:'用户名', password:'密码',
    dashboard:'仪表板', orders:'订单', newOrder:'新订单', products:'产品', customers:'客户',
    invoices:'发票', creditNotes:'贷方通知单', reports:'报告', settings:'设置', profile:'个人资料',
    myOrders:'我的订单', search:'搜索...', save:'保存', cancel:'取消', delete:'删除', edit:'编辑',
    add:'添加', close:'关闭', confirm:'确认', total:'合计', subtotal:'小计', vat:'增值税', qty:'数量',
    price:'价格', status:'状态', date:'日期', actions:'操作', name:'姓名', email:'电子邮件',
    phone:'电话', address:'地址', company:'公司', vatNo:'税号', city:'城市', zip:'邮编',
    country:'国家', notes:'备注', deliveryAddr:'送货地址', billingAddr:'账单地址',
    received:'已接收', processing:'处理中', shipped:'已发货', delivered:'已送达', cancelled:'已取消',
    proforma:'形式发票', finalInvoice:'最终发票', creditNote:'贷方通知单',
    payNow:'立即支付', payWithPayPal:'用PayPal支付', paid:'已付', unpaid:'未付',
    partialDelivery:'部分交付', deliveryProof:'交付证明', uploadPhoto:'上传照片',
    signature:'签名', stock:'库存', inStock:'有货', lowStock:'库存不足', outOfStock:'缺货',
    exportExcel:'导出Excel', exportPDF:'导出PDF', exportCSV:'导出CSV',
    language:'语言', currency:'货币', orderNo:'订单号', invoiceNo:'发票号',
    from:'从', to:'至', quantity:'数量', unitPrice:'单价', lineTotal:'行合计',
    createOrder:'创建订单', updateOrder:'更新订单', brand:'品牌', model:'型号',
    category:'类别', totalOrders:'总订单', revenue:'收入', avgOrder:'平均订单',
    topProducts:'热门产品', recentOrders:'最近订单', noOrders:'暂无订单',
    selectCustomer:'选择客户', addItem:'添加商品', removeItem:'移除', orderCreated:'订单已创建!',
    orderUpdated:'订单已更新!', savedOk:'已保存!', error:'错误', tryAgain:'重试',
    installApp:'安装应用', loginFail:'用户名或密码错误',
    deliveredQty:'已交付数量', remainingQty:'剩余', generateInvoice:'生成发票',
    generateCredit:'创建贷方通知', reason:'原因', amount:'金额', allBrands:'所有品牌',
    allStatuses:'所有状态', welcome:'欢迎', back:'返回', orderDetails:'订单详情',
    statusHistory:'状态历史', emailSent:'邮件已发送', noData:'无数据',
    period:'时期', today:'今天', thisWeek:'本周', thisMonth:'本月', allTime:'全部',
    items:'商品', customer:'客户', admin:'管理员', demo:'演示', printInvoice:'打印发票',
    downloadPDF:'下载PDF', tax:'税 (25%)', grandTotal:'总计',
    signatureCapture:'签名采集', clear:'清除', done:'完成',
    partialShip:'部分发货', shipQty:'发货数量', markShipped:'标记已发货',
    viewOrder:'查看订单', editProfile:'编辑资料', changePassword:'更改密码',
    multiAddr:'送货地址', addAddress:'添加地址', primaryAddr:'主要',
    setPrimary:'设为主要', removeAddr:'移除地址',
    orderSummary:'订单摘要', paymentStatus:'支付状态', stockLevel:'库存水平',
  },
};

const LANG_LABELS = { da:'Dansk', en:'English', de:'Deutsch', hi:'हिन्दी', zh:'中文' };

/* ── Product Catalog med Step-by-Step Konfigurator ── */
const PRODUCTS = [
  { id:'ipiphone17',brand:'Apple',cat:'iPhone',model:'iPhone 17 Pro Max',price:14499,stock:30,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'256GB'},{v:'512GB',add:1500},{v:'1TB',add:4500}]},{k:'color',l:'Farve',ch:[{v:'Natural Titanium'},{v:'Black Titanium'},{v:'White Titanium'},{v:'Desert Titanium'}]}] },
  { id:'ipiphone17',brand:'Apple',cat:'iPhone',model:'iPhone 17 Pro',price:12499,stock:30,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'256GB'},{v:'512GB',add:1500},{v:'1TB',add:4500}]},{k:'color',l:'Farve',ch:[{v:'Natural Titanium'},{v:'Black Titanium'},{v:'White Titanium'},{v:'Desert Titanium'}]}] },
  { id:'ipiphone17',brand:'Apple',cat:'iPhone',model:'iPhone 17',price:8999,stock:30,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'128GB'},{v:'256GB',add:800},{v:'512GB',add:2500}]},{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Grøn'},{v:'Blå'},{v:'Pink'}]}] },
  { id:'ipiphone17',brand:'Apple',cat:'iPhone',model:'iPhone 17 Air',price:9499,stock:30,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'128GB'},{v:'256GB',add:800},{v:'512GB',add:2500}]},{k:'color',l:'Farve',ch:[{v:'Starlight'},{v:'Midnight'},{v:'Sky Blue'},{v:'Green'}]}] },
  { id:'ipiphone17',brand:'Apple',cat:'iPhone',model:'iPhone 17e',price:4999,stock:30,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'128GB'},{v:'256GB',add:800}]},{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'},{v:'Rød'}]}] },
  { id:'ipiphone16',brand:'Apple',cat:'iPhone',model:'iPhone 16 Pro Max',price:13499,stock:30,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'256GB'},{v:'512GB',add:1500},{v:'1TB',add:4500}]},{k:'color',l:'Farve',ch:[{v:'Natural Titanium'},{v:'Black Titanium'},{v:'White Titanium'},{v:'Desert Titanium'}]}] },
  { id:'ipiphone16',brand:'Apple',cat:'iPhone',model:'iPhone 16 Pro',price:11499,stock:30,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'256GB'},{v:'512GB',add:1500},{v:'1TB',add:4500}]},{k:'color',l:'Farve',ch:[{v:'Natural Titanium'},{v:'Black Titanium'},{v:'White Titanium'},{v:'Desert Titanium'}]}] },
  { id:'ipiphone16',brand:'Apple',cat:'iPhone',model:'iPhone 16',price:8499,stock:30,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'128GB'},{v:'256GB',add:800},{v:'512GB',add:2500}]},{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Grøn'},{v:'Blå'},{v:'Pink'}]}] },
  { id:'ipiphone16',brand:'Apple',cat:'iPhone',model:'iPhone 16 Plus',price:9499,stock:30,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'128GB'},{v:'256GB',add:800},{v:'512GB',add:2500}]},{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Grøn'},{v:'Blå'},{v:'Pink'}]}] },
  { id:'ipiphone16',brand:'Apple',cat:'iPhone',model:'iPhone 16e',price:4499,stock:30,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'128GB'},{v:'256GB',add:800}]},{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'},{v:'Rød'}]}] },
  { id:'ipadprom51',brand:'Apple',cat:'iPad',model:'iPad Pro M5 13"',price:13999,stock:22,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'256GB'},{v:'512GB',add:1500},{v:'1TB',add:3500},{v:'2TB',add:5500}]},{k:'connectivity',l:'Forbindelse',ch:[{v:'WiFi'},{v:'WiFi + Cellular',add:1200}]},{k:'color',l:'Farve',ch:[{v:'Space Black'},{v:'Silver'}]}] },
  { id:'ipadprom51',brand:'Apple',cat:'iPad',model:'iPad Pro M5 11"',price:10999,stock:22,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'256GB'},{v:'512GB',add:1500},{v:'1TB',add:3500},{v:'2TB',add:5500}]},{k:'connectivity',l:'Forbindelse',ch:[{v:'WiFi'},{v:'WiFi + Cellular',add:1200}]},{k:'color',l:'Farve',ch:[{v:'Space Black'},{v:'Silver'}]}] },
  { id:'ipadprom41',brand:'Apple',cat:'iPad',model:'iPad Pro M4 13" OLED',price:12999,stock:22,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'256GB'},{v:'512GB',add:1500},{v:'1TB',add:3500},{v:'2TB',add:5500}]},{k:'connectivity',l:'Forbindelse',ch:[{v:'WiFi'},{v:'WiFi + Cellular',add:1200}]},{k:'color',l:'Farve',ch:[{v:'Space Black'},{v:'Silver'}]}] },
  { id:'ipadprom41',brand:'Apple',cat:'iPad',model:'iPad Pro M4 11" OLED',price:9999,stock:22,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'256GB'},{v:'512GB',add:1500},{v:'1TB',add:3500},{v:'2TB',add:5500}]},{k:'connectivity',l:'Forbindelse',ch:[{v:'WiFi'},{v:'WiFi + Cellular',add:1200}]},{k:'color',l:'Farve',ch:[{v:'Space Black'},{v:'Silver'}]}] },
  { id:'ipadairm41',brand:'Apple',cat:'iPad',model:'iPad Air M4 13"',price:8499,stock:22,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'128GB'},{v:'256GB',add:800},{v:'512GB',add:2000},{v:'1TB',add:3500}]},{k:'connectivity',l:'Forbindelse',ch:[{v:'WiFi'},{v:'WiFi + Cellular',add:1200}]},{k:'color',l:'Farve',ch:[{v:'Space Grey'},{v:'Starlight'},{v:'Blue'},{v:'Purple'}]}] },
  { id:'ipadairm41',brand:'Apple',cat:'iPad',model:'iPad Air M4 11"',price:6499,stock:22,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'128GB'},{v:'256GB',add:800},{v:'512GB',add:2000},{v:'1TB',add:3500}]},{k:'connectivity',l:'Forbindelse',ch:[{v:'WiFi'},{v:'WiFi + Cellular',add:1200}]},{k:'color',l:'Farve',ch:[{v:'Space Grey'},{v:'Starlight'},{v:'Blue'},{v:'Purple'}]}] },
  { id:'ipad11gen',brand:'Apple',cat:'iPad',model:'iPad 11. gen',price:3499,stock:22,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'64GB'},{v:'256GB',add:1000}]},{k:'connectivity',l:'Forbindelse',ch:[{v:'WiFi'},{v:'WiFi + Cellular',add:1200}]},{k:'color',l:'Farve',ch:[{v:'Silver'},{v:'Blue'},{v:'Pink'},{v:'Yellow'}]}] },
  { id:'ipad10gen',brand:'Apple',cat:'iPad',model:'iPad 10. gen',price:2999,stock:22,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'64GB'},{v:'256GB',add:1000}]},{k:'connectivity',l:'Forbindelse',ch:[{v:'WiFi'},{v:'WiFi + Cellular',add:1200}]},{k:'color',l:'Farve',ch:[{v:'Silver'},{v:'Blue'},{v:'Pink'},{v:'Yellow'}]}] },
  { id:'ipadmini7',brand:'Apple',cat:'iPad',model:'iPad mini 7',price:5499,stock:22,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'128GB'},{v:'256GB',add:800},{v:'512GB',add:2500}]},{k:'connectivity',l:'Forbindelse',ch:[{v:'WiFi'},{v:'WiFi + Cellular',add:1200}]},{k:'color',l:'Farve',ch:[{v:'Space Grey'},{v:'Starlight'},{v:'Blue'},{v:'Purple'}]}] },
  { id:'macbookpro16',brand:'Apple',cat:'MacBook',model:'MacBook Pro 16" M5 Max',price:34999,stock:15,steps:[{k:'ram',l:'RAM',ch:[{v:'36GB'},{v:'48GB',add:3000},{v:'64GB',add:6000}]},{k:'storage',l:'Lagerplads',ch:[{v:'1TB'},{v:'2TB',add:4500},{v:'4TB',add:9000}]},{k:'color',l:'Farve',ch:[{v:'Space Black'},{v:'Silver'}]}] },
  { id:'macbookpro16',brand:'Apple',cat:'MacBook',model:'MacBook Pro 16" M5 Pro',price:23999,stock:15,steps:[{k:'ram',l:'RAM',ch:[{v:'18GB'},{v:'36GB',add:3000}]},{k:'storage',l:'Lagerplads',ch:[{v:'512GB'},{v:'1TB',add:2000},{v:'2TB',add:4500}]},{k:'color',l:'Farve',ch:[{v:'Space Black'},{v:'Silver'}]}] },
  { id:'macbookpro14',brand:'Apple',cat:'MacBook',model:'MacBook Pro 14" M5 Pro',price:19999,stock:15,steps:[{k:'ram',l:'RAM',ch:[{v:'18GB'},{v:'36GB',add:3000}]},{k:'storage',l:'Lagerplads',ch:[{v:'512GB'},{v:'1TB',add:2000},{v:'2TB',add:4500}]},{k:'color',l:'Farve',ch:[{v:'Space Black'},{v:'Silver'}]}] },
  { id:'macbookpro14',brand:'Apple',cat:'MacBook',model:'MacBook Pro 14" M5',price:14999,stock:15,steps:[{k:'ram',l:'RAM',ch:[{v:'16GB'},{v:'24GB',add:1500}]},{k:'storage',l:'Lagerplads',ch:[{v:'512GB'},{v:'1TB',add:2000}]},{k:'color',l:'Farve',ch:[{v:'Space Black'},{v:'Silver'}]}] },
  { id:'macbookpro16',brand:'Apple',cat:'MacBook',model:'MacBook Pro 16" M4 Max',price:32999,stock:15,steps:[{k:'ram',l:'RAM',ch:[{v:'36GB'},{v:'48GB',add:2000},{v:'64GB',add:5000}]},{k:'storage',l:'Lagerplads',ch:[{v:'1TB'},{v:'2TB',add:4500},{v:'4TB',add:9000}]},{k:'color',l:'Farve',ch:[{v:'Space Black'},{v:'Silver'}]}] },
  { id:'macbookpro16',brand:'Apple',cat:'MacBook',model:'MacBook Pro 16" M4 Pro',price:22999,stock:15,steps:[{k:'ram',l:'RAM',ch:[{v:'24GB'},{v:'48GB',add:3000}]},{k:'storage',l:'Lagerplads',ch:[{v:'512GB'},{v:'1TB',add:2000},{v:'2TB',add:4500}]},{k:'color',l:'Farve',ch:[{v:'Space Black'},{v:'Silver'}]}] },
  { id:'macbookpro14',brand:'Apple',cat:'MacBook',model:'MacBook Pro 14" M4 Pro',price:18999,stock:15,steps:[{k:'ram',l:'RAM',ch:[{v:'24GB'},{v:'48GB',add:3000}]},{k:'storage',l:'Lagerplads',ch:[{v:'512GB'},{v:'1TB',add:2000},{v:'2TB',add:4500}]},{k:'color',l:'Farve',ch:[{v:'Space Black'},{v:'Silver'}]}] },
  { id:'macbookpro14',brand:'Apple',cat:'MacBook',model:'MacBook Pro 14" M4',price:13999,stock:15,steps:[{k:'ram',l:'RAM',ch:[{v:'16GB'},{v:'24GB',add:1500}]},{k:'storage',l:'Lagerplads',ch:[{v:'512GB'},{v:'1TB',add:2000}]},{k:'color',l:'Farve',ch:[{v:'Space Black'},{v:'Silver'}]}] },
  { id:'macbookair15',brand:'Apple',cat:'MacBook',model:'MacBook Air 15" M4',price:12999,stock:15,steps:[{k:'ram',l:'RAM',ch:[{v:'16GB'},{v:'24GB',add:1500}]},{k:'storage',l:'Lagerplads',ch:[{v:'256GB'},{v:'512GB',add:1500},{v:'1TB',add:3000}]},{k:'color',l:'Farve',ch:[{v:'Midnight'},{v:'Starlight'},{v:'Space Grey'},{v:'Silver'}]}] },
  { id:'macbookair13',brand:'Apple',cat:'MacBook',model:'MacBook Air 13" M4',price:10499,stock:15,steps:[{k:'ram',l:'RAM',ch:[{v:'16GB'},{v:'24GB',add:1500}]},{k:'storage',l:'Lagerplads',ch:[{v:'256GB'},{v:'512GB',add:1500},{v:'1TB',add:3000}]},{k:'color',l:'Farve',ch:[{v:'Midnight'},{v:'Starlight'},{v:'Space Grey'},{v:'Silver'}]}] },
  { id:'mbneo',brand:'Apple',cat:'MacBook',model:'MacBook Neo (A18 Pro)',price:4999,stock:40,steps:[{k:'color',l:'Farve',ch:[{v:'Silver'},{v:'Blue'},{v:'Green'},{v:'Pink'},{v:'Orange'},{v:'Yellow'},{v:'Purple'}]}] },
  { id:'imac24',brand:'Apple',cat:'Mac',model:'iMac 24" M4',price:11499,stock:18,steps:[{k:'config',l:'Konfiguration',ch:[{v:'8-core 16GB 256GB'},{v:'10-core 16GB 512GB',add:2000},{v:'10-core 24GB 1TB',add:4500}]},{k:'color',l:'Farve',ch:[{v:'Blue'},{v:'Purple'},{v:'Pink'},{v:'Orange'},{v:'Yellow'},{v:'Green'},{v:'Silver'}]}] },
  { id:'mmini',brand:'Apple',cat:'Mac',model:'Mac mini',price:4999,stock:25,steps:[{k:'config',l:'Konfiguration',ch:[{v:'M4 16GB 256GB'},{v:'M4 16GB 512GB',add:1500},{v:'M4 Pro 24GB 512GB',add:6000},{v:'M4 Pro 24GB 1TB',add:8000}]}] },
  { id:'mstudio',brand:'Apple',cat:'Mac',model:'Mac Studio',price:16999,stock:8,steps:[{k:'config',l:'Konfiguration',ch:[{v:'M4 Max 36GB 512GB'},{v:'M4 Max 36GB 1TB',add:2000},{v:'M3 Ultra 64GB 1TB',add:13000}]}] },
  { id:'awu3',brand:'Apple',cat:'Watch',model:'Apple Watch Ultra 3',price:7499,stock:15,steps:[{k:'band',l:'Rem',ch:[{v:'Orange Alpine Loop'},{v:'Blue Alpine Loop'},{v:'Green Trail Loop'},{v:'Black Trail Loop'}]}] },
  { id:'aws11',brand:'Apple',cat:'Watch',model:'Apple Watch Series 11',price:3699,stock:30,steps:[{k:'size',l:'Størrelse',ch:[{v:'42mm'},{v:'46mm',add:400}]},{k:'connectivity',l:'Forbindelse',ch:[{v:'GPS'},{v:'GPS + Cellular',add:800}]},{k:'color',l:'Kasse',ch:[{v:'Sort'},{v:'Sølv'},{v:'Rose Gold'},{v:'Blå'}]},{k:'band',l:'Rem',ch:[{v:'Sport Band'},{v:'Sport Loop'},{v:'Solo Loop',add:300},{v:'Milanese Loop',add:500}]}] },
  { id:'awse',brand:'Apple',cat:'Watch',model:'Apple Watch SE (2025)',price:2299,stock:40,steps:[{k:'size',l:'Størrelse',ch:[{v:'40mm'},{v:'44mm',add:300}]},{k:'connectivity',l:'Forbindelse',ch:[{v:'GPS'},{v:'GPS + Cellular',add:800}]},{k:'color',l:'Kasse',ch:[{v:'Sort'},{v:'Sølv'},{v:'Rose Gold'},{v:'Blå'}]}] },
  { id:'awu2',brand:'Apple',cat:'Watch',model:'Apple Watch Ultra 2',price:6499,stock:12,steps:[{k:'band',l:'Rem',ch:[{v:'Orange Alpine Loop'},{v:'Blue Alpine Loop'},{v:'Green Trail Loop'},{v:'Black Trail Loop'}]}] },
  { id:'aws10',brand:'Apple',cat:'Watch',model:'Apple Watch Series 10',price:3299,stock:25,steps:[{k:'size',l:'Størrelse',ch:[{v:'42mm'},{v:'46mm',add:400}]},{k:'connectivity',l:'Forbindelse',ch:[{v:'GPS'},{v:'GPS + Cellular',add:800}]},{k:'color',l:'Kasse',ch:[{v:'Sort'},{v:'Sølv'},{v:'Rose Gold'},{v:'Blå'}]},{k:'band',l:'Rem',ch:[{v:'Sport Band'},{v:'Sport Loop'},{v:'Solo Loop',add:300},{v:'Milanese Loop',add:500}]}] },
  { id:'apm2',brand:'Apple',cat:'AirPods',model:'AirPods Max 2 (H2)',price:4999,stock:12,steps:[{k:'color',l:'Farve',ch:[{v:'Midnight'},{v:'Starlight'},{v:'Blue'},{v:'Orange'},{v:'Purple'}]}] },
  { id:'apm1',brand:'Apple',cat:'AirPods',model:'AirPods Max (USB-C)',price:4299,stock:15,steps:[{k:'color',l:'Farve',ch:[{v:'Midnight'},{v:'Starlight'},{v:'Blue'},{v:'Orange'},{v:'Purple'}]}] },
  { id:'app3',brand:'Apple',cat:'AirPods',model:'AirPods Pro 3',price:2199,stock:48 },
  { id:'ap4a',brand:'Apple',cat:'AirPods',model:'AirPods 4 (ANC)',price:1799,stock:65 },
  { id:'ap4',brand:'Apple',cat:'AirPods',model:'AirPods 4',price:1299,stock:72 },
  { id:'avp',brand:'Apple',cat:'Vision',model:'Apple Vision Pro',price:29999,stock:3,steps:[{k:'storage',l:'Lagerplads',ch:[{v:'256GB'},{v:'512GB',add:1500},{v:'1TB',add:4000}]}] },
  { id:'atv',brand:'Apple',cat:'Accessories',model:'Apple TV 4K (3. gen)',price:1199,stock:40 },
  { id:'hpmin',brand:'Apple',cat:'Accessories',model:'HomePod mini',price:799,stock:45,steps:[{k:'color',l:'Farve',ch:[{v:'Midnight'},{v:'Starlight'},{v:'Blue'},{v:'Orange'},{v:'Yellow'}]}] },
  { id:'hp2',brand:'Apple',cat:'Accessories',model:'HomePod (2. gen)',price:2499,stock:18 },
  { id:'at2',brand:'Apple',cat:'Accessories',model:'AirTag 2',price:299,stock:80,steps:[{k:'config',l:'Pakke',ch:[{v:'1-pak'},{v:'4-pak',add:520}]}] },
  { id:'apcpro',brand:'Apple',cat:'Accessories',model:'Apple Pencil Pro',price:1099,stock:40 },
  { id:'apcuc',brand:'Apple',cat:'Accessories',model:'Apple Pencil (USB-C)',price:649,stock:50 },
  { id:'amk',brand:'Apple',cat:'Accessories',model:'Magic Keyboard',price:899,stock:30,steps:[{k:'config',l:'Model',ch:[{v:'Standard'},{v:'Touch ID',add:400},{v:'Touch ID+Numpad',add:700}]},{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'}]}] },
  { id:'amt',brand:'Apple',cat:'Accessories',model:'Magic Trackpad',price:1099,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'}]}] },
  { id:'amm',brand:'Apple',cat:'Accessories',model:'Magic Mouse',price:699,stock:30,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'}]}] },
  { id:'ams25',brand:'Apple',cat:'Accessories',model:'MagSafe Charger 25W',price:349,stock:60 },
  { id:'asd',brand:'Apple',cat:'Accessories',model:'Studio Display',price:12999,stock:6,steps:[{k:'config',l:'Glas',ch:[{v:'Standard'},{v:'Nano-texture',add:1500}]}] },
  { id:'jtm3',brand:'JBL',cat:'Headphones',model:'JBL Tour One M3',price:2799,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'}]}] },
  { id:'jtm2',brand:'JBL',cat:'Headphones',model:'JBL Tour One M2',price:2499,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'}]}] },
  { id:'jl77',brand:'JBL',cat:'Headphones',model:'JBL Live 770NC',price:1499,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'}]}] },
  { id:'jl67',brand:'JBL',cat:'Headphones',model:'JBL Live 670NC',price:999,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'}]}] },
  { id:'jt77',brand:'JBL',cat:'Headphones',model:'JBL Tune 770NC',price:999,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'}]}] },
  { id:'jt72',brand:'JBL',cat:'Headphones',model:'JBL Tune 720BT',price:599,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'}]}] },
  { id:'jt67',brand:'JBL',cat:'Headphones',model:'JBL Tune 670NC',price:749,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'}]}] },
  { id:'jt52',brand:'JBL',cat:'Headphones',model:'JBL Tune 520BT',price:399,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'}]}] },
  { id:'jt52c',brand:'JBL',cat:'Headphones',model:'JBL Tune 520C (Wired)',price:299,stock:35 },
  { id:'jj47',brand:'JBL',cat:'Headphones',model:'JBL Junior 470NC',price:499,stock:30,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'},{v:'Rød'}]}] },
  { id:'jj32',brand:'JBL',cat:'Headphones',model:'JBL Junior 320BT',price:349,stock:30,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'},{v:'Rød'}]}] },
  { id:'jtp3',brand:'JBL',cat:'Earbuds',model:'JBL Tour Pro 3',price:1899,stock:20,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'},{v:'Lilla'}]}] },
  { id:'jlb3',brand:'JBL',cat:'Earbuds',model:'JBL Live Buds 3',price:1499,stock:20,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'},{v:'Lilla'}]}] },
  { id:'jlm3',brand:'JBL',cat:'Earbuds',model:'JBL Live Beam 3',price:1299,stock:20,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'},{v:'Lilla'}]}] },
  { id:'jtb2',brand:'JBL',cat:'Earbuds',model:'JBL Tune Buds 2',price:749,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Turkis'}]}] },
  { id:'jtm2e',brand:'JBL',cat:'Earbuds',model:'JBL Tune Beam 2',price:699,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Turkis'}]}] },
  { id:'jtf2',brand:'JBL',cat:'Earbuds',model:'JBL Tune Flex 2',price:649,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Turkis'}]}] },
  { id:'jvb2',brand:'JBL',cat:'Earbuds',model:'JBL Vibe Buds 2',price:499,stock:30,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'},{v:'Lilla'},{v:'Pink'}]}] },
  { id:'jvm2',brand:'JBL',cat:'Earbuds',model:'JBL Vibe Beam 2',price:449,stock:30,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'},{v:'Lilla'},{v:'Pink'}]}] },
  { id:'jvf2',brand:'JBL',cat:'Earbuds',model:'JBL Vibe Flex 2',price:399,stock:30,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'},{v:'Lilla'},{v:'Pink'}]}] },
  { id:'jv20',brand:'JBL',cat:'Earbuds',model:'JBL Vibe 200TWS',price:349,stock:40,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Blå'},{v:'Lilla'}]}] },
  { id:'jer2',brand:'JBL',cat:'Earbuds',model:'JBL Endurance Race 2',price:599,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Lilla'}]}] },
  { id:'jep3',brand:'JBL',cat:'Earbuds',model:'JBL Endurance Peak 3',price:699,stock:22,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'},{v:'Lilla'}]}] },
  { id:'jbm3',brand:'JBL',cat:'Speakers',model:'JBL Boombox 3',price:3999,stock:8,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Blå'},{v:'Rød'},{v:'Camo'}]}] },
  { id:'jxt4',brand:'JBL',cat:'Speakers',model:'JBL Xtreme 4',price:2499,stock:12,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Blå'},{v:'Rød'},{v:'Pink'},{v:'Hvid'},{v:'Grøn'}]}] },
  { id:'jch6',brand:'JBL',cat:'Speakers',model:'JBL Charge 6',price:1599,stock:20,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Blå'},{v:'Rød'},{v:'Pink'},{v:'Hvid'},{v:'Grøn'}]}] },
  { id:'jch5',brand:'JBL',cat:'Speakers',model:'JBL Charge 5 WiFi',price:1499,stock:15,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Blå'},{v:'Rød'},{v:'Camo'}]}] },
  { id:'jfl7',brand:'JBL',cat:'Speakers',model:'JBL Flip 7',price:999,stock:30,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Blå'},{v:'Rød'},{v:'Pink'},{v:'Hvid'},{v:'Grøn'},{v:'Lilla'}]}] },
  { id:'jfl6',brand:'JBL',cat:'Speakers',model:'JBL Flip 6',price:849,stock:25,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Blå'},{v:'Rød'},{v:'Pink'},{v:'Hvid'},{v:'Grøn'},{v:'Lilla'}]}] },
  { id:'jcl5',brand:'JBL',cat:'Speakers',model:'JBL Clip 5',price:499,stock:40,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Blå'},{v:'Rød'},{v:'Pink'},{v:'Hvid'},{v:'Grøn'},{v:'Lilla'},{v:'Orange'}]}] },
  { id:'jgo4',brand:'JBL',cat:'Speakers',model:'JBL Go 4',price:349,stock:50,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Blå'},{v:'Rød'},{v:'Pink'},{v:'Hvid'},{v:'Grøn'},{v:'Lilla'},{v:'Orange'}]}] },
  { id:'jpl5',brand:'JBL',cat:'Speakers',model:'JBL Pulse 5',price:1999,stock:10 },
  { id:'jpbu',brand:'JBL',cat:'PartyBox',model:'JBL PartyBox Ultimate',price:7999,stock:3 },
  { id:'jp520',brand:'JBL',cat:'PartyBox',model:'JBL PartyBox 520',price:5999,stock:5 },
  { id:'jps32',brand:'JBL',cat:'PartyBox',model:'JBL PartyBox Stage 320',price:4499,stock:6 },
  { id:'jpe2',brand:'JBL',cat:'PartyBox',model:'JBL PartyBox Encore 2',price:2999,stock:10 },
  { id:'jpee2',brand:'JBL',cat:'PartyBox',model:'JBL PartyBox Encore Essential 2',price:2249,stock:12 },
  { id:'jpc12',brand:'JBL',cat:'PartyBox',model:'JBL PartyBox Club 120',price:3499,stock:8 },
  { id:'ja300',brand:'JBL',cat:'Home Audio',model:'JBL Authentics 300',price:3499,stock:8 },
  { id:'ja200',brand:'JBL',cat:'Home Audio',model:'JBL Authentics 200',price:2499,stock:12 },
  { id:'jhr3',brand:'JBL',cat:'Home Audio',model:'JBL Horizon 3',price:999,stock:18,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Hvid'}]}] },
  { id:'mmn3',brand:'Marshall',cat:'Headphones',model:'Marshall Monitor III A.N.C.',price:2999,stock:20,steps:[{k:'color',l:'Farve',ch:[{v:'Black & Brass'},{v:'Cream'}]}] },
  { id:'mmj5',brand:'Marshall',cat:'Headphones',model:'Marshall Major V',price:1099,stock:20,steps:[{k:'color',l:'Farve',ch:[{v:'Black & Brass'},{v:'Cream'}]}] },
  { id:'mmj4',brand:'Marshall',cat:'Headphones',model:'Marshall Major IV',price:899,stock:20,steps:[{k:'color',l:'Farve',ch:[{v:'Black & Brass'},{v:'Cream'}]}] },
  { id:'mmot2',brand:'Marshall',cat:'Earbuds',model:'Marshall Motif II A.N.C.',price:1499,stock:22 },
  { id:'mmin4',brand:'Marshall',cat:'Earbuds',model:'Marshall Minor IV',price:899,stock:35 },
  { id:'me3',brand:'Marshall',cat:'Speakers',model:'Marshall Emberton III',price:1299,stock:12,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Cream'},{v:'Brown'}]}] },
  { id:'me2',brand:'Marshall',cat:'Speakers',model:'Marshall Emberton II',price:1099,stock:12,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Cream'},{v:'Brown'}]}] },
  { id:'mw2',brand:'Marshall',cat:'Speakers',model:'Marshall Willen II',price:799,stock:12,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Cream'},{v:'Brown'}]}] },
  { id:'mmd2',brand:'Marshall',cat:'Speakers',model:'Marshall Middleton II',price:2199,stock:12,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Cream'},{v:'Brown'}]}] },
  { id:'mmd1',brand:'Marshall',cat:'Speakers',model:'Marshall Middleton',price:1899,stock:12,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Cream'},{v:'Brown'}]}] },
  { id:'ms2',brand:'Marshall',cat:'Speakers',model:'Marshall Stockwell II',price:1699,stock:12,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Cream'},{v:'Brown'}]}] },
  { id:'mk3',brand:'Marshall',cat:'Speakers',model:'Marshall Kilburn III',price:2999,stock:12,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Cream'},{v:'Brown'}]}] },
  { id:'mtf',brand:'Marshall',cat:'Speakers',model:'Marshall Tufton',price:3999,stock:12,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Cream'},{v:'Brown'}]}] },
  { id:'mwb3',brand:'Marshall',cat:'Home Audio',model:'Marshall Woburn III',price:4499,stock:10,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Cream'},{v:'Brown'}]}] },
  { id:'mst3',brand:'Marshall',cat:'Home Audio',model:'Marshall Stanmore III',price:3499,stock:10,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Cream'},{v:'Brown'}]}] },
  { id:'mac3',brand:'Marshall',cat:'Home Audio',model:'Marshall Acton III',price:2299,stock:10,steps:[{k:'color',l:'Farve',ch:[{v:'Sort'},{v:'Cream'},{v:'Brown'}]}] },
  { id:'mbr7',brand:'Marshall',cat:'Party Speakers',model:'Marshall Bromley 750',price:8999,stock:4 },
  { id:'mbr4',brand:'Marshall',cat:'Party Speakers',model:'Marshall Bromley 450',price:5999,stock:6 },
  { id:'mh12',brand:'Marshall',cat:'Soundbars',model:'Marshall Heston 120',price:6999,stock:5 },
  { id:'mh60',brand:'Marshall',cat:'Soundbars',model:'Marshall Heston 60',price:4499,stock:8 },
];

const BRANDS = [...new Set(PRODUCTS.map(p=>p.brand))];
const STATUS_FLOW = ['received','processing','shipped','delivered'];
const STATUS_COLORS = { received:'badge-info', processing:'badge-warning', shipped:'badge-accent', delivered:'badge-success', cancelled:'badge-danger' };

/* ── Helpers ── */
const fmtMoney = (v, cur) => { const c = CURRENCIES[cur]; return `${c.symbol} ${(v * c.rate).toFixed(c.decimals)}`; };
const fmtDate = d => new Date(d).toLocaleDateString('da-DK', { day:'2-digit', month:'short', year:'numeric' });
const genId = () => crypto.randomUUID().slice(0,8).toUpperCase();
const stockInfo = (s, t) => s > 20 ? { cls:'stock-high', label: t.inStock } : s > 0 ? { cls: s > 5 ? 'stock-medium' : 'stock-low', label: t.lowStock +' ('+s+')' } : { cls:'stock-out', label: t.outOfStock };
const getStepAdd = (prod, cfg) => { if (!prod?.steps || !cfg) return 0; return (prod.steps||[]).reduce((sum, st) => { const ch = st.ch.find(c => c.v === cfg[st.k]); return sum + (ch?.add || 0); }, 0); };
const getConfigPrice = (prod, cfg) => (prod?.price || 0) + getStepAdd(prod, cfg);
const fmtConfig = (cfg) => cfg ? Object.values(cfg).filter(Boolean).join(' · ') : '';

/* ── SVG Icons (inline) ── */
const IC = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  orders: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3H8l-4 8h16l-4-8z"/><path d="M4 11v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><line x1="12" y1="15" x2="12" y2="15.01"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  invoice: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  credit: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  chart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  profile: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  x: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  back: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  camera: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  products: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
};

/* ═══════════════════════════════════════
   MAIN APP COMPONENT
   ═══════════════════════════════════════ */
export default function App() {
  /* ── ALL hooks at top, before any conditional return ── */
  const [lang, setLang] = useState(() => localStorage.getItem('go_lang') || 'da');
  const [cur, setCur] = useState(() => localStorage.getItem('go_cur') || 'DKK');
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [sideOpen, setSideOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Data
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoicesData, setInvoicesData] = useState([]);
  const [creditNotesData, setCreditNotesData] = useState([]);

  // Form states
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);
  const [orderForm, setOrderForm] = useState({ customerId: '', items: [], notes: '', deliveryAddrIdx: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [reportPeriod, setReportPeriod] = useState('allTime');
  const [showPayPal, setShowPayPal] = useState(null);
  const [creditForm, setCreditForm] = useState({ orderId:'', reason:'', items:[], amount:0 });
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [partialShipModal, setPartialShipModal] = useState(null);
  const [deliveryProofModal, setDeliveryProofModal] = useState(null);
  const signatureRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const t = useMemo(() => T[lang] || T.da, [lang]);

  const isAdmin = useMemo(() => user && (user.role === 'admin' || user.role === 'demo'), [user]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let list = orders;
    if (!isAdmin && user) list = list.filter(o => o.customer_id === user.id);
    if (filterStatus) list = list.filter(o => o.status === filterStatus);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(o => o.order_no?.toLowerCase().includes(q) || o.customer_name?.toLowerCase().includes(q));
    }
    return list.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  }, [orders, isAdmin, user, filterStatus, searchTerm]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (filterBrand) list = list.filter(p => p.brand === filterBrand);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => p.model.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
    }
    return list;
  }, [filterBrand, searchTerm]);

  // Dashboard stats
  const stats = useMemo(() => {
    const relevantOrders = isAdmin ? orders : orders.filter(o => o.customer_id === user?.id);
    const total = relevantOrders.length;
    const rev = relevantOrders.reduce((s, o) => s + (o.total || 0), 0);
    return { total, revenue: rev, avg: total ? rev / total : 0 };
  }, [orders, isAdmin, user]);

  // PWA install
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Persist lang/cur
  useEffect(() => { localStorage.setItem('go_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('go_cur', cur); }, [cur]);

  // Load data when user logs in
  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const { data: ordersD } = await sb.from('orders').select('*').order('created_at', { ascending: false });
      if (ordersD) setOrders(ordersD);
      const { data: usersD } = await sb.from('users').select('*');
      if (usersD) setCustomers(usersD);
      const { data: invD } = await sb.from('invoices').select('*').order('created_at', { ascending: false });
      if (invD) setInvoicesData(invD);
    } catch (e) { console.error(e); }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  // Toast helper
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Login
  const handleLogin = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await sb.from('users').select('*').eq('username', loginForm.username).eq('password', loginForm.password).single();
      if (error || !data) { showToast(t.loginFail, 'error'); setLoading(false); return; }
      // Infer role if not in DB
      if (!data.role) {
        if (data.username === 'admin') data.role = 'admin';
        else if (data.username === 'demo') data.role = 'demo';
        else data.role = 'customer';
      }
      setUser(data);
      setView('dashboard');
    } catch { showToast(t.error, 'error'); }
    setLoading(false);
  }, [loginForm, showToast, t]);

  // Logout
  const handleLogout = useCallback(() => {
    setUser(null);
    setView('dashboard');
    setOrders([]);
    setLoginForm({ username: '', password: '' });
  }, []);

  // Change order status (triggers email simulation)
  const changeStatus = useCallback(async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const history = order.status_history || [];
    history.push({ status: newStatus, time: new Date().toISOString(), by: user.username });
    const { error } = await sb.from('orders').update({ status: newStatus, status_history: history }).eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, status_history: history } : o));
      showToast(`Status → ${t[newStatus]} ✓`);
      // Simulate email notification
      console.log(`📧 Email sent to ${order.customer_email || 'customer'}: Order ${order.order_no} is now ${newStatus}`);
    }
  }, [orders, user, showToast, t]);

  // Create order
  const createOrder = useCallback(async () => {
    if (!orderForm.customerId || orderForm.items.length === 0) return;
    setLoading(true);
    const cust = customers.find(c => c.id === orderForm.customerId);
    const items = orderForm.items.map(it => {
      const p = PRODUCTS.find(pr => pr.id === it.productId);
      const up = getConfigPrice(p, it.config);
      return { ...it, model: p?.model, brand: p?.brand, config: it.config, configLabel: fmtConfig(it.config), unitPrice: up, total: up * it.qty, delivered_qty: 0 };
    });
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const vatAmt = subtotal * 0.25;
    const orderNo = 'GO-' + genId();
    const newOrder = {
      order_no: orderNo,
      customer_id: orderForm.customerId,
      customer_name: cust?.company || cust?.name || cust?.username,
      customer_email: cust?.email,
      items: items,
      subtotal,
      vat: vatAmt,
      total: subtotal + vatAmt,
      status: 'received',
      status_history: [{ status: 'received', time: new Date().toISOString(), by: user.username }],
      payment_status: 'unpaid',
      notes: orderForm.notes,
      delivery_address: cust?.addresses?.[orderForm.deliveryAddrIdx] || cust?.address || '',
      created_at: new Date().toISOString(),
    };
    const { data, error } = await sb.from('orders').insert(newOrder).select().single();
    if (!error && data) {
      setOrders(prev => [data, ...prev]);
      showToast(t.orderCreated);
      setOrderForm({ customerId: '', items: [], notes: '', deliveryAddrIdx: 0 });
      setView('orders');
    } else {
      showToast(t.error, 'error');
    }
    setLoading(false);
  }, [orderForm, customers, user, showToast, t]);

  // Generate PDF invoice
  const generateInvoicePDF = useCallback((order, type = 'proforma') => {
    const doc = new jsPDF();
    const isCredit = type === 'credit';
    // Header
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('GoOrder', 14, 22);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('goorder.dk | ' + CONTACT_EMAIL, 14, 30);
    // Invoice info
    doc.setFontSize(14);
    const title = isCredit ? 'CREDIT NOTE / KREDITNOTA' : type === 'final' ? 'INVOICE / FAKTURA' : 'PROFORMA INVOICE / PROFORMA FAKTURA';
    doc.text(title, 14, 45);
    doc.setFontSize(10);
    const invNo = (isCredit ? 'CN-' : 'INV-') + genId();
    doc.text(`${t.invoiceNo}: ${invNo}`, 14, 55);
    doc.text(`${t.date}: ${fmtDate(new Date())}`, 14, 61);
    doc.text(`${t.orderNo}: ${order.order_no}`, 14, 67);
    doc.text(`${t.customer}: ${order.customer_name}`, 14, 73);
    if (order.delivery_address) doc.text(`${t.address}: ${typeof order.delivery_address === 'string' ? order.delivery_address : order.delivery_address.street || ''}`, 14, 79);
    // Items table
    const items = (order.items || []).map(it => [
      it.model || it.brand,
      it.qty,
      fmtMoney(it.unitPrice, cur),
      fmtMoney(it.total, cur),
    ]);
    autoTable(doc, {
      startY: 88,
      head: [[t.model, t.qty, t.unitPrice, t.lineTotal]],
      body: items,
      theme: 'grid',
      headStyles: { fillColor: [10, 10, 11], textColor: [205, 255, 71] },
      styles: { fontSize: 9 },
    });
    const finalY = doc.lastAutoTable?.finalY || 130;
    doc.setFontSize(10);
    doc.text(`${t.subtotal}: ${fmtMoney(order.subtotal, cur)}`, 140, finalY + 10);
    doc.text(`${t.tax}: ${fmtMoney(order.vat, cur)}`, 140, finalY + 17);
    doc.setFont(undefined, 'bold');
    doc.text(`${t.grandTotal}: ${fmtMoney(order.total, cur)}`, 140, finalY + 26);
    // Save
    doc.save(`${invNo}.pdf`);
    // Save invoice record
    const inv = { invoice_no: invNo, order_id: order.id, type, total: isCredit ? -order.total : order.total, created_at: new Date().toISOString() };
    sb.from('invoices').insert(inv);
    setInvoicesData(prev => [inv, ...prev]);
    return invNo;
  }, [cur, t]);

  // Export reports
  const exportReport = useCallback((format) => {
    const data = filteredOrders.map(o => ({
      [t.orderNo]: o.order_no,
      [t.customer]: o.customer_name,
      [t.date]: fmtDate(o.created_at),
      [t.status]: t[o.status] || o.status,
      [t.total]: o.total,
      [t.paymentStatus]: o.payment_status === 'paid' ? t.paid : t.unpaid,
    }));
    if (format === 'excel' || format === 'csv') {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Orders');
      if (format === 'excel') XLSX.writeFile(wb, 'GoOrder_Report.xlsx');
      else XLSX.writeFile(wb, 'GoOrder_Report.csv', { bookType: 'csv' });
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('GoOrder — ' + t.reports, 14, 20);
      doc.setFontSize(8);
      doc.text(fmtDate(new Date()), 14, 27);
      autoTable(doc, {
        startY: 32,
        head: [Object.keys(data[0] || {})],
        body: data.map(d => Object.values(d)),
        theme: 'grid',
        headStyles: { fillColor: [10, 10, 11], textColor: [205, 255, 71], fontSize: 7 },
        styles: { fontSize: 7 },
      });
      doc.save('GoOrder_Report.pdf');
    }
  }, [filteredOrders, t, cur]);

  // Save profile
  const saveProfile = useCallback(async (profileData) => {
    const { error } = await sb.from('users').update(profileData).eq('id', user.id);
    if (!error) {
      setUser(prev => ({ ...prev, ...profileData }));
      showToast(t.savedOk);
      setEditingProfile(null);
    } else showToast(t.error, 'error');
  }, [user, showToast, t]);

  // Partial shipment
  const handlePartialShip = useCallback(async (orderId, shipItems) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const updatedItems = order.items.map(it => {
      const ship = shipItems.find(s => s.productId === it.productId);
      return ship ? { ...it, delivered_qty: (it.delivered_qty || 0) + ship.shipQty } : it;
    });
    const allDelivered = updatedItems.every(it => (it.delivered_qty || 0) >= it.qty);
    const newStatus = allDelivered ? 'delivered' : 'shipped';
    const history = [...(order.status_history || []), { status: newStatus, time: new Date().toISOString(), by: user.username, partial: !allDelivered }];
    await sb.from('orders').update({ items: updatedItems, status: newStatus, status_history: history }).eq('id', orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, items: updatedItems, status: newStatus, status_history: history } : o));
    setPartialShipModal(null);
    showToast(allDelivered ? t.delivered : t.partialDelivery);
  }, [orders, user, showToast, t]);

  // Delivery proof — signature canvas handlers
  const startDraw = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#cdff47';
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing]);

  const endDraw = useCallback(() => setIsDrawing(false), []);

  const saveDeliveryProof = useCallback(async (orderId, photoData, signatureData) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const proof = { photo: photoData, signature: signatureData, timestamp: new Date().toISOString() };
    await sb.from('orders').update({ delivery_proof: proof }).eq('id', orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, delivery_proof: proof } : o));
    setDeliveryProofModal(null);
    showToast(t.savedOk);
  }, [orders, showToast, t]);

  // Credit note
  const createCreditNote = useCallback(async () => {
    const order = orders.find(o => o.id === creditForm.orderId);
    if (!order) return;
    const cn = {
      credit_no: 'CN-' + genId(),
      order_id: order.id,
      order_no: order.order_no,
      customer_name: order.customer_name,
      reason: creditForm.reason,
      amount: creditForm.amount || order.total,
      items: creditForm.items.length > 0 ? creditForm.items : order.items,
      created_at: new Date().toISOString(),
    };
    setCreditNotesData(prev => [cn, ...prev]);
    generateInvoicePDF({ ...order, total: cn.amount, subtotal: cn.amount / 1.25, vat: cn.amount - cn.amount / 1.25 }, 'credit');
    setShowCreditModal(false);
    showToast(t.creditNote + ' ✓');
  }, [creditForm, orders, generateInvoicePDF, showToast, t]);

  /* ══════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════ */

  // LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'var(--bg)' }}>
        <div className="card fade-in" style={{ maxWidth:400, width:'100%' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:'2rem', fontWeight:900, color:'var(--accent)', letterSpacing:'-0.03em' }}>GO</div>
            <div style={{ fontSize:'1.4rem', fontWeight:700, marginTop:4 }}>GoOrder</div>
            <div style={{ color:'var(--text-muted)', fontSize:'0.85rem', marginTop:4 }}>B2B Bestillingssystem</div>
          </div>
          <div className="form-group" style={{ marginBottom:16 }}>
            <label className="form-label">{t.username}</label>
            <input type="text" value={loginForm.username} onChange={e => setLoginForm(p=>({...p,username:e.target.value}))}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} autoFocus />
          </div>
          <div className="form-group" style={{ marginBottom:24 }}>
            <label className="form-label">{t.password}</label>
            <input type="password" value={loginForm.password} onChange={e => setLoginForm(p=>({...p,password:e.target.value}))}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <button className="btn-primary" style={{ width:'100%' }} onClick={handleLogin} disabled={loading}>
            {loading ? '...' : t.login}
          </button>
          <div style={{ marginTop:20, display:'flex', gap:8, justifyContent:'center' }}>
            {Object.entries(LANG_LABELS).map(([k,v]) => (
              <button key={k} className={`btn-ghost btn-sm ${lang===k?'':''}` } style={lang===k?{color:'var(--accent)'}:{}} onClick={()=>setLang(k)}>{v}</button>
            ))}
          </div>
          <div style={{ marginTop:16, textAlign:'center', fontSize:'0.75rem', color:'var(--text-muted)' }}>
            admin/GoOrder2026! · demo/demo123 · kunde1/Bestil2026
          </div>
        </div>
      </div>
    );
  }

  // NAV ITEMS
  const navItems = isAdmin ? [
    { key:'dashboard', icon:IC.dashboard, label:t.dashboard },
    { key:'orders', icon:IC.orders, label:t.orders },
    { key:'newOrder', icon:IC.plus, label:t.newOrder },
    { key:'products', icon:IC.products, label:t.products },
    { key:'customers', icon:IC.users, label:t.customers },
    { key:'invoices', icon:IC.invoice, label:t.invoices },
    { key:'creditNotes', icon:IC.credit, label:t.creditNotes },
    { key:'reports', icon:IC.chart, label:t.reports },
    { key:'profile', icon:IC.profile, label:t.profile },
    { key:'settings', icon:IC.settings, label:t.settings },
  ] : [
    { key:'dashboard', icon:IC.dashboard, label:t.dashboard },
    { key:'orders', icon:IC.orders, label:t.myOrders },
    { key:'products', icon:IC.products, label:t.products },
    { key:'profile', icon:IC.profile, label:t.profile },
    { key:'settings', icon:IC.settings, label:t.settings },
  ];

  /* ── PAGE RENDERERS ── */

  // DASHBOARD
  const renderDashboard = () => (
    <div className="fade-in">
      <h2 style={{ fontSize:'1.5rem', fontWeight:700, marginBottom:24 }}>{t.welcome}, {user.name || user.username}!</h2>
      <div className="grid-4" style={{ marginBottom:32 }}>
        <div className="stat-card">
          <div className="stat-label">{t.totalOrders}</div>
          <div className="stat-value" style={{ color:'var(--accent)' }}>{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.revenue}</div>
          <div className="stat-value">{fmtMoney(stats.revenue, cur)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.avgOrder}</div>
          <div className="stat-value">{fmtMoney(stats.avg, cur)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.products}</div>
          <div className="stat-value">{PRODUCTS.length}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom:24 }}>
        <h3 style={{ marginBottom:16, fontWeight:600 }}>{t.recentOrders}</h3>
        {filteredOrders.length === 0 ? (
          <div className="empty-state"><span style={{fontSize:'2rem'}}>📦</span><span>{t.noOrders}</span></div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table>
              <thead><tr><th>{t.orderNo}</th><th>{t.customer}</th><th>{t.date}</th><th>{t.status}</th><th>{t.total}</th><th></th></tr></thead>
              <tbody>
                {filteredOrders.slice(0, 8).map(o => (
                  <tr key={o.id}>
                    <td style={{ fontFamily:'var(--mono)', fontSize:'0.85rem' }}>{o.order_no}</td>
                    <td>{o.customer_name}</td>
                    <td style={{ color:'var(--text-secondary)' }}>{fmtDate(o.created_at)}</td>
                    <td><span className={`badge ${STATUS_COLORS[o.status]||'badge-info'}`}>{t[o.status]||o.status}</span></td>
                    <td style={{ fontFamily:'var(--mono)' }}>{fmtMoney(o.total, cur)}</td>
                    <td><button className="btn-ghost btn-sm" onClick={()=>{setSelectedOrder(o);setView('orderDetail')}}>{t.viewOrder}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="card">
          <h3 style={{ marginBottom:16, fontWeight:600 }}>{t.topProducts}</h3>
          <div className="grid-3">
            {PRODUCTS.slice(0, 6).map(p => {
              const si = stockInfo(p.stock, t);
              return (
                <div key={p.id} style={{ padding:12, borderRadius:'var(--radius)', border:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{p.model}</div>
                    <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{p.brand}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'var(--mono)', fontSize:'0.85rem' }}>{fmtMoney(p.price, cur)}</div>
                    <div style={{ fontSize:'0.75rem' }}><span className={`stock-dot ${si.cls}`}/>{si.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {deferredPrompt && (
        <button className="btn-secondary" style={{ marginTop:24 }} onClick={async () => {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') setDeferredPrompt(null);
        }}>
          📱 {t.installApp}
        </button>
      )}
    </div>
  );

  // ORDERS LIST
  const renderOrders = () => (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <h2 style={{ fontSize:'1.3rem', fontWeight:700 }}>{isAdmin ? t.orders : t.myOrders}</h2>
        {isAdmin && <button className="btn-primary btn-sm" onClick={()=>setView('newOrder')}>{IC.plus} {t.newOrder}</button>}
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <input type="search" placeholder={t.search} value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} style={{ maxWidth:250 }}/>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ maxWidth:180 }}>
          <option value="">{t.allStatuses}</option>
          {STATUS_FLOW.map(s => <option key={s} value={s}>{t[s]}</option>)}
          <option value="cancelled">{t.cancelled}</option>
        </select>
      </div>
      {filteredOrders.length === 0 ? (
        <div className="card empty-state"><span style={{fontSize:'3rem'}}>📦</span><p>{t.noOrders}</p></div>
      ) : (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table>
              <thead><tr><th>{t.orderNo}</th><th>{t.customer}</th><th>{t.date}</th><th>{t.items}</th><th>{t.status}</th><th>{t.paymentStatus}</th><th>{t.total}</th><th>{t.actions}</th></tr></thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontFamily:'var(--mono)', fontSize:'0.85rem' }}>{o.order_no}</td>
                    <td>{o.customer_name}</td>
                    <td style={{ color:'var(--text-secondary)' }}>{fmtDate(o.created_at)}</td>
                    <td>{(o.items||[]).length}</td>
                    <td><span className={`badge ${STATUS_COLORS[o.status]||'badge-info'}`}>{t[o.status]||o.status}</span></td>
                    <td><span className={`badge ${o.payment_status==='paid'?'badge-success':'badge-warning'}`}>{o.payment_status==='paid'?t.paid:t.unpaid}</span></td>
                    <td style={{ fontFamily:'var(--mono)' }}>{fmtMoney(o.total, cur)}</td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn-ghost btn-sm" onClick={()=>{setSelectedOrder(o);setView('orderDetail')}}>{t.viewOrder}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // ORDER DETAIL
  const renderOrderDetail = () => {
    if (!selectedOrder) return null;
    const o = selectedOrder;
    const currentIdx = STATUS_FLOW.indexOf(o.status);
    return (
      <div className="fade-in">
        <button className="btn-ghost" style={{ marginBottom:16 }} onClick={()=>{setSelectedOrder(null);setView('orders')}}>{IC.back} {t.back}</button>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:24 }}>
          <div>
            <h2 style={{ fontSize:'1.3rem', fontWeight:700 }}>{t.orderDetails}: {o.order_no}</h2>
            <p style={{ color:'var(--text-secondary)', marginTop:4 }}>{o.customer_name} · {fmtDate(o.created_at)}</p>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <span className={`badge ${STATUS_COLORS[o.status]}`}>{t[o.status]}</span>
            <span className={`badge ${o.payment_status==='paid'?'badge-success':'badge-warning'}`}>{o.payment_status==='paid'?t.paid:t.unpaid}</span>
          </div>
        </div>

        {/* Status progress */}
        <div className="card" style={{ marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            {STATUS_FLOW.map((s, i) => (
              <div key={s} style={{ textAlign:'center', flex:1, opacity: i <= currentIdx ? 1 : 0.3 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background: i <= currentIdx ? 'var(--accent)' : 'var(--bg-elevated)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 6px', fontSize:'0.75rem', color: i <= currentIdx ? 'var(--bg)' : 'var(--text-muted)', fontWeight:700 }}>{i+1}</div>
                <div style={{ fontSize:'0.75rem', fontWeight:600 }}>{t[s]}</div>
              </div>
            ))}
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${((currentIdx + 1) / STATUS_FLOW.length) * 100}%`, background:'var(--accent)' }}/>
          </div>
        </div>

        {/* Items */}
        <div className="card" style={{ marginBottom:20 }}>
          <h3 style={{ marginBottom:12, fontWeight:600 }}>{t.items}</h3>
          <table>
            <thead><tr><th>{t.model}</th><th>{t.brand}</th><th>{t.qty}</th><th>{t.deliveredQty}</th><th>{t.unitPrice}</th><th>{t.lineTotal}</th><th>{t.stockLevel}</th></tr></thead>
            <tbody>
              {(o.items||[]).map((it, i) => {
                const prod = PRODUCTS.find(p => p.id === it.productId);
                const si = stockInfo(prod?.stock || 0, t);
                return (
                  <tr key={i}>
                    <td style={{ fontWeight:500 }}>{it.model}{it.configLabel ? <div style={{fontSize:'0.75rem',color:'var(--text-muted)',marginTop:2}}>{it.configLabel}</div> : null}</td>
                    <td>{it.brand}</td>
                    <td>{it.qty}</td>
                    <td>{it.delivered_qty || 0} / {it.qty}</td>
                    <td style={{ fontFamily:'var(--mono)' }}>{fmtMoney(it.unitPrice, cur)}</td>
                    <td style={{ fontFamily:'var(--mono)' }}>{fmtMoney(it.total, cur)}</td>
                    <td><span className={`stock-dot ${si.cls}`}/>{si.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ marginTop:16, textAlign:'right' }}>
            <div style={{ color:'var(--text-secondary)' }}>{t.subtotal}: {fmtMoney(o.subtotal, cur)}</div>
            <div style={{ color:'var(--text-secondary)' }}>{t.tax}: {fmtMoney(o.vat, cur)}</div>
            <div style={{ fontSize:'1.2rem', fontWeight:700, marginTop:4 }}>{t.grandTotal}: {fmtMoney(o.total, cur)}</div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:20 }}>
          {isAdmin && o.status !== 'delivered' && o.status !== 'cancelled' && (
            <>
              {currentIdx < STATUS_FLOW.length - 1 && (
                <button className="btn-primary btn-sm" onClick={() => changeStatus(o.id, STATUS_FLOW[currentIdx + 1])}>
                  → {t[STATUS_FLOW[currentIdx + 1]]}
                </button>
              )}
              {(o.status === 'processing' || o.status === 'received') && (
                <button className="btn-secondary btn-sm" onClick={() => setPartialShipModal(o)}>
                  📦 {t.partialShip}
                </button>
              )}
              {o.status === 'shipped' && (
                <button className="btn-secondary btn-sm" onClick={() => setDeliveryProofModal(o)}>
                  {IC.camera} {t.deliveryProof}
                </button>
              )}
              <button className="btn-secondary btn-sm" onClick={() => changeStatus(o.id, 'cancelled')}>
                ✕ {t.cancelled}
              </button>
            </>
          )}
          <button className="btn-secondary btn-sm" onClick={() => generateInvoicePDF(o, 'proforma')}>{IC.download} {t.proforma}</button>
          {(o.status === 'delivered' || o.status === 'shipped') && (
            <button className="btn-secondary btn-sm" onClick={() => generateInvoicePDF(o, 'final')}>{IC.download} {t.finalInvoice}</button>
          )}
          {isAdmin && <button className="btn-secondary btn-sm" onClick={() => { setCreditForm({ orderId:o.id, reason:'', items:[], amount:o.total }); setShowCreditModal(true); }}>💳 {t.creditNote}</button>}
          {o.payment_status !== 'paid' && (
            <button className="btn-primary btn-sm" onClick={() => setShowPayPal(o)}>💰 {t.payNow}</button>
          )}
        </div>

        {/* PayPal */}
        {showPayPal && showPayPal.id === o.id && (
          <div className="card" style={{ marginBottom:20 }}>
            <h3 style={{ marginBottom:12 }}>{t.payWithPayPal}</h3>
            <PayPalScriptProvider options={{ "client-id": PP_CLIENT, currency: CURRENCIES[cur].code === 'DKK' ? 'USD' : CURRENCIES[cur].code }}>
              <PayPalButtons
                style={{ layout:'horizontal', color:'gold', shape:'rect', label:'pay' }}
                createOrder={(data, actions) => actions.order.create({
                  purchase_units: [{ amount: { value: (o.total * CURRENCIES.USD.rate).toFixed(2) } }]
                })}
                onApprove={async (data, actions) => {
                  await actions.order.capture();
                  await sb.from('orders').update({ payment_status:'paid', paypal_id: data.orderID }).eq('id', o.id);
                  setOrders(prev => prev.map(ord => ord.id === o.id ? { ...ord, payment_status:'paid' } : ord));
                  setSelectedOrder(prev => prev ? { ...prev, payment_status:'paid' } : prev);
                  setShowPayPal(null);
                  showToast(t.paid + ' ✓');
                }}
              />
            </PayPalScriptProvider>
          </div>
        )}

        {/* Status history */}
        {o.status_history && o.status_history.length > 0 && (
          <div className="card" style={{ marginBottom:20 }}>
            <h3 style={{ marginBottom:12, fontWeight:600 }}>{t.statusHistory}</h3>
            {o.status_history.map((h, i) => (
              <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'8px 0', borderBottom: i < o.status_history.length-1 ? '1px solid var(--border)' : 'none' }}>
                <span className={`badge ${STATUS_COLORS[h.status]||'badge-info'}`}>{t[h.status]||h.status}</span>
                <span style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>{fmtDate(h.time)}</span>
                <span style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>{h.by}</span>
                {h.partial && <span className="badge badge-warning">{t.partialDelivery}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Delivery proof */}
        {o.delivery_proof && (
          <div className="card">
            <h3 style={{ marginBottom:12, fontWeight:600 }}>{t.deliveryProof}</h3>
            <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>{fmtDate(o.delivery_proof.timestamp)}</p>
            {o.delivery_proof.photo && <img src={o.delivery_proof.photo} alt="proof" style={{ maxWidth:300, borderRadius:'var(--radius)', marginTop:8 }}/>}
            {o.delivery_proof.signature && <img src={o.delivery_proof.signature} alt="signature" style={{ maxWidth:300, borderRadius:'var(--radius)', marginTop:8, background:'var(--bg-elevated)', padding:8 }}/>}
          </div>
        )}

        {o.notes && <div className="card" style={{ marginTop:20 }}><h4 style={{ marginBottom:8 }}>{t.notes}</h4><p style={{ color:'var(--text-secondary)' }}>{o.notes}</p></div>}
      </div>
    );
  };

  // NEW ORDER
  const renderNewOrder = () => (
    <div className="fade-in">
      <h2 style={{ fontSize:'1.3rem', fontWeight:700, marginBottom:20 }}>{t.createOrder}</h2>
      <div className="card" style={{ marginBottom:20 }}>
        <div className="form-group" style={{ marginBottom:16 }}>
          <label className="form-label">{t.selectCustomer}</label>
          <select value={orderForm.customerId} onChange={e => setOrderForm(p=>({...p, customerId:e.target.value}))}>
            <option value="">— {t.selectCustomer} —</option>
            {customers.filter(c=>c.role==='customer'||c.role==='demo').map(c => (
              <option key={c.id} value={c.id}>{c.company || c.name || c.username}</option>
            ))}
          </select>
        </div>
        {orderForm.customerId && (() => {
          const cust = customers.find(c => c.id === orderForm.customerId);
          const addrs = cust?.addresses || [cust?.address || ''];
          return addrs.length > 1 ? (
            <div className="form-group" style={{ marginBottom:16 }}>
              <label className="form-label">{t.deliveryAddr}</label>
              <select value={orderForm.deliveryAddrIdx} onChange={e => setOrderForm(p=>({...p, deliveryAddrIdx: +e.target.value}))}>
                {addrs.map((a, i) => <option key={i} value={i}>{typeof a === 'string' ? a : `${a.street}, ${a.city}`}</option>)}
              </select>
            </div>
          ) : null;
        })()}
      </div>

      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h3 style={{ fontWeight:600 }}>{t.items}</h3>
          <button className="btn-secondary btn-sm" onClick={() => setOrderForm(p=>({...p, items:[...p.items, {productId:'', qty:1, config:{}, stepIdx:0}]}))}>
            {IC.plus} {t.addItem}
          </button>
        </div>
        {orderForm.items.map((item, idx) => {
          const prod = PRODUCTS.find(p => p.id === item.productId);
          const cfg = item.config || {};
          const itemPrice = getConfigPrice(prod, cfg);
          const steps = prod?.steps || [];
          const currentStep = steps[item.stepIdx || 0];
          const allStepsDone = steps.length === 0 || Object.keys(cfg).length >= steps.length;
          return (
            <div key={idx} style={{ marginBottom:16, padding:16, borderRadius:'var(--radius-lg)', border:'1px solid var(--border)', background:'var(--bg-elevated)' }}>
              {/* Product selector */}
              <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom: prod ? 12 : 0 }}>
                <select style={{ flex:2, minWidth:200 }} value={item.productId} onChange={e => {
                  const items = [...orderForm.items]; items[idx] = { productId: e.target.value, qty:1, config:{}, stepIdx:0 }; setOrderForm(p=>({...p, items}));
                }}>
                  <option value="">— {t.model} —</option>
                  {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.brand} · {p.model} — fra {fmtMoney(p.price, cur)}</option>)}
                </select>
                <button className="btn-icon" onClick={() => { const items = orderForm.items.filter((_, i) => i !== idx); setOrderForm(p=>({...p, items})); }}>{IC.x}</button>
              </div>

              {/* Step-by-step configurator */}
              {prod && steps.length > 0 && (
                <div>
                  {/* Step progress */}
                  <div style={{ display:'flex', gap:4, marginBottom:14 }}>
                    {steps.map((st, si) => (
                      <div key={si} style={{ flex:1, textAlign:'center' }}>
                        <div style={{ height:3, borderRadius:2, background: cfg[st.k] ? 'var(--accent)' : si === (item.stepIdx||0) ? 'var(--accent-dim)' : 'var(--border)', marginBottom:4, transition:'background 0.3s' }}/>
                        <span style={{ fontSize:'0.7rem', color: cfg[st.k] ? 'var(--accent)' : 'var(--text-muted)' }}>{st.l}</span>
                      </div>
                    ))}
                  </div>

                  {/* Current step options */}
                  {currentStep && !allStepsDone && (
                    <div className="fade-in">
                      <div style={{ fontSize:'0.85rem', fontWeight:600, marginBottom:8 }}>
                        {(item.stepIdx||0) + 1}/{steps.length}: {currentStep.l}
                      </div>
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                        {currentStep.ch.map(ch => (
                          <button key={ch.v}
                            style={{
                              padding:'8px 16px', borderRadius:'var(--radius-sm)', fontSize:'0.85rem', fontWeight:500,
                              border: cfg[currentStep.k] === ch.v ? '2px solid var(--accent)' : '1px solid var(--border)',
                              background: cfg[currentStep.k] === ch.v ? 'var(--accent-bg)' : 'var(--bg)',
                              color: cfg[currentStep.k] === ch.v ? 'var(--accent)' : 'var(--text)',
                              cursor:'pointer', transition:'all 0.15s',
                            }}
                            onClick={() => {
                              const items = [...orderForm.items];
                              const newCfg = { ...cfg, [currentStep.k]: ch.v };
                              const nextIdx = Math.min((item.stepIdx||0) + 1, steps.length - 1);
                              const isLast = (item.stepIdx||0) >= steps.length - 1;
                              items[idx] = { ...items[idx], config: newCfg, stepIdx: isLast ? item.stepIdx : nextIdx };
                              setOrderForm(p=>({...p, items}));
                            }}
                          >
                            {ch.v}{ch.add ? ` (+${fmtMoney(ch.add, cur)})` : ''}
                          </button>
                        ))}
                      </div>
                      {(item.stepIdx||0) > 0 && (
                        <button className="btn-ghost btn-sm" style={{ marginTop:8 }} onClick={() => {
                          const items = [...orderForm.items]; items[idx].stepIdx = (items[idx].stepIdx||0) - 1; setOrderForm(p=>({...p, items}));
                        }}>{IC.back} Tilbage</button>
                      )}
                    </div>
                  )}

                  {/* Config summary when done */}
                  {allStepsDone && Object.keys(cfg).length > 0 && (
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
                      <div style={{ fontSize:'0.85rem', color:'var(--accent)', fontWeight:500 }}>✓ {fmtConfig(cfg)}</div>
                      <button className="btn-ghost btn-sm" onClick={() => {
                        const items = [...orderForm.items]; items[idx] = { ...items[idx], config:{}, stepIdx:0 }; setOrderForm(p=>({...p, items}));
                      }}>Ændre</button>
                    </div>
                  )}
                </div>
              )}

              {/* Qty + price when configured */}
              {prod && (allStepsDone || steps.length === 0) && (
                <div style={{ display:'flex', gap:10, alignItems:'center', marginTop:10, flexWrap:'wrap' }}>
                  <input type="number" min={1} max={prod.stock||999} style={{ width:80 }} value={item.qty} onChange={e => {
                    const items = [...orderForm.items]; items[idx].qty = Math.max(1, +e.target.value); setOrderForm(p=>({...p, items}));
                  }}/>
                  <span style={{ fontFamily:'var(--mono)', fontSize:'1rem', fontWeight:700, color:'var(--accent)' }}>{fmtMoney(itemPrice * item.qty, cur)}</span>
                  <span style={{ fontSize:'0.75rem' }}><span className={`stock-dot ${stockInfo(prod.stock, t).cls}`}/>{stockInfo(prod.stock, t).label}</span>
                </div>
              )}
            </div>
          );
        })}
        {orderForm.items.length > 0 && (() => {
          const sub = orderForm.items.reduce((s, it) => { const p = PRODUCTS.find(pr=>pr.id===it.productId); return s + getConfigPrice(p, it.config)*it.qty; }, 0);
          const vat = sub * 0.25;
          return (
            <div style={{ marginTop:16, textAlign:'right', borderTop:'1px solid var(--border)', paddingTop:12 }}>
              <div style={{ color:'var(--text-secondary)' }}>{t.subtotal}: {fmtMoney(sub, cur)}</div>
              <div style={{ color:'var(--text-secondary)' }}>{t.tax}: {fmtMoney(vat, cur)}</div>
              <div style={{ fontSize:'1.2rem', fontWeight:700, marginTop:4 }}>{t.grandTotal}: {fmtMoney(sub+vat, cur)}</div>
            </div>
          );
        })()}
      </div>

      <div className="card" style={{ marginBottom:20 }}>
        <div className="form-group">
          <label className="form-label">{t.notes}</label>
          <textarea rows={3} value={orderForm.notes} onChange={e => setOrderForm(p=>({...p,notes:e.target.value}))}/>
        </div>
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button className="btn-primary" onClick={createOrder} disabled={loading || !orderForm.customerId || orderForm.items.length===0}>
          {loading ? '...' : t.createOrder}
        </button>
        <button className="btn-secondary" onClick={()=>setView('orders')}>{t.cancel}</button>
      </div>
    </div>
  );

  // PRODUCTS
  const renderProducts = () => (
    <div className="fade-in">
      <h2 style={{ fontSize:'1.3rem', fontWeight:700, marginBottom:20 }}>{t.products} ({filteredProducts.length})</h2>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <input type="search" placeholder={t.search} value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} style={{ maxWidth:250 }}/>
        <select value={filterBrand} onChange={e=>setFilterBrand(e.target.value)} style={{ maxWidth:180 }}>
          <option value="">{t.allBrands}</option>
          {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div className="grid-3">
        {filteredProducts.map(p => {
          const si = stockInfo(p.stock, t);
          return (
            <div key={p.id} className="card" style={{ padding:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <span className="badge badge-accent">{p.brand}</span>
                <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{p.cat}</span>
              </div>
              <div style={{ fontWeight:600, marginBottom:4 }}>{p.model}</div>
              <div style={{ fontFamily:'var(--mono)', fontSize:'1.1rem', marginBottom:8 }}>{p.steps ? 'fra ' : ''}{fmtMoney(p.price, cur)}</div>
              <div style={{ fontSize:'0.8rem' }}><span className={`stock-dot ${si.cls}`}/>{si.label}</div>
              {p.steps && <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:6, display:'flex', gap:6, flexWrap:'wrap' }}>{p.steps.map((s,i) => <span key={i} style={{background:'var(--bg)',padding:'2px 8px',borderRadius:4,border:'1px solid var(--border)'}}>{s.l}</span>)}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );

  // CUSTOMERS
  const renderCustomers = () => (
    <div className="fade-in">
      <h2 style={{ fontSize:'1.3rem', fontWeight:700, marginBottom:20 }}>{t.customers}</h2>
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table>
            <thead><tr><th>{t.username}</th><th>{t.name}</th><th>{t.company}</th><th>{t.email}</th><th>{t.phone}</th><th>{t.vatNo}</th><th>{t.actions}</th></tr></thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td style={{ fontFamily:'var(--mono)' }}>{c.username}</td>
                  <td>{c.name}</td>
                  <td>{c.company || '—'}</td>
                  <td>{c.email || '—'}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{c.vat_no || '—'}</td>
                  <td><button className="btn-ghost btn-sm" onClick={()=>{setEditingProfile(c);setView('editCustomer')}}>{t.edit}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // INVOICES
  const renderInvoices = () => (
    <div className="fade-in">
      <h2 style={{ fontSize:'1.3rem', fontWeight:700, marginBottom:20 }}>{t.invoices}</h2>
      {invoicesData.length === 0 ? (
        <div className="card empty-state"><span style={{fontSize:'3rem'}}>📄</span><p>{t.noData}</p></div>
      ) : (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <table>
            <thead><tr><th>{t.invoiceNo}</th><th>{t.orderNo}</th><th>Type</th><th>{t.total}</th><th>{t.date}</th></tr></thead>
            <tbody>
              {invoicesData.map((inv, i) => (
                <tr key={i}>
                  <td style={{ fontFamily:'var(--mono)' }}>{inv.invoice_no}</td>
                  <td style={{ fontFamily:'var(--mono)' }}>{inv.order_id?.slice(0,8) || '—'}</td>
                  <td><span className={`badge ${inv.type==='credit'?'badge-danger':'badge-accent'}`}>{inv.type}</span></td>
                  <td style={{ fontFamily:'var(--mono)' }}>{fmtMoney(Math.abs(inv.total||0), cur)}</td>
                  <td>{fmtDate(inv.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // CREDIT NOTES
  const renderCreditNotes = () => (
    <div className="fade-in">
      <h2 style={{ fontSize:'1.3rem', fontWeight:700, marginBottom:20 }}>{t.creditNotes}</h2>
      {creditNotesData.length === 0 ? (
        <div className="card empty-state"><span style={{fontSize:'3rem'}}>💳</span><p>{t.noData}</p></div>
      ) : (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <table>
            <thead><tr><th>CN#</th><th>{t.orderNo}</th><th>{t.customer}</th><th>{t.reason}</th><th>{t.amount}</th><th>{t.date}</th></tr></thead>
            <tbody>
              {creditNotesData.map((cn, i) => (
                <tr key={i}>
                  <td style={{ fontFamily:'var(--mono)' }}>{cn.credit_no}</td>
                  <td>{cn.order_no}</td>
                  <td>{cn.customer_name}</td>
                  <td>{cn.reason || '—'}</td>
                  <td style={{ fontFamily:'var(--mono)', color:'var(--danger)' }}>-{fmtMoney(cn.amount, cur)}</td>
                  <td>{fmtDate(cn.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // REPORTS
  const renderReports = () => (
    <div className="fade-in">
      <h2 style={{ fontSize:'1.3rem', fontWeight:700, marginBottom:20 }}>{t.reports}</h2>
      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:20 }}>
          <button className="btn-primary btn-sm" onClick={() => exportReport('excel')}>{IC.download} {t.exportExcel}</button>
          <button className="btn-secondary btn-sm" onClick={() => exportReport('pdf')}>{IC.download} {t.exportPDF}</button>
          <button className="btn-secondary btn-sm" onClick={() => exportReport('csv')}>{IC.download} {t.exportCSV}</button>
        </div>
        <div className="grid-4" style={{ marginBottom:20 }}>
          <div className="stat-card">
            <div className="stat-label">{t.totalOrders}</div>
            <div className="stat-value" style={{ color:'var(--accent)' }}>{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t.revenue}</div>
            <div className="stat-value">{fmtMoney(stats.revenue, cur)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t.paid}</div>
            <div className="stat-value" style={{ color:'var(--success)' }}>{orders.filter(o=>o.payment_status==='paid').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t.unpaid}</div>
            <div className="stat-value" style={{ color:'var(--warning)' }}>{orders.filter(o=>o.payment_status!=='paid').length}</div>
          </div>
        </div>
        {/* Orders by status */}
        <h3 style={{ fontWeight:600, marginBottom:12 }}>{t.status}</h3>
        <div className="grid-4" style={{ marginBottom:20 }}>
          {[...STATUS_FLOW, 'cancelled'].map(s => (
            <div key={s} style={{ padding:12, borderRadius:'var(--radius)', border:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span className={`badge ${STATUS_COLORS[s]}`}>{t[s]}</span>
              <span style={{ fontFamily:'var(--mono)', fontSize:'1.2rem', fontWeight:700 }}>{orders.filter(o=>o.status===s).length}</span>
            </div>
          ))}
        </div>
        {/* Top sold */}
        <h3 style={{ fontWeight:600, marginBottom:12 }}>{t.topProducts}</h3>
        <table>
          <thead><tr><th>{t.model}</th><th>{t.brand}</th><th>{t.qty}</th><th>{t.revenue}</th></tr></thead>
          <tbody>
            {(() => {
              const map = {};
              orders.forEach(o => (o.items||[]).forEach(it => {
                if (!map[it.model]) map[it.model] = { model:it.model, brand:it.brand, qty:0, rev:0 };
                map[it.model].qty += it.qty;
                map[it.model].rev += it.total;
              }));
              return Object.values(map).sort((a,b)=>b.rev-a.rev).slice(0,10).map((p,i) => (
                <tr key={i}><td>{p.model}</td><td>{p.brand}</td><td>{p.qty}</td><td style={{fontFamily:'var(--mono)'}}>{fmtMoney(p.rev,cur)}</td></tr>
              ));
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );

  // PROFILE
  const renderProfile = () => {
    const u = editingProfile || user;
    const addresses = u.addresses || [u.address || ''];
    return (
      <div className="fade-in">
        <h2 style={{ fontSize:'1.3rem', fontWeight:700, marginBottom:20 }}>{t.profile}</h2>
        <div className="card" style={{ marginBottom:20 }}>
          <div className="grid-2" style={{ marginBottom:16 }}>
            <div className="form-group">
              <label className="form-label">{t.name}</label>
              <input value={u.name || ''} onChange={e => setEditingProfile(p => ({...(p||user), name:e.target.value}))}/>
            </div>
            <div className="form-group">
              <label className="form-label">{t.email}</label>
              <input value={u.email || ''} onChange={e => setEditingProfile(p => ({...(p||user), email:e.target.value}))}/>
            </div>
            <div className="form-group">
              <label className="form-label">{t.phone}</label>
              <input value={u.phone || ''} onChange={e => setEditingProfile(p => ({...(p||user), phone:e.target.value}))}/>
            </div>
            <div className="form-group">
              <label className="form-label">{t.company}</label>
              <input value={u.company || ''} onChange={e => setEditingProfile(p => ({...(p||user), company:e.target.value}))}/>
            </div>
            <div className="form-group">
              <label className="form-label">{t.vatNo}</label>
              <input value={u.vat_no || ''} onChange={e => setEditingProfile(p => ({...(p||user), vat_no:e.target.value}))}/>
            </div>
            <div className="form-group">
              <label className="form-label">{t.country}</label>
              <input value={u.country || ''} onChange={e => setEditingProfile(p => ({...(p||user), country:e.target.value}))}/>
            </div>
          </div>

          <div className="divider"/>
          <h3 style={{ fontWeight:600, marginBottom:12 }}>{t.billingAddr}</h3>
          <div className="form-group" style={{ marginBottom:16 }}>
            <input value={u.billing_address || ''} onChange={e => setEditingProfile(p => ({...(p||user), billing_address:e.target.value}))} placeholder={t.billingAddr}/>
          </div>

          <div className="divider"/>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <h3 style={{ fontWeight:600 }}>{t.multiAddr}</h3>
            <button className="btn-secondary btn-sm" onClick={() => {
              const addrs = [...(editingProfile || user).addresses || [(editingProfile||user).address||''], ''];
              setEditingProfile(p => ({...(p||user), addresses: addrs}));
            }}>{IC.plus} {t.addAddress}</button>
          </div>
          {(editingProfile?.addresses || addresses).map((addr, i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:8, alignItems:'center' }}>
              <input style={{ flex:1 }} value={typeof addr === 'string' ? addr : addr.street || ''}
                onChange={e => {
                  const addrs = [...(editingProfile?.addresses || addresses)];
                  addrs[i] = e.target.value;
                  setEditingProfile(p => ({...(p||user), addresses: addrs}));
                }}
                placeholder={`${t.deliveryAddr} ${i+1}`}/>
              {i === 0 && <span className="badge badge-accent">{t.primaryAddr}</span>}
              {i > 0 && <button className="btn-icon" onClick={() => {
                const addrs = (editingProfile?.addresses || addresses).filter((_,j)=>j!==i);
                setEditingProfile(p => ({...(p||user), addresses:addrs}));
              }}>{IC.x}</button>}
            </div>
          ))}

          <div style={{ marginTop:20, display:'flex', gap:10 }}>
            <button className="btn-primary" onClick={() => saveProfile(editingProfile || user)}>{t.save}</button>
            <button className="btn-secondary" onClick={() => setEditingProfile(null)}>{t.cancel}</button>
          </div>
        </div>
      </div>
    );
  };

  // SETTINGS
  const renderSettings = () => (
    <div className="fade-in">
      <h2 style={{ fontSize:'1.3rem', fontWeight:700, marginBottom:20 }}>{t.settings}</h2>
      <div className="card">
        <div className="form-group" style={{ marginBottom:20 }}>
          <label className="form-label">{t.language}</label>
          <div className="tab-bar" style={{ maxWidth:500 }}>
            {Object.entries(LANG_LABELS).map(([k,v]) => (
              <button key={k} className={`tab-btn ${lang===k?'active':''}`} onClick={()=>setLang(k)}>{v}</button>
            ))}
          </div>
        </div>
        <div className="form-group" style={{ marginBottom:20 }}>
          <label className="form-label">{t.currency}</label>
          <div className="tab-bar" style={{ maxWidth:500 }}>
            {Object.keys(CURRENCIES).map(k => (
              <button key={k} className={`tab-btn ${cur===k?'active':''}`} onClick={()=>setCur(k)}>{k} ({CURRENCIES[k].symbol})</button>
            ))}
          </div>
        </div>
        {deferredPrompt && (
          <button className="btn-primary" onClick={async () => {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') setDeferredPrompt(null);
          }}>📱 {t.installApp}</button>
        )}
      </div>
    </div>
  );

  // EDIT CUSTOMER (admin)
  const renderEditCustomer = () => {
    if (!editingProfile) return null;
    return renderProfile();
  };

  // VIEW ROUTER
  const renderView = () => {
    switch (view) {
      case 'dashboard': return renderDashboard();
      case 'orders': return renderOrders();
      case 'orderDetail': return renderOrderDetail();
      case 'newOrder': return renderNewOrder();
      case 'products': return renderProducts();
      case 'customers': return renderCustomers();
      case 'invoices': return renderInvoices();
      case 'creditNotes': return renderCreditNotes();
      case 'reports': return renderReports();
      case 'profile': return renderProfile();
      case 'settings': return renderSettings();
      case 'editCustomer': return renderEditCustomer();
      default: return renderDashboard();
    }
  };

  return (
    <div>
      {/* SIDEBAR */}
      <div className={`sidebar ${sideOpen ? 'mobile-open' : ''}`}>
        <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'0.85rem', color:'var(--bg)' }}>GO</div>
            <div>
              <div style={{ fontWeight:700, fontSize:'1rem' }}>GoOrder</div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>v2.0</div>
            </div>
          </div>
          <button className="btn-icon" style={{ display:'none' }} onClick={() => setSideOpen(false)}>{IC.x}</button>
        </div>

        <nav style={{ flex:1, overflowY:'auto', padding:'12px 0' }}>
          {navItems.map(n => (
            <div key={n.key} className={`nav-item ${view === n.key ? 'active' : ''}`}
              onClick={() => { setView(n.key); setSideOpen(false); setSearchTerm(''); setFilterBrand(''); setFilterStatus(''); setSelectedOrder(null); }}>
              {n.icon}
              <span>{n.label}</span>
            </div>
          ))}
        </nav>

        <div style={{ padding:16, borderTop:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'var(--bg-elevated)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:600 }}>
              {(user.name || user.username).charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:'0.85rem', fontWeight:600 }}>{user.name || user.username}</div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{user.role}</div>
            </div>
          </div>
          <button className="btn-secondary btn-sm" style={{ width:'100%' }} onClick={handleLogout}>{t.logout}</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-content">
        <div className="topbar">
          <button className="btn-icon" style={{ display:'block' }} onClick={() => setSideOpen(!sideOpen)}>
            {IC.menu}
          </button>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <select value={lang} onChange={e=>setLang(e.target.value)} style={{ width:'auto', padding:'6px 30px 6px 10px', fontSize:'0.8rem' }}>
              {Object.entries(LANG_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={cur} onChange={e=>setCur(e.target.value)} style={{ width:'auto', padding:'6px 30px 6px 10px', fontSize:'0.8rem' }}>
              {Object.keys(CURRENCIES).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>
        <div style={{ padding:'24px 28px', maxWidth:1200 }}>
          {renderView()}
        </div>
      </div>

      {/* MODALS */}

      {/* Partial shipment modal */}
      {partialShipModal && (
        <div className="modal-overlay" onClick={() => setPartialShipModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom:16 }}>{t.partialShip}: {partialShipModal.order_no}</h3>
            {(partialShipModal.items || []).map((it, i) => {
              const remaining = it.qty - (it.delivered_qty || 0);
              if (remaining <= 0) return null;
              return (
                <div key={i} style={{ display:'flex', gap:10, alignItems:'center', marginBottom:12 }}>
                  <span style={{ flex:1, fontWeight:500 }}>{it.model}</span>
                  <span style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{t.remainingQty}: {remaining}</span>
                  <input type="number" min={0} max={remaining} defaultValue={0} style={{ width:80 }}
                    id={`ship-${i}`}/>
                </div>
              );
            })}
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button className="btn-primary" onClick={() => {
                const shipItems = (partialShipModal.items || []).map((it, i) => {
                  const el = document.getElementById(`ship-${i}`);
                  return { productId: it.productId, shipQty: el ? +el.value : 0 };
                }).filter(s => s.shipQty > 0);
                if (shipItems.length > 0) handlePartialShip(partialShipModal.id, shipItems);
              }}>{t.markShipped}</button>
              <button className="btn-secondary" onClick={() => setPartialShipModal(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery proof modal */}
      {deliveryProofModal && (
        <div className="modal-overlay" onClick={() => setDeliveryProofModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom:16 }}>{t.deliveryProof}: {deliveryProofModal.order_no}</h3>
            <div className="form-group" style={{ marginBottom:16 }}>
              <label className="form-label">{t.uploadPhoto}</label>
              <input type="file" accept="image/*" id="proof-photo"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => { document.getElementById('proof-preview').src = ev.target.result; };
                    reader.readAsDataURL(file);
                  }
                }}/>
              <img id="proof-preview" alt="" style={{ maxWidth:200, marginTop:8, borderRadius:'var(--radius)', display:'block' }}/>
            </div>
            <div className="form-group" style={{ marginBottom:16 }}>
              <label className="form-label">{t.signatureCapture}</label>
              <canvas ref={canvasRef} width={400} height={150}
                style={{ border:'1px solid var(--border)', borderRadius:'var(--radius)', cursor:'crosshair', touchAction:'none', background:'var(--bg)' }}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}/>
              <button className="btn-ghost btn-sm" style={{ marginTop:8 }} onClick={() => {
                const canvas = canvasRef.current;
                if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
              }}>{t.clear}</button>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-primary" onClick={() => {
                const photo = document.getElementById('proof-preview')?.src || null;
                const sig = canvasRef.current?.toDataURL() || null;
                saveDeliveryProof(deliveryProofModal.id, photo, sig);
              }}>{t.save}</button>
              <button className="btn-secondary" onClick={() => setDeliveryProofModal(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* Credit note modal */}
      {showCreditModal && (
        <div className="modal-overlay" onClick={() => setShowCreditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom:16 }}>{t.generateCredit}</h3>
            <div className="form-group" style={{ marginBottom:16 }}>
              <label className="form-label">{t.reason}</label>
              <textarea rows={2} value={creditForm.reason} onChange={e => setCreditForm(p=>({...p, reason:e.target.value}))}/>
            </div>
            <div className="form-group" style={{ marginBottom:16 }}>
              <label className="form-label">{t.amount} ({CURRENCIES[cur].symbol})</label>
              <input type="number" value={creditForm.amount} onChange={e => setCreditForm(p=>({...p, amount:+e.target.value}))}/>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-primary" onClick={createCreditNote}>{t.confirm}</button>
              <button className="btn-secondary" onClick={() => setShowCreditModal(false)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast" style={{
          background: toast.type === 'error' ? 'var(--danger)' : toast.type === 'warning' ? 'var(--warning)' : 'var(--accent)',
          color: toast.type === 'error' ? 'white' : 'var(--bg)'
        }}>
          {toast.msg}
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {sideOpen && <div style={{ position:'fixed', inset:0, zIndex:99, background:'rgba(0,0,0,0.5)' }} onClick={()=>setSideOpen(false)}/>}
    </div>
  );
}
