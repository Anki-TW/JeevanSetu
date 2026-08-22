/**
 * Multilingual Internationalization (i18n) Engine for North Eastern Region (NER)
 * Languages Supported:
 * - English (en)
 * - Assamese / অসমীয়া (as)
 * - Bengali / বাংলা (bn)
 * - Hindi / हिन्दी (hi)
 * - Manipuri / মৈতৈলোন্ (mni)
 */

const I18N_DATA = {
  en: {
    appTitle: "NER Accessibility & Logistics Intelligence",
    appSubtitle: "AI-Powered Smart Logistics & Multi-Terrain Accessibility Platform for North Eastern Region",
    systemStatus: "AI Engine Active • Live Satellite & Radar Feed",
    online: "Online",
    offline: "Offline (Local Queue Active)",
    
    // Navigation Tabs
    tabGis: "GIS Accessibility Map",
    tabAiRoute: "AI Disruption & Routing",
    tabFleet: "Essential Fleet Tracking",
    tabIncident: "Field Incident Report (Offline-First)",
    tabAlerts: "Corridor Alerts & SOS",

    // Stat Cards
    statActiveConvoys: "Active Convoys",
    statAccessibleDistricts: "Accessible Districts",
    statHighRiskBottlenecks: "High-Risk Bottlenecks",
    statPendingOfflineReports: "Pending Offline Reports",

    // GIS Panel
    layerSelectorTitle: "Map Layers & Overlays",
    layerHighways: "Highway Networks",
    layerDistricts: "District Accessibility",
    layerBridges: "Bridges & Passes",
    layerFleet: "Fleet Convoys",
    layerIncidents: "Disruption Incidents",
    layerWeather: "Precipitation Radar",
    
    districtStatusNormal: "Normal Connectivity",
    districtStatusWarning: "Restricted / Caution",
    districtStatusCritical: "Severe Disruption / Cut-Off",

    // AI Route Engine
    routeEngineTitle: "AI Terrain-Aware Multi-Modal Route Optimizer",
    originLabel: "Origin Hub",
    destinationLabel: "Destination District",
    cargoTypeLabel: "Cargo Priority",
    calculateRouteBtn: "Calculate AI Disruption-Proof Route",
    standardRoute: "Standard Direct Route",
    aiAlternateRoute: "AI Predicted Alternate Route",
    riskScore: "Landslide/Flood Risk Score",
    safetyConfidence: "Safety Confidence",
    estimatedDelay: "Est. Disruption Delay",
    weatherImpact: "Monsoon Weather Impact",

    // Fleet Tracker
    fleetTrackerTitle: "Live GPS Telemetry & Cold-Chain Supply Convoys",
    activeVehicles: "Active Convoys in Transit",
    altitude: "Altitude",
    speed: "Current Speed",
    cargoTemp: "Cargo Temp",
    fuelLevel: "Fuel Level",
    eta: "Estimated Arrival",

    // Incident Reporter
    incidentFormTitle: "Field Official & Citizen Incident Submission",
    incidentSubtext: "Geo-tagged reports sync automatically when network connectivity is detected.",
    incidentType: "Incident Classification",
    severityLevel: "Disruption Severity",
    coordinates: "GPS Coordinates",
    getGpsBtn: "Detect Current GPS",
    incidentDesc: "Detailed Description / Field Observations",
    submitReportBtn: "Submit Incident Report",
    syncQueueBtn: "Sync Offline Queue Now",

    // Alerts
    alertsTitle: "Real-Time Emergency Corridor Disruption Broadcast",
    emergencyBroadcastBtn: "Broadcast Regional Emergency Alert",
    verifiedAlert: "Verified Field Report"
  },

  as: {
    appTitle: "উত্তৰ-পূৰ্বাঞ্চলৰ পৰিবহন আৰু সৰবৰাহ বুদ্ধিমত্তা মঞ্চ",
    appSubtitle: "উত্তৰ-পূৰ্বাঞ্চলৰ বাবে এআই-চালিত স্মাৰ্ট লজিষ্টিক আৰু প্ৰাকৃতিক দুৰ্যোগ প্ৰতিৰোধী পথ নিৰীক্ষণ প্ৰণালী",
    systemStatus: "এআই ইঞ্জিন সক্ৰিয় • লাইভ চেটেলাইট আৰু ৰাডাৰ ফিড",
    online: "অনলাইন",
    offline: "অফলাইন (স্থানীয় সংৰক্ষণ সক্ৰিয়)",

    tabGis: "জিআইএছ পথ মানচিত্ৰ",
    tabAiRoute: "এআই বিকল্প পথ নিৰ্ণয়",
    tabFleet: "জৰুৰী সামগ্ৰী পৰিবহন ট্ৰেকিং",
    tabIncident: "ক্ষেত্ৰ প্ৰতিবেদন (অফলাইন)",
    tabAlerts: "সতৰ্কবাৰ্তা আৰু জৰুৰীকালীন সাহায্য",

    statActiveConvoys: "সক্ৰিয় কনভয়",
    statAccessibleDistricts: "সুচল জিলাসমূহ",
    statHighRiskBottlenecks: "উচ্চ বিপদাশংকাযুক্ত পথ",
    statPendingOfflineReports: "অপেক্ষিত অফলাইন প্ৰতিবেদন",

    layerSelectorTitle: "মানচিত্ৰৰ স্তৰসমূহ",
    layerHighways: "ৰাষ্ট্ৰীয় ঘাইপথ",
    layerDistricts: "জিলাৰ সংযোগ স্থিতি",
    layerBridges: "দলং আৰু গিৰিপথ",
    layerFleet: "পৰিবহন কনভয়",
    layerIncidents: "দুৰ্ঘটনা/ভূমিস্খলন তথ্য",
    layerWeather: "বৰষুণৰ ৰাডাৰ",

    districtStatusNormal: "স্বাভাৱিক সংযোগ",
    districtStatusWarning: "সতৰ্কতামূলক চলাচল",
    districtStatusCritical: "পথ সম্পূৰ্ণ বন্ধ / বিচ্ছিন্ন",

    routeEngineTitle: "এআই চালিত পাহাৰীয়া বিকল্প পথ নিৰ্ধাৰক",
    originLabel: "যাত্ৰাৰ স্থান (হাব)",
    destinationLabel: "গন্তব্য জিলা",
    cargoTypeLabel: "সামগ্ৰীৰ অগ্ৰাধিকাৰ",
    calculateRouteBtn: "এআই সুৰক্ষিত বিকল্প পথ বিচাৰক",
    standardRoute: "সাধাৰণ পথ",
    aiAlternateRoute: "এআই অনুমোদিত বিকল্প পথ",
    riskScore: "ভূমিস্খলন/বানপানীৰ সম্ভাৱনা",
    safetyConfidence: "সুৰক্ষাৰ মাত্ৰা",
    estimatedDelay: "আনুমানিক বিলম্ব",
    weatherImpact: "বতৰৰ প্ৰভাৱ",

    fleetTrackerTitle: "লাইভ জিপিএছ আৰু শীতল ভঁৰাল (ভেকচিন) পৰিবহন নিৰীক্ষণ",
    activeVehicles: "পথত থকা জৰুৰী বাহন",
    altitude: "উচ্চতা",
    speed: "গতিবেগ",
    cargoTemp: "সামগ্ৰীৰ তাপমাত্ৰা",
    fuelLevel: "ইন্ধনৰ পৰিমাণ",
    eta: "উপস্থিতিৰ সম্ভাৱ্য সময়",

    incidentFormTitle: "ক্ষেত্ৰ বিষয়া আৰু নাগৰিকৰ দ্বাৰা তথ্য দাখিল",
    incidentSubtext: "নেটৱৰ্ক নথকা অঞ্চলত তথ্য সংৰক্ষিত হ'ব আৰু সংযোগ লাভ কৰিলে স্বয়ংক্ৰিয়ভাৱে আপলোড হ'ব।",
    incidentType: "দুৰ্ঘটনা/বাধাৰ প্ৰকাৰ",
    severityLevel: "ক্ষতিৰ মাত্ৰা",
    coordinates: "জিপিএছ স্থানাংক",
    getGpsBtn: "জিপিএছ স্থান ধৰা পেলাওক",
    incidentDesc: "বিস্তাৰিত বিৱৰণ / প্ৰত্যক্ষদৰ্শীৰ মন্তব্য",
    submitReportBtn: "প্ৰতিবেদন দাখিল কৰক",
    syncQueueBtn: "অফলাইন তথ্য এতিয়াই ছিংক কৰক",

    alertsTitle: "ৰিয়েল-টাইম জৰুৰীকালীন পথ বন্ধৰ সতৰ্কবাৰ্তা",
    emergencyBroadcastBtn: "জৰুৰীকালীন সতৰ্কবাৰ্তা প্ৰেৰণ কৰক",
    verifiedAlert: "প্ৰত্যায়িত প্ৰতিবেদন"
  },

  bn: {
    appTitle: "উত্তর-পূর্বাঞ্চল লজিস্টিক ও পরিবহন বুদ্ধিমত্তা প্ল্যাটফর্ম",
    appSubtitle: "উত্তর-পূর্ব ভারতের জন্য এআই-চালিত স্মার্ট পরিবহন ও দুর্যোগ-সহনশীল রুট মনিটরিং",
    systemStatus: "এআই ইঞ্জিন সক্রিয় • লাইভ স্যাটেলাইট ও রাডার ডেটা",
    online: "অনলাইন",
    offline: "অফলাইন (লোকাল মেমরি চালু)",

    tabGis: "জিআইএস মানচিত্র ও রুট স্ট্যাটাস",
    tabAiRoute: "এআই ডিসরাপশন ও বিকল্প রুট",
    tabFleet: "জরুরি সামগ্রী কনভয় ট্র্যাকিং",
    tabIncident: "মাঠপর্যায়ের রিপোর্ট (অফলাইন)",
    tabAlerts: "জরুরি সতর্কতা ও এসওএস",

    statActiveConvoys: "সক্রিয় কনভয়",
    statAccessibleDistricts: "সংযুক্ত জেলা",
    statHighRiskBottlenecks: "ঝুঁকিপূর্ণ বাধা",
    statPendingOfflineReports: "অপেক্ষমাণ অফলাইন রিপোর্ট",

    layerSelectorTitle: "মানচিত্রের লেয়ার",
    layerHighways: "জাতীয় মহাসড়ক",
    layerDistricts: "জেলার সংযোগ অবস্থা",
    layerBridges: "সেতু ও গিরিপথ",
    layerFleet: "লজিস্টিক ফ্লিট",
    layerIncidents: "ধস ও বন্যার ঘটনা",
    layerWeather: "বৃষ্টিপাত রাডার",

    districtStatusNormal: "স্বাভাবিক চলাচল",
    districtStatusWarning: "সতর্কতামূলক সংযোগ",
    districtStatusCritical: "মারাত্মক বিচ্ছিন্ন / অবরুদ্ধ",

    routeEngineTitle: "এআই চালিত নিরাপদ বিকল্প রুট বিশ্লেষক",
    originLabel: "উৎপত্তি কেন্দ্র",
    destinationLabel: "গন্তব্য জেলা",
    cargoTypeLabel: "জরুরি অগ্রাধিকার",
    calculateRouteBtn: "এআই সুরক্ষিত রুট নির্ধারণ করুন",
    standardRoute: "সাধারণ রুট",
    aiAlternateRoute: "এআই বিকল্প সুরক্ষিত রুট",
    riskScore: "ভূমিধস ও বন্যা ঝুঁকি সূচক",
    safetyConfidence: "সুরক্ষা রেটিং",
    estimatedDelay: "সম্ভাব্য বিলম্ব",
    weatherImpact: "আবহাওয়া প্রভাব",

    fleetTrackerTitle: "লাইভ জিপিএস ও মেডিকেল কোল্ড-চেন সাপ্লাই ট্র্যাকিং",
    activeVehicles: "চলমান জরুরি যান",
    altitude: "উচ্চতা",
    speed: "গতি",
    cargoTemp: "পণ্য তাপমাত্রা",
    fuelLevel: "জ্বালানি স্তর",
    eta: "পৌঁছানোর আনুমানিক সময়",

    incidentFormTitle: "মাঠপর্যায়ের ক্ষয়ক্ষতি ও অবরুদ্ধতার রিপোর্ট",
    incidentSubtext: "নেটওয়ার্ক না থাকলে স্থানীয়ভাবে সংরক্ষিত হবে এবং সংযোগ পেলে সিঙ্ক হবে।",
    incidentType: "বাধার প্রকৃতি (ধস/বন্যা/সেতু)",
    severityLevel: "তীব্রতা",
    coordinates: "জিপিএস অবস্থান",
    getGpsBtn: "স্বয়ংক্রিয় জিপিএস নিন",
    incidentDesc: "বিস্তারিত বিবরণ",
    submitReportBtn: "রিপোর্ট জমা দিন",
    syncQueueBtn: "অফলাইন রিপোর্ট সিঙ্ক করুন",

    alertsTitle: "রিয়েল-টাইম জরুরি করিডোর সতর্কতা ও সম্প্রচার",
    emergencyBroadcastBtn: "জরুরি অ্যালার্ট পাঠান",
    verifiedAlert: "যাচাইকৃত তথ্য"
  },

  hi: {
    appTitle: "पूर्वोत्तर क्षेत्र (NER) लॉजिस्टिक्स एवं पहुंच बुद्धिमत्ता प्रणाली",
    appSubtitle: "पूर्वोत्तर भारत के लिए एआई-संचालित स्मार्ट लॉजिस्टिक्स और बहु-भूभाग मार्ग निगरानी मंच",
    systemStatus: "एआई इंजन सक्रिय • लाइव सैटेलाइट एवं रडार फीड",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन (स्थानीय कतार सक्रिय)",

    tabGis: "जीआईएस मानचित्र एवं कनेक्टिविटी",
    tabAiRoute: "एआई रुकावट पूर्वानुमान व वैकल्पिक मार्ग",
    tabFleet: "आवश्यक आपूर्ति वाहन ट्रैकिंग",
    tabIncident: "फील्ड घटना रिपोर्ट (ऑफ़लाइन)",
    tabAlerts: "कॉरिडोर अलर्ट व आपातकालीन चेतावनी",

    statActiveConvoys: "सक्रिय काफिले",
    statAccessibleDistricts: "सुलभ जिले",
    statHighRiskBottlenecks: "अति संवेदनशील बाधाएं",
    statPendingOfflineReports: "लंबित ऑफ़लाइन रिपोर्ट",

    layerSelectorTitle: "मानचित्र परतें (Layers)",
    layerHighways: "राष्ट्रीय राजमार्ग",
    layerDistricts: "जिला कनेक्टिविटी स्थिति",
    layerBridges: "पुल एवं दर्रे (Passes)",
    layerFleet: "आपूर्ति वाहन (Convoys)",
    layerIncidents: "भूस्खलन/बाढ़ घटनाएं",
    layerWeather: "वर्षा रडार ओवरले",

    districtStatusNormal: "सामान्य आवागमन",
    districtStatusWarning: "प्रतिबंधित / सतर्कता",
    districtStatusCritical: "गंभीर अवरोध / मार्ग बंद",

    routeEngineTitle: "एआई-संचालित भूभाग-संवेदनशील वैकल्पिक मार्ग इंजन",
    originLabel: "प्रस्थान केंद्र",
    destinationLabel: "गंतव्य जिला",
    cargoTypeLabel: "सामग्री प्राथमिकता",
    calculateRouteBtn: "एआई सुरक्षित मार्ग खोजें",
    standardRoute: "मानक सीधा मार्ग",
    aiAlternateRoute: "एआई अनुशंसित वैकल्पिक मार्ग",
    riskScore: "भूस्खलन/बाढ़ जोखिम स्कोर",
    safetyConfidence: "सुरक्षा विश्वास स्तर",
    estimatedDelay: "अनुमानित देरी",
    weatherImpact: "मानसून मौसम प्रभाव",

    fleetTrackerTitle: "लाइव जीपीएस टेलीमेट्री एवं वैक्सीन कोल्ड-चेन ट्रैकिंग",
    activeVehicles: "पारगमन में सक्रिय वाहन",
    altitude: "ऊंचाई (Altitude)",
    speed: "वर्तमान गति",
    cargoTemp: "कार्गो तापमान",
    fuelLevel: "ईंधन स्तर",
    eta: "अनुमानित आगमन समय",

    incidentFormTitle: "फील्ड अधिकारी एवं नागरिक आपदा रिपोर्टिंग",
    incidentSubtext: "बिना नेटवर्क के डेटा सुरक्षित रहेगा और नेटवर्क मिलते ही ऑटो-सिंक हो जाएगा।",
    incidentType: "अवरोध का प्रकार (भूस्खलन/पुल क्षति/बाढ़)",
    severityLevel: "गंभीरता",
    coordinates: "जीपीएस निर्देशांक",
    getGpsBtn: "वर्तमान जीपीएस प्राप्त करें",
    incidentDesc: "विस्तृत विवरण एवं फील्ड अवलोकन",
    submitReportBtn: "रिपोर्ट दर्ज करें",
    syncQueueBtn: "ऑफ़लाइन डेटा अभी सिंक करें",

    alertsTitle: "रीयल-टाइम आपातकालीन कॉरिडोर चेतावनी प्रसारण",
    emergencyBroadcastBtn: "आपातकालीन अलर्ट प्रसारित करें",
    verifiedAlert: "सत्यापित रिपोर्ट"
  },

  mni: {
    appTitle: "অৱাং-নোংপোক লমদমগী লোজিষ্টিক্স অমসুং লম্বী-থোং ইন্তেলিজেন্স",
    appSubtitle: "এন.ই.আৰ.গীদমক এআইনা চলাইবা স্মাৰ্ট লোজিষ্টিক্স অমসুং লম্বী অৱাবা য়েংশিনবা প্লেতফোৰ্ম",
    systemStatus: "এআই ইঞ্জিন চৎথরি • লাইভ চেটেলাইট ফিড",
    online: "অনলাইন",
    offline: "অফলাইন (লোকেল মেমোরি চৎথরি)",

    tabGis: "জিআইএস মেপ অমসুং লম্বীগী ফিভম",
    tabAiRoute: "এআইনা বিকল্প লম্বী থিদোকপা",
    tabFleet: "মচাক-মথুম পুবা গারী ত্র্যাকিং",
    tabIncident: "ফিল্ড ইনসিডেন্ট রিপোর্ত (অফলাইন)",
    tabAlerts: "চেকশিনৱা অমসুং এসওএস",

    statActiveConvoys: "চৎথরিবা কনভোয়",
    statAccessibleDistricts: "লম্বী ফংবা জিলাশিং",
    statHighRiskBottlenecks: "অরুবা লম্বী খাকপশিং",
    statPendingOfflineReports: "অফলাইন রিপোর্ত লৈরিবা",

    layerSelectorTitle: "মেপকী লেয়ারশিং",
    layerHighways: "হাইৱেশিং",
    layerDistricts: "জিলাগী ফিভম",
    layerBridges: "থোংশিং",
    layerFleet: "গারীশিং",
    layerIncidents: "নুং কায়বা/ঈশিং ইচাও",
    layerWeather: "নোংচুবা রাডার",

    districtStatusNormal: "নরমেল লম্বী",
    districtStatusWarning: "চেকশিন্না চৎকদবা",
    districtStatusCritical: "লম্বী খাকপা / অকক্নবা",

    routeEngineTitle: "এআই অল্টারনেতিভ রুত ওপতিমাইজার",
    originLabel: "হৌরকফম",
    destinationLabel: "য়ৌগদবা জিলা",
    cargoTypeLabel: "পোৎলমগী মরুওইবা",
    calculateRouteBtn: "এআই বিকল্প লম্বী য়েংবিয়ু",
    standardRoute: "নিয়মগী লম্বী",
    aiAlternateRoute: "এআইনা পীরবা নিরাপদ লম্বী",
    riskScore: "নুং কায়বগী রিস্ক",
    safetyConfidence: "নিরাপত্তা",
    estimatedDelay: "য়ৌবদা ৱাৎকদবা মতম",
    weatherImpact: "নোংগী ফিভম",

    fleetTrackerTitle: "লাইভ জিপিএস অমসুং হিদাক-লাংথক কোল্ড-চেন ত্র্যাকিং",
    activeVehicles: "চৎলিবা গারীশিং",
    altitude: "ৱাংবা",
    speed: "স্পীদ",
    cargoTemp: "টেম্পারেচর",
    fuelLevel: "ফুয়েল লেভেল",
    eta: "য়ৌগদবা মতম",

    incidentFormTitle: "ফিল্ড ওফিসার অমসুং মীয়ামগী রিপোর্তিং",
    incidentSubtext: "নেতৱার্ক য়াওদবদা সেভ তৌগনি, নেতৱার্ক ফংবদা ওতো-সিঙ্ক ওইগনি।",
    incidentType: "থৌদোক্কী মখল",
    severityLevel: "ফিভমগী কনবা",
    coordinates: "জিপিএস কোওর্ডিনেত",
    getGpsBtn: "জিপিএস লৌবিয়ু",
    incidentDesc: "অকুপ্পা মরোল",
    submitReportBtn: "রিপোর্ত থাবিয়ু",
    syncQueueBtn: "অফলাইন ডাটা সিঙ্ক তৌবিয়ু",

    alertsTitle: "লাইভ ইমার্জেন্সি এলাৰ্ত",
    emergencyBroadcastBtn: "ইমার্জেন্সি এলাৰ্ত থাবিয়ু",
    verifiedAlert: "ভেরিফাই তৌরবা রিপোর্ত"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('ner_lang') || 'en';
    this.subscribers = [];
  }

  setLanguage(lang) {
    if (I18N_DATA[lang]) {
      this.currentLang = lang;
      localStorage.setItem('ner_lang', lang);
      this.applyTranslations();
      this.subscribers.forEach(cb => cb(lang));
    }
  }

  get(key) {
    return I18N_DATA[this.currentLang]?.[key] || I18N_DATA['en']?.[key] || key;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(elem => {
      const key = elem.getAttribute('data-i18n');
      const text = this.get(key);
      if (text) {
        elem.innerText = text;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-placeholder');
      const text = this.get(key);
      if (text) {
        elem.setAttribute('placeholder', text);
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-title');
      const text = this.get(key);
      if (text) {
        elem.setAttribute('title', text);
      }
    });
  }
}

// Global instance
window.i18n = new I18nManager();
