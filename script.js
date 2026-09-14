/* ============================================================
   Cyber Safety Survey — single-page app (vanilla JS, no frameworks)
   ------------------------------------------------------------
   One scrolling page: intro -> About you -> Online Safety Habits
   -> Password Practice (educational, optional) -> Digital Payments
   -> Submit -> Success.
   * All questions/options live in QUESTIONS below (EN + HI + MR).
   * UI text lives in STRINGS (EN + HI + MR). No page reload on
     language change; answers are preserved.
   * Progress auto-saves to localStorage (NEVER the practice
     password — it only ever exists in a local variable / DOM).
   * Submission is isolated in submitSurvey() so a real backend
     (Google Sheets / Firebase / Supabase / REST) can be plugged
     in later via CONFIG.ENDPOINT.
   ============================================================ */
"use strict";

/* ---------------- Backend hook (plug in later) ---------------- */
const CONFIG = {
  // Example: "https://your-api.example.com/survey"
  // Empty string = demo mode (simulates a successful save).
  ENDPOINT: "",
  // Email where every survey response will be sent.
  TO_EMAIL: "writemate.support@gmail.com",
  STORAGE_KEY: "cyberSafetySurveyV1",
};

/* ============================================================
   UI STRINGS — every user-facing chrome string in 3 languages.
   Keep translations simple and friendly, not formal.
   ============================================================ */
const STRINGS = {
  en: {
    skip: "Skip to survey",
    brand: "Cyber Safety Survey",
    footer: "Your answers are anonymous and used only for learning about online safety. 🔒",
    welcomeTitle: "Cyber Safety Awareness Survey",
    welcomeLead:
      "This short survey helps us understand how people stay safe while using the internet, phones and online accounts. There are no right or wrong answers — just answer honestly! Fill everything below and press Submit at the end.",
    badgeTime: "About 3–5 minutes",
    badgeCount: "{n} simple questions",
    badgeAnon: "Anonymous & private",
    sectionAbout: "About you",
    sectionCyber: "Online Safety Habits",
    sectionPractice: "Password Practice",
    sectionPayments: "Digital Payments at Kirana Stores",
    submit: "Submit Survey ✓",
    submitting: "Submitting…",
    done: "Done",
    required: "Required",
    optional: "Optional practice",
    multiHint: "You can choose more than one answer.",
    otherPlaceholder: "Please write here…",
    answeredOf: "Answered {x} of {n}",
    practiceNote: "Practice only — not counted, not saved, not submitted.",
    errChoice: "Please choose one answer.",
    errMulti: "Please choose at least one answer.",
    errText: "Please write your answer.",
    errName: "Please enter your name.",
    errEmailEmpty: "Please enter your email address.",
    errEmailBad: "That email does not look right. Example: name@example.com",
    errOther: "You chose “Other” — please write a few words.",
    errSummary: "Please answer the {n} highlighted question(s), then press Submit again.",
    saved: "✓ Your progress is saved",
    restored: "✓ Welcome back! Your earlier answers were restored.",
    submitFail: "Could not submit. Please check your connection and try again.",
    successTitle: "Survey Submitted!",
    successLead: "Thank you for participating. Your response has been recorded successfully.",
    successSummary: "✓ You answered {n} questions",
    // Password lab
    pwTitle: "Create a strong password",
    pwHint: "Try making a strong password below. This is only practice — nothing is sent or saved anywhere.",
    pwPlaceholder: "Enter password",
    showPw: "Show",
    hidePw: "Hide",
    pwStrength: "Password strength:",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    weakMsg: "⚠️ Your password is weak.",
    mediumMsg: "🟡 Your password is getting stronger.",
    strongMsg: "✅ Your password is strong!",
    adviceWeak: "Try adding: {missing}.",
    adviceMedium: "Almost there! Still missing: {missing}.",
    adviceStrong: "Great job! This password is hard to guess.",
    warnCommon: "This is a very common password — hackers guess it first.",
    warnRepeat: "Avoid repeating the same character again and again (like “aaa”).",
    warnSequence: "Avoid simple sequences (like “1234” or “abcd”).",
    warnPersonal: "Avoid using your own name or email in your password.",
    ruleLength: "At least 8 characters",
    ruleUpper: "One UPPERCASE letter (A–Z)",
    ruleLower: "One lowercase letter (a–z)",
    ruleDigit: "One number (0–9)",
    ruleSpecial: "One special character (@ # $ % & *)",
    deviceNote: "🔒 Your password is checked only on this device and is not submitted with this survey.",
  },

  hi: {
    skip: "सर्वेक्षण पर जाएँ",
    brand: "साइबर सुरक्षा सर्वेक्षण",
    footer: "आपके उत्तर गुमनाम हैं और सिर्फ ऑनलाइन सुरक्षा समझने के लिए इस्तेमाल होंगे। 🔒",
    welcomeTitle: "साइबर सुरक्षा जागरूकता सर्वेक्षण",
    welcomeLead:
      "यह छोटा सर्वेक्षण हमें यह समझने में मदद करता है कि लोग इंटरनेट, फोन और ऑनलाइन खातों का इस्तेमाल करते समय कैसे सुरक्षित रहते हैं। कोई सही-गलत जवाब नहीं है — बस ईमानदारी से जवाब दें! नीचे सब कुछ भरें और आखिर में “जमा करें” दबाएँ।",
    badgeTime: "लगभग 3–5 मिनट",
    badgeCount: "{n} आसान सवाल",
    badgeAnon: "गुमनाम और निजी",
    sectionAbout: "आपके बारे में",
    sectionCyber: "ऑनलाइन सुरक्षा की आदतें",
    sectionPractice: "पासवर्ड का अभ्यास",
    sectionPayments: "किराना दुकान पर डिजिटल पेमेंट",
    submit: "सर्वेक्षण जमा करें ✓",
    submitting: "जमा हो रहा है…",
    done: "हो गया",
    required: "ज़रूरी",
    optional: "सिर्फ अभ्यास",
    multiHint: "आप एक से ज़्यादा जवाब चुन सकते हैं।",
    otherPlaceholder: "कृपया यहाँ लिखें…",
    answeredOf: "{n} में से {x} जवाब दिए",
    practiceNote: "सिर्फ अभ्यास — गिना नहीं जाएगा, सहेजा नहीं जाएगा, जमा नहीं होगा।",
    errChoice: "कृपया एक जवाब चुनें।",
    errMulti: "कृपया कम से कम एक जवाब चुनें।",
    errText: "कृपया अपना जवाब लिखें।",
    errName: "कृपया अपना नाम लिखें।",
    errEmailEmpty: "कृपया अपना ईमेल पता लिखें।",
    errEmailBad: "यह ईमेल सही नहीं लग रहा। उदाहरण: name@example.com",
    errOther: "आपने “अन्य” चुना है — कृपया कुछ शब्द लिखें।",
    errSummary: "कृपया हाइलाइट किए गए {n} सवालों के जवाब दें, फिर से जमा करें दबाएँ।",
    saved: "✓ आपकी प्रगति सहेज ली गई है",
    restored: "✓ फिर से स्वागत है! आपके पहले के जवाब वापस ला दिए गए हैं।",
    submitFail: "जमा नहीं हो पाया। कृपया कनेक्शन जांचकर फिर कोशिश करें।",
    successTitle: "सर्वेक्षण जमा हो गया!",
    successLead: "भाग लेने के लिए धन्यवाद। आपका जवाब सफलतापूर्वक दर्ज कर लिया गया है।",
    successSummary: "✓ आपने {n} सवालों के जवाब दिए",
    pwTitle: "मज़बूत पासवर्ड बनाकर देखें",
    pwHint: "नीचे एक मज़बूत पासवर्ड बनाकर देखें। यह सिर्फ अभ्यास है — यह कहीं भेजा या सहेजा नहीं जाता।",
    pwPlaceholder: "पासवर्ड लिखें",
    showPw: "दिखाएँ",
    hidePw: "छिपाएँ",
    pwStrength: "पासवर्ड की मज़बूती:",
    weak: "कमज़ोर",
    medium: "मध्यम",
    strong: "मज़बूत",
    weakMsg: "⚠️ आपका पासवर्ड कमज़ोर है।",
    mediumMsg: "🟡 आपका पासवर्ड मज़बूत हो रहा है।",
    strongMsg: "✅ आपका पासवर्ड मज़बूत है!",
    adviceWeak: "इसमें जोड़कर देखें: {missing}।",
    adviceMedium: "बस थोड़ा और! अभी कमी है: {missing}।",
    adviceStrong: "बहुत बढ़िया! यह पासवर्ड अंदाज़ा लगाना मुश्किल है।",
    warnCommon: "यह बहुत आम पासवर्ड है — हैकर इसे सबसे पहले आज़माते हैं।",
    warnRepeat: "एक ही अक्षर बार-बार न दोहराएँ (जैसे “aaa”)।",
    warnSequence: "आसान क्रम न रखें (जैसे “1234” या “abcd”)।",
    warnPersonal: "पासवर्ड में अपना नाम या ईमेल न रखें।",
    ruleLength: "कम से कम 8 अक्षर",
    ruleUpper: "एक बड़ा अक्षर (A–Z)",
    ruleLower: "एक छोटा अक्षर (a–z)",
    ruleDigit: "एक नंबर (0–9)",
    ruleSpecial: "एक खास निशान (@ # $ % & *)",
    deviceNote: "🔒 आपका पासवर्ड सिर्फ इसी डिवाइस पर जांचा जाता है और सर्वेक्षण के साथ जमा नहीं होता।",
  },

  mr: {
    skip: "सर्वेक्षणाकडे जा",
    brand: "सायबर सुरक्षा सर्वेक्षण",
    footer: "तुमची उत्तरे गुमनाम आहेत आणि फक्त ऑनलाइन सुरक्षेसाठी वापरली जातील। 🔒",
    welcomeTitle: "सायबर सुरक्षा जनजागृती सर्वेक्षण",
    welcomeLead:
      "हे छोटे सर्वेक्षण लोक इंटरनेट, फोन आणि ऑनलाइन खाती वापरताना कसे सुरक्षित राहतात हे समजण्यासाठी आहे. बरोबर-चूक असे काही नाही — फक्त प्रामाणिकपणे उत्तर द्या! खालील सर्व भरा आणि शेवटी “सादर करा” दाबा.",
    badgeTime: "सुमारे 3–5 मिनिटे",
    badgeCount: "{n} सोपे प्रश्न",
    badgeAnon: "गुमनाम आणि खाजगी",
    sectionAbout: "तुमच्याबद्दल",
    sectionCyber: "ऑनलाइन सुरक्षेच्या सवयी",
    sectionPractice: "पासवर्डचा सराव",
    sectionPayments: "किराणा दुकानात डिजिटल पेमेंट",
    submit: "सर्वेक्षण सादर करा ✓",
    submitting: "सादर होत आहे…",
    done: "झाले",
    required: "आवश्यक",
    optional: "फक्त सराव",
    multiHint: "तुम्ही एकापेक्षा जास्त उत्तरे निवडू शकता.",
    otherPlaceholder: "कृपया येथे लिहा…",
    answeredOf: "{n} पैकी {x} उत्तरे दिली",
    practiceNote: "फक्त सराव — मोजला जाणार नाही, जतन होणार नाही, सादर होणार नाही.",
    errChoice: "कृपया एक उत्तर निवडा.",
    errMulti: "कृपया किमान एक उत्तर निवडा.",
    errText: "कृपया तुमचे उत्तर लिहा.",
    errName: "कृपया तुमचे नाव लिहा.",
    errEmailEmpty: "कृपया तुमचा ईमेल पत्ता लिहा.",
    errEmailBad: "हा ईमेल बरोबर वाटत नाही. उदाहरण: name@example.com",
    errOther: "तुम्ही “इतर” निवडले आहे — कृपया थोडे लिहा.",
    errSummary: "कृपया हाइलाइट केलेल्या {n} प्रश्नांची उत्तरे द्या आणि पुन्हा सादर करा दाबा.",
    saved: "✓ तुमची प्रगती जतन केली आहे",
    restored: "✓ परत स्वागत आहे! तुमची आधीची उत्तरे परत आणली आहेत.",
    submitFail: "सादर करता आले नाही. कृपया कनेक्शन तपासून पुन्हा प्रयत्न करा.",
    successTitle: "सर्वेक्षण सादर झाले!",
    successLead: "सहभागाबद्दल धन्यवाद. तुमचे उत्तर यशस्वीरित्या नोंदवले गेले आहे.",
    successSummary: "✓ तुम्ही {n} प्रश्नांची उत्तरे दिलीत",
    pwTitle: "मजबूत पासवर्ड बनवून पाहा",
    pwHint: "खाली एक मजबूत पासवर्ड बनवून पाहा. हा फक्त सराव आहे — तो कुठेही पाठवला किंवा जतन केला जात नाही.",
    pwPlaceholder: "पासवर्ड लिहा",
    showPw: "दाखवा",
    hidePw: "लपवा",
    pwStrength: "पासवर्डची मजबुती:",
    weak: "कमकुवत",
    medium: "मध्यम",
    strong: "मजबूत",
    weakMsg: "⚠️ तुमचा पासवर्ड कमकुवत आहे.",
    mediumMsg: "🟡 तुमचा पासवर्ड मजबूत होत आहे.",
    strongMsg: "✅ तुमचा पासवर्ड मजबूत आहे!",
    adviceWeak: "यात घालून पाहा: {missing}.",
    adviceMedium: "जवळजवळ झाले! अजून कमी आहे: {missing}.",
    adviceStrong: "छान! हा पासवर्ड ओळखणे अवघड आहे.",
    warnCommon: "हा खूप सामान्य पासवर्ड आहे — हॅकर तो आधी आजमावतात.",
    warnRepeat: "तेच अक्षर पुन्हा पुन्हा टाळा (जसे “aaa”).",
    warnSequence: "सोपा क्रम टाळा (जसे “1234” किंवा “abcd”).",
    warnPersonal: "पासवर्डमध्ये तुमचे नाव किंवा ईमेल ठेवू नका.",
    ruleLength: "किमान 8 अक्षरे",
    ruleUpper: "एक मोठे अक्षर (A–Z)",
    ruleLower: "एक लहान अक्षर (a–z)",
    ruleDigit: "एक अंक (0–9)",
    ruleSpecial: "एक विशेष चिन्ह (@ # $ % & *)",
    deviceNote: "🔒 तुमचा पासवर्ड फक्त याच डिव्हाइसवर तपासला जातो आणि सर्वेक्षणासोबत सादर होत नाही.",
  },
};

/* ============================================================
   QUESTIONS — every question from BOTH Google Forms, verbatim
   meaning and options, in EN + HI + MR.
   Types: text | email | radio | checkbox | radio-other |
          checkbox-other | password-lab
   (Q9 of the kirana form is multi-select in this UI because the
   question asks for "measures" (plural); all options preserved.)
   ============================================================ */
const ALL_QUESTIONS = [
  /* ---------- Profile (from both forms: Name + Email from Form A;
     Name + Age Group + Gender + Stream/Course from Form B) ---------- */
  {
    id: "name", section: "about", type: "text", required: true,
    i18n: {
      en: { q: "What is your name?", placeholder: "Enter your full name" },
      hi: { q: "आपका नाम क्या है?", placeholder: "अपना पूरा नाम लिखें" },
      mr: { q: "तुमचे नाव काय आहे?", placeholder: "तुमचे पूर्ण नाव लिहा" },
    },
  },
  {
    id: "email", section: "about", type: "email", required: true,
    i18n: {
      en: { q: "What is your email address?", placeholder: "Enter your email address" },
      hi: { q: "आपका ईमेल पता क्या है?", placeholder: "अपना ईमेल पता लिखें" },
      mr: { q: "तुमचा ईमेल पत्ता काय आहे?", placeholder: "तुमचा ईमेल पत्ता लिहा" },
    },
  },
  {
    id: "age", section: "about", type: "radio", required: true,
    i18n: {
      en: { q: "How old are you?", options: ["Below 18", "18-20", "21-23", "Above 23"] },
      hi: { q: "आपकी उम्र कितनी है?", options: ["18 से कम", "18–20", "21–23", "23 से अधिक"] },
      mr: { q: "तुमचे वय किती?", options: ["18 पेक्षा कमी", "18–20", "21–23", "23 पेक्षा जास्त"] },
    },
  },
  {
    id: "gender", section: "about", type: "radio-other", required: true,
    i18n: {
      en: { q: "Are you male or female?", options: ["Male", "Female", "Don't want to say", "Other"] },
      hi: { q: "आप पुरुष हैं या महिला?", options: ["पुरुष", "महिला", "नहीं बताना चाहते", "अन्य"] },
      mr: { q: "तुम्ही पुरुष आहात की स्त्री?", options: ["पुरुष", "स्त्री", "सांगू इच्छित नाही", "इतर"] },
    },
  },
  {
    id: "stream", section: "about", type: "radio", required: false,
    i18n: {
      en: { q: "Which class or course are you in?", options: ["B.Sc IT", "B.Com", "B.A / B.Sc", "BCA", "Others"] },
      hi: { q: "आप किस क्लास / कोर्स में हैं?", options: ["B.Sc IT", "B.Com", "B.A / B.Sc", "BCA", "अन्य"] },
      mr: { q: "तुम्ही कोणत्या वर्गात / कोर्सला आहात?", options: ["B.Sc IT", "B.Com", "B.A / B.Sc", "BCA", "इतर"] },
    },
  },

  /* ---------- Form A: Cyber Hygiene Practices (15 questions) ---------- */
  {
    id: "a1", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "How often do you change your password?", options: ["Every month", "Every 3-6 months", "Once a year", "I rarely change it"] },
      hi: { q: "आप कितनी बार अपना पासवर्ड बदलते हैं?", options: ["हर महीने", "हर 3–6 महीने में", "साल में एक बार", "मैं बहुत कम बदलता हूँ"] },
      mr: { q: "तुम्ही पासवर्ड किती वेळा बदलता?", options: ["दर महिन्याला", "दर 3–6 महिन्यांनी", "वर्षातून एकदा", "मी क्वचितच बदलतो"] },
    },
  },
  {
    id: "a2", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "What is your password like?", options: ["Simple one (easy to guess)", "Letters and numbers mixed", "Letters, numbers and symbols (@#$) mixed", "I use the same password everywhere"] },
      hi: { q: "आपका पासवर्ड कैसा होता है?", options: ["आसान वाला (अंदाज़ा लगाना आसान)", "अक्षर और नंबर मिलाकर", "अक्षर, नंबर और निशान (@#$) मिलाकर", "हर जगह एक ही पासवर्ड"] },
      mr: { q: "तुमचा पासवर्ड कसा असतो?", options: ["सोपा (ओळखायला सोपा)", "अक्षरे आणि अंक मिळून", "अक्षरे, अंक आणि चिन्हे (@#$) मिळून", "सगळीकडे एकच पासवर्ड"] },
    },
  },
  {
    id: "a3", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "How do you keep your online accounts safe?", options: ["Only a password", "Password + code on my phone (2FA)", "Only security questions", "No extra safety"] },
      hi: { q: "आप अपने ऑनलाइन खाते कैसे सुरक्षित रखते हैं?", options: ["सिर्फ पासवर्ड से", "पासवर्ड + फोन पर कोड / OTP (2FA)", "सिर्फ सुरक्षा सवालों से", "कोई extra सुरक्षा नहीं"] },
      mr: { q: "तुमची ऑनलाइन खाती कशी सुरक्षित ठेवता?", options: ["फक्त पासवर्डने", "पासवर्ड + फोनवर कोड / OTP (2FA)", "फक्त सुरक्षा प्रश्नांनी", "जास्त सुरक्षा नाही"] },
    },
  },
  {
    id: "a4", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "You get an unknown link in a message. What do you do?", options: ["I open it at once", "I forward it to friends", "I check the sender and link first", "I download the file with it"] },
      hi: { q: "मैसेज में कोई अनजान लिंक आए तो क्या करते हैं?", options: ["तुरंत खोल लेता हूँ", "दोस्तों को भेज देता हूँ", "पहले भेजने वाले और लिंक को जांचता हूँ", "साथ वाली फाइल डाउनलोड कर लेता हूँ"] },
      mr: { q: "मेसेजमध्ये अनोळखी लिंक आली तर काय करता?", options: ["लगेच उघडतो", "मित्रांना पाठवतो", "आधी पाठवणारा आणि लिंक तपासतो", "सोबतची फाईल डाउनलोड करतो"] },
    },
  },
  {
    id: "a5", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "How often do you update your mobile/computer software?", options: ["Immediately when an update is available", "After a few weeks", "Only when necessary", "Rarely"] },
      hi: { q: "मोबाइल / कंप्यूटर का सॉफ्टवेयर कितनी बार अपडेट करते हैं?", options: ["अपडेट आते ही तुरंत", "कुछ हफ़्तों बाद", "सिर्फ ज़रूरत पड़ने पर", "शायद ही कभी"] },
      mr: { q: "मोबाईल / कॉम्प्युटरचे सॉफ्टवेअर किती वेळा अपडेट करता?", options: ["अपडेट आल्यावर लगेच", "काही आठवड्यांनंतर", "गरज असेल तेव्हाच", "क्वचितच"] },
    },
  },
  {
    id: "a6", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "Where do you usually download applications?", options: ["Official app stores", "Websites found through search", "Links received on social media", "Any available website"] },
      hi: { q: "ऐप्स आमतौर पर कहाँ से डाउनलोड करते हैं?", options: ["आधिकारिक ऐप स्टोर से", "सर्च में मिली वेबसाइटों से", "सोशल मीडिया पर मिले लिंक से", "किसी भी वेबसाइट से"] },
      mr: { q: "अ‍ॅप्स सहसा कुठून डाउनलोड करता?", options: ["अधिकृत अ‍ॅप स्टोअरमधून", "शोधात सापडलेल्या वेबसाईटवरून", "सोशल मीडियावर आलेल्या लिंकवरून", "कोणत्याही वेबसाईटवरून"] },
    },
  },
  {
    id: "a7", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "When you use free public Wi-Fi (hotel, station, mall), what do you do?", options: ["I use it for everything", "I use it only for simple browsing", "I don't do bank or money work on it", "I share my personal details openly"] },
      hi: { q: "फ्री पब्लिक Wi-Fi (होटल, स्टेशन, मॉल) इस्तेमाल करते समय क्या करते हैं?", options: ["सब कुछ इस्तेमाल करता हूँ", "सिर्फ साधारण कामों के लिए", "उस पर बैंक / पैसे का काम नहीं करता", "अपनी निजी जानकारी खुलकर देता हूँ"] },
      mr: { q: "फ्री सार्वजनिक Wi-Fi (हॉटेल, स्टेशन, मॉल) वापरताना काय करता?", options: ["सगळ्यासाठी वापरतो", "फक्त साध्या कामांसाठी", "त्यावर बँक / पैशाचे काम करत नाही", "खाजगी माहिती मोकळेपणाने देतो"] },
    },
  },
  {
    id: "a8", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "How often do you back up important data?", options: ["Weekly", "Monthly", "Occasionally", "Never"] },
      hi: { q: "ज़रूरी डेटा का बैकअप कितनी बार लेते हैं?", options: ["हर हफ़्ते", "हर महीने", "कभी-कभी", "कभी नहीं"] },
      mr: { q: "महत्त्वाच्या डेटाचा बॅकअप किती वेळा घेता?", options: ["दर आठवड्याला", "दर महिन्याला", "कधीतरी", "कधीच नाही"] },
    },
  },
  {
    id: "a9", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "Someone asks for your OTP in a message. What do you do?", options: ["I share the OTP", "I ask a friend first", "I ignore it or report it", "I reply and ask why they need it"] },
      hi: { q: "कोई मैसेज में आपसे OTP माँगे तो क्या करेंगे?", options: ["OTP बता दूँगा", "पहले दोस्त से पूछूँगा", "नज़रअंदाज़ करूँगा या रिपोर्ट करूँगा", "जवाब में पूछूँगा कि OTP क्यों चाहिए"] },
      mr: { q: "कोणी मेसेजमध्ये OTP मागितला तर काय कराल?", options: ["OTP सांगेन", "आधी मित्राला विचारेन", "दुर्लक्ष करीन किंवा तक्रार करीन", "उत्तर देऊन OTP का हवा ते विचारेन"] },
    },
  },
  {
    id: "a10", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "How do you know if a website is safe?", options: ["I look for the 🔒 lock and https in the address", "I trust it if it looks nice", "I open it without checking", "I fill my details first, ask someone later"] },
      hi: { q: "वेबसाइट सुरक्षित है या नहीं, यह कैसे पता करते हैं?", options: ["पते में ताला 🔒 और https देखकर", "अच्छी दिखे तो भरोसा कर लेता हूँ", "बिना जांचे खोल लेता हूँ", "पहले जानकारी भरता हूँ, बाद में पूछता हूँ"] },
      mr: { q: "वेबसाईट सुरक्षित आहे का हे कसे ओळखता?", options: ["पत्त्यात कुलूप 🔒 आणि https पाहून", "छान दिसली तर विश्वास ठेवतो", "न तपासता उघडतो", "आधी माहिती भरतो, नंतर विचारतो"] },
    },
  },
  {
    id: "a11", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "How often do you review your social-media privacy settings?", options: ["Every month", "Every few months", "Once a year", "Never"] },
      hi: { q: "सोशल मीडिया की प्राइवेसी सेटिंग कितनी बार जांचते हैं?", options: ["हर महीने", "कुछ महीनों में एक बार", "साल में एक बार", "कभी नहीं"] },
      mr: { q: "सोशल मीडियाच्या प्रायव्हसी सेटिंग्ज किती वेळा तपासता?", options: ["दर महिन्याला", "काही महिन्यांतून एकदा", "वर्षातून एकदा", "कधीच नाही"] },
    },
  },
  {
    id: "a12", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "What is the safest way to manage multiple passwords?", options: ["Use the same password everywhere", "Write passwords publicly", "Use a trusted password manager", "Share passwords with friends"] },
      hi: { q: "कई पासवर्ड संभालने का सबसे सुरक्षित तरीका क्या है?", options: ["हर जगह एक ही पासवर्ड रखना", "पासवर्ड खुलेआम लिखकर रखना", "भरोसेमंद पासवर्ड मैनेजर इस्तेमाल करना", "पासवर्ड दोस्तों से साझा करना"] },
      mr: { q: "अनेक पासवर्ड सांभाळण्याचा सर्वात सुरक्षित मार्ग कोणता?", options: ["सगळीकडे एकच पासवर्ड वापरणे", "पासवर्ड उघडपणे लिहून ठेवणे", "विश्वासार्ह पासवर्ड मॅनेजर वापरणे", "पासवर्ड मित्रांसोबत शेअर करणे"] },
    },
  },
  {
    id: "a13", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "What would you do if your account showed suspicious activity?", options: ["Ignore it", "Change the password and secure the account", "Share the account with someone", "Continue using it normally"] },
      hi: { q: "खाते में कोई शक भरी गतिविधि दिखे तो क्या करेंगे?", options: ["ध्यान नहीं दूँगा", "पासवर्ड बदलकर खाता सुरक्षित करूँगा", "खाता किसी और से साझा करूँगा", "वैसे ही इस्तेमाल करता रहूँगा"] },
      mr: { q: "खात्यात संशयास्पद हालचाल दिसली तर काय कराल?", options: ["दुर्लक्ष करीन", "पासवर्ड बदलून खाते सुरक्षित करीन", "खाते कोणासोबत तरी शेअर करीन", "तसेच वापरत राहीन"] },
    },
  },
  {
    id: "a14", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "What is the best way to improve cyber hygiene among college students and faculty?", options: ["Regular cyber-security awareness programs", "Ignoring online threats", "Sharing passwords with others", "Using public Wi-Fi for sensitive work"] },
      hi: { q: "कॉलेज के छात्रों और शिक्षकों में साइबर सुरक्षा की समझ बढ़ाने का सबसे अच्छा तरीका क्या है?", options: ["नियमित साइबर-सुरक्षा जागरूकता कार्यक्रम", "ऑनलाइन खतरों को नज़रअंदाज़ करना", "पासवर्ड दूसरों से साझा करना", "संवेदनशील काम के लिए पब्लिक Wi-Fi इस्तेमाल करना"] },
      mr: { q: "कॉलेज विद्यार्थी आणि शिक्षकांमध्ये सायबर सुरक्षेची जाणीव वाढवण्याचा उत्तम मार्ग कोणता?", options: ["नियमित सायबर-सुरक्षा जनजागृती कार्यक्रम", "ऑनलाइन धोक्यांकडे दुर्लक्ष करणे", "पासवर्ड इतरांसोबत शेअर करणे", "संवेदनशील कामासाठी सार्वजनिक Wi-Fi वापरणे"] },
    },
  },
  {
    id: "a15", section: "cyber", type: "radio", required: true,
    i18n: {
      en: { q: "Overall, how would you rate your cyber hygiene practices?", options: ["Excellent", "Good", "Average", "Poor"] },
      hi: { q: "कुल मिलाकर अपनी साइबर सुरक्षा आदतों को क्या रेटिंग देंगे?", options: ["बहुत बढ़िया", "अच्छी", "ठीक-ठाक", "खराब"] },
      mr: { q: "एकंदरीत तुमच्या सायबर सवयींना काय गुण द्याल?", options: ["उत्कृष्ट", "चांगल्या", "साधारण", "खराब"] },
    },
  },

  /* ---------- Password practice lab (educational interlude —
     NOT a survey question, NOT saved, NOT submitted) ---------- */
  { id: "pwlab", section: "practice", type: "password-lab", required: false, i18n: {} },

  /* ---------- Form B: Digital Payments at Kirana Stores (10 questions) ---------- */
  {
    id: "b1", section: "payments", type: "radio", required: true,
    i18n: {
      en: { q: "How often do you pay by phone at the kirana shop?", options: ["Always", "Sometimes", "Often", "Rarely"] },
      hi: { q: "किराना दुकान पर फोन से पेमेंट कितनी बार करते हैं?", options: ["हमेशा", "कभी-कभी", "अक्सर", "शायद ही कभी"] },
      mr: { q: "किराणा दुकानात फोनने पेमेंट किती वेळा करता?", options: ["नेहमी", "कधीकधी", "अनेकदा", "क्वचितच"] },
    },
  },
  {
    id: "b2", section: "payments", type: "checkbox", required: true,
    i18n: {
      en: { q: "How do you pay at the kirana shop?", options: ["UPI", "Debit/Credit cards", "Mobile wallet", "QR Code payment"] },
      hi: { q: "किराना दुकान पर कैसे पेमेंट करते हैं?", options: ["UPI", "डेबिट / क्रेडिट कार्ड", "मोबाइल वॉलेट", "QR कोड पेमेंट"] },
      mr: { q: "किराणा दुकानात कसे पेमेंट करता?", options: ["UPI", "डेबिट / क्रेडिट कार्ड", "मोबाईल वॉलेट", "QR कोड पेमेंट"] },
    },
  },
  {
    id: "b3", section: "payments", type: "radio", required: true,
    i18n: {
      en: { q: "Which UPI app do you mostly use?", options: ["Google Pay", "PhonePe", "Paytm", "QR code problem"] },
      hi: { q: "कौन-सा UPI ऐप सबसे ज़्यादा इस्तेमाल करते हैं?", options: ["Google Pay", "PhonePe", "Paytm", "QR कोड समस्या"] },
      mr: { q: "कोणते UPI अ‍ॅप जास्त वापरता?", options: ["Google Pay", "PhonePe", "Paytm", "QR कोड समस्या"] },
    },
  },
  {
    id: "b4", section: "payments", type: "checkbox-other", required: true,
    i18n: {
      en: { q: "Why do you prefer digital payments at kirana stores?", options: ["Fast and convenient", "No need to carry cash", "Secure", "Other"] },
      hi: { q: "किराना दुकान पर डिजिटल पेमेंट क्यों पसंद करते हैं?", options: ["तेज़ और सुविधाजनक", "नकद रखने की ज़रूरत नहीं", "सुरक्षित है", "अन्य"] },
      mr: { q: "किराणा दुकानात डिजिटल पेमेंट का आवडते?", options: ["जलद आणि सोयीस्कर", "रोख पैसे बाळगायची गरज नाही", "सुरक्षित आहे", "इतर"] },
    },
  },
  {
    id: "b5", section: "payments", type: "radio", required: true,
    i18n: {
      en: { q: "How safe do you feel when paying by phone?", options: ["Very safe", "Safe", "Not sure", "Unsafe"] },
      hi: { q: "फोन से पेमेंट करते समय कितना सुरक्षित महसूस करते हैं?", options: ["बहुत सुरक्षित", "सुरक्षित", "पता नहीं", "असुरक्षित"] },
      mr: { q: "फोनने पेमेंट करताना किती सुरक्षित वाटते?", options: ["खूप सुरक्षित", "सुरक्षित", "माहित नाही", "असुरक्षित"] },
    },
  },
  {
    id: "b6", section: "payments", type: "radio", required: true,
    i18n: {
      en: { q: "Did you ever face any problem while paying by phone?", options: ["Yes", "No"] },
      hi: { q: "क्या फोन से पेमेंट करते समय कभी कोई दिक्कत आई?", options: ["हाँ", "नहीं"] },
      mr: { q: "फोनने पेमेंट करताना कधी अडचण आली का?", options: ["होय", "नाही"] },
    },
  },
  {
    id: "b7", section: "payments", type: "radio", required: true,
    i18n: {
      en: { q: "What type of digital payment problems have you experienced?", options: ["Payment failed", "Wrong amount entered", "QR code problem", "Other"] },
      hi: { q: "किस तरह की पेमेंट दिक्कतें आई हैं?", options: ["पेमेंट फेल हो गया", "गलत रकम डाल दी", "QR कोड की दिक्कत", "अन्य"] },
      mr: { q: "कोणत्या प्रकारच्या अडचणी आल्या?", options: ["पेमेंट फेल झाले", "चुकीची रक्कम टाकली", "QR कोडची अडचण", "इतर"] },
    },
  },
  {
    id: "b8", section: "payments", type: "radio", required: true,
    i18n: {
      en: { q: "Are you concerned about fraud or scams while using digital payments?", options: ["Very Concerned", "Concerned", "Neutral", "Not Concerned", "Not at all Concerned"] },
      hi: { q: "डिजिटल पेमेंट में धोखाधड़ी / ठगी को लेकर कितने चिंतित हैं?", options: ["बहुत ज़्यादा चिंतित", "चिंतित", "ठीक-ठाक", "चिंतित नहीं", "बिल्कुल चिंतित नहीं"] },
      mr: { q: "डिजिटल पेमेंटमधील फसवणुकीबद्दल किती काळजी वाटते?", options: ["खूप जास्त काळजी", "काळजी वाटते", "ठीक-ठाक", "काळजी नाही", "अजिबात काळजी नाही"] },
    },
  },
  {
    id: "b9", section: "payments", type: "checkbox", required: true,
    i18n: {
      en: { q: "What care do you take while paying by phone?", options: ["I check the amount before paying", "I check the QR code and shopkeeper", "I keep my phone locked", "I read the payment message", "None"] },
      hi: { q: "फोन से पेमेंट करते समय क्या सावधानी रखते हैं?", options: ["पेमेंट से पहले रकम देखता हूँ", "QR कोड और दुकानदार जांचता हूँ", "फोन में लॉक रखता हूँ", "पेमेंट वाला मैसेज पढ़ता हूँ", "कोई नहीं"] },
      mr: { q: "फोनने पेमेंट करताना कोणती काळजी घेता?", options: ["पेमेंटआधी रक्कम पाहतो", "QR कोड आणि दुकानदार तपासतो", "फोनला लॉक ठेवतो", "पेमेंटचा मेसेज वाचतो", "काहीच नाही"] },
    },
  },
  {
    id: "b10", section: "payments", type: "radio", required: true,
    i18n: {
      en: { q: "Do you think kirana store owners need more awareness about digital payment security?", options: ["Yes", "No", "Maybe"] },
      hi: { q: "क्या किराना दुकानदारों को डिजिटल पेमेंट सुरक्षा की और जानकारी चाहिए?", options: ["हाँ", "नहीं", "शायद"] },
      mr: { q: "किराणा दुकानदारांना डिजिटल पेमेंट सुरक्षेबद्दल अधिक माहिती हवी आहे का?", options: ["होय", "नाही", "कदाचित"] },
    },
  },
];

/* Short survey: only the most important questions are shown.
   Everything else stays translated below — to bring a question
   back, just add its id to KEEP. */
const KEEP = new Set([
  "name", "email", "age", "gender", "stream",       // profile
  "a1", "a2", "a3", "a4", "a7", "a9", "a10",        // cyber hygiene essentials
  "pwlab",                                          // password practice (optional)
  "b1", "b2", "b5", "b6", "b9",                     // payment safety essentials
]);
const QUESTIONS = ALL_QUESTIONS.filter((q) => KEEP.has(q.id));

/* Steps that count as real survey questions (password lab excluded) */
const COUNTED = QUESTIONS.filter((q) => q.type !== "password-lab");

/* ============================================================
   STATE + AUTOSAVE (localStorage — answers + language only)
   The practice password is NEVER written here.
   ============================================================ */
const state = {
  lang: "en",
  submitted: false,
  answers: {}, // { questionId: string | string[] | {value, other} | {values, other} }
  restored: false,
};

function saveProgress(silent) {
  try {
    localStorage.setItem(
      CONFIG.STORAGE_KEY,
      JSON.stringify({ lang: state.lang, answers: state.answers })
    );
  } catch (e) { /* private mode etc. — survey still works */ }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    return data;
  } catch (e) { return null; }
}

function clearProgress() {
  try { localStorage.removeItem(CONFIG.STORAGE_KEY); } catch (e) {}
}

/* ============================================================
   I18N helpers
   ============================================================ */
function t(key, vars) {
  let s = (STRINGS[state.lang] && STRINGS[state.lang][key]) || STRINGS.en[key] || key;
  if (vars) for (const k of Object.keys(vars)) s = s.replace("{" + k + "}", vars[k]);
  return s;
}
function qt(q) {
  return q.i18n[state.lang] || q.i18n.en;
}

/* ============================================================
   PASSWORD STRENGTH — 100% client-side, never stored/sent.
   Returns { score (0-5), level, passed: {rule:bool}, warnings: [] }
   ============================================================ */
const COMMON_PASSWORDS = [
  "password", "12345678", "123456789", "qwerty", "abc123", "password1",
  "letmein", "welcome", "admin123", "iloveyou", "11111111", "00000000",
  "87654321", "123123123", "password123", "qwerty123",
];

function evaluatePassword(pw, personalBits) {
  const passed = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
  let score = Object.values(passed).filter(Boolean).length;
  const warnings = [];
  const lower = pw.toLowerCase();

  if (pw && COMMON_PASSWORDS.includes(lower)) {
    warnings.push("common");
    score = Math.min(score, 1); // common passwords are always weak
  }
  if (/(.)\1{2,}/i.test(pw)) warnings.push("repeat"); // aaa, 111 (any case)
  if (/(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwer)/i.test(pw)) warnings.push("sequence");
  if (personalBits) {
    for (const bit of personalBits) {
      if (bit && bit.length >= 3 && lower.includes(bit.toLowerCase())) { warnings.push("personal"); break; }
    }
  }

  let level = "weak";
  if (score >= 5 && warnings.length === 0) level = "strong";
  else if (score >= 3) level = "medium";
  if (pw.length === 0) level = "weak";
  return { score, level, passed, warnings };
}

/* ============================================================
   RENDERING — one scrolling page with every question.
   ============================================================ */
const app = () => document.getElementById("app");

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function isAnswered(q) {
  const a = state.answers[q.id];
  if (a == null) return false;
  if (Array.isArray(a)) return a.length > 0;
  if (typeof a === "object") return !!(a.value || (a.values && a.values.length > 0));
  return String(a).trim().length > 0;
}

function answeredCount() {
  return COUNTED.filter(isAnswered).length;
}

function sectionName(section) {
  if (section === "about") return t("sectionAbout");
  if (section === "cyber") return t("sectionCyber");
  if (section === "practice") return t("sectionPractice");
  return t("sectionPayments");
}

/* Question number shown on the card: profile fields are unnumbered,
   Form A keeps 1–15, Form B keeps 1–10 (as in the source forms). */
function questionLabel(q) {
  if (q.section === "about") return "";
  if (q.section === "cyber") return "Q" + (QUESTIONS.filter((x) => x.section === "cyber").indexOf(q) + 1);
  if (q.section === "payments") return "Q" + (QUESTIONS.filter((x) => x.section === "payments").indexOf(q) + 1);
  return "";
}

function render(resetScroll = true) {
  // Chrome follows the language instantly — no page reload.
  document.documentElement.lang = state.lang;
  document.getElementById("brandName").textContent = t("brand");
  document.getElementById("footerText").textContent = t("footer");
  document.getElementById("skipLink").textContent = t("skip");
  document.querySelectorAll(".lang-btn").forEach((b) => {
    const active = b.dataset.lang === state.lang;
    b.classList.toggle("is-active", active);
    b.setAttribute("aria-pressed", String(active));
  });

  if (state.submitted) renderSuccess();
  else renderForm();
  if (resetScroll) window.scrollTo({ top: 0 });
}

/* Line-art icons (no emoji): eye open / eye shut for the password field. */
const EYE_OPEN = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6" fill="currentColor"/></svg>`;
const EYE_SHUT = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 4l16 16M9.9 6.2A9.6 9.6 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-3 3.7M6 8.2A16 16 0 0 0 2.5 12S6 18.2 12 18.2c1.1 0 2.2-.2 3.1-.6"/></svg>`;

/* ---------- Full single-page form ---------- */
function renderForm() {
  const sections = ["about", "cyber", "practice", "payments"];
  app().innerHTML = `
    <section class="card hero" aria-labelledby="wTitle">
      <div class="hero-mark" aria-hidden="true">
        <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M12 2.5 4.5 5.8v5c0 4.8 3.2 8.9 7.5 10.4 4.3-1.5 7.5-5.6 7.5-10.4v-5L12 2.5z"/>
          <path d="m8.8 11.8 2.3 2.3 4.2-4.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 id="wTitle">${esc(t("welcomeTitle"))}</h1>
      <p class="lead">${esc(t("welcomeLead"))}</p>
      <ul class="info-badges">
        <li>${esc(t("badgeTime"))}</li>
        <li>${esc(t("badgeCount", { n: COUNTED.length }))}</li>
        <li>${esc(t("badgeAnon"))}</li>
      </ul>
      <p class="privacy-note">${esc(t("footer"))}</p>
      ${state.restored ? `<p class="autosave" role="status">${esc(t("restored"))}</p>` : ""}
    </section>

    ${sections.map((s, i) => `
      <h2 class="section-head"><span class="sec-num">0${i + 1}</span><span>${esc(sectionName(s))}</span><span class="sec-rule" aria-hidden="true"></span></h2>
      ${QUESTIONS.filter((q) => q.section === s).map((q) => cardHTML(q)).join("")}
    `).join("")}

    <section class="card submit-card" aria-labelledby="submitTitle">
      <h2 class="q-title" id="submitTitle">${esc(t("submit"))}</h2>
      <p class="q-hint" id="submitHint">${esc(t("answeredOf", { x: answeredCount(), n: COUNTED.length }))}</p>
      <div class="error-box" id="submitErr" role="alert" tabindex="-1"></div>
      <button class="btn btn-success btn-block" id="submitBtn" type="button">${esc(t("submit"))}</button>
    </section>

    <div class="sticky-bar">
      <div class="sticky-info">
        <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="stickyProg" aria-label="${esc(t("answeredOf", { x: 0, n: COUNTED.length }))}">
          <div class="progress-fill" id="stickyFill" style="width:0%"></div>
        </div>
        <div class="sticky-text" id="stickyText" aria-live="polite"></div>
      </div>
      <button class="btn btn-success" id="stickySubmit" type="button">${esc(t("submit"))}</button>
    </div>`;

  wireForm();
  updateProgress();
  state.restored = false;
}

function cardHTML(q) {
  if (q.type === "password-lab") return pwLabHTML();
  const txt = qt(q);
  const num = questionLabel(q);
  const badge = q.required
    ? `<span class="required-badge">${esc(t("required"))}</span>`
    : `<span class="optional-badge">${esc(t("optional"))}</span>`;
  let field = "";

  if (q.type === "text" || q.type === "email") {
    const a = state.answers[q.id];
    field = `
      <label class="field-label" for="in-${q.id}">${num ? `<span class="q-num">${esc(num)}</span> ` : ""}${esc(txt.q)} ${badge}</label>
      <input class="field-input" id="in-${q.id}" data-q="${q.id}" type="${q.type === "email" ? "email" : "text"}"
        value="${esc(typeof a === "string" ? a : "")}"
        placeholder="${esc(txt.placeholder || "")}" autocomplete="${q.type === "email" ? "email" : "name"}" />`;
  } else {
    const multi = q.type === "checkbox" || q.type === "checkbox-other";
    const hasOther = q.type === "radio-other" || q.type === "checkbox-other";
    const a = state.answers[q.id];
    const group = q.type.startsWith("radio") ? "radiogroup" : "group";
    field = `
      <fieldset class="options" data-q="${q.id}" role="${group}" aria-label="${esc(txt.q)}">
        <legend>
          ${num ? `<span class="q-num">${esc(num)}</span> ` : ""}<span class="q-title-sm">${esc(txt.q)}</span> ${badge}
        </legend>
        ${multi ? `<p class="q-hint">${esc(t("multiHint"))}</p>` : ""}
        ${txt.options.map((opt, i) => {
          const isOther = hasOther && i === txt.options.length - 1;
          let checked = false;
          if (multi && Array.isArray(a)) checked = a.includes(String(i));
          else if (multi && a && a.values) checked = a.values.includes(String(i));
          else if (!multi && a && typeof a === "object") checked = a.value === String(i);
          else if (!multi && typeof a === "string") checked = a === String(i);
          return `
          <label class="option-card">
            <input type="${multi ? "checkbox" : "radio"}" name="q-${q.id}" value="${i}" ${checked ? "checked" : ""} />
            <span>${esc(opt)}</span>
            <span class="option-marker" aria-hidden="true">${multi ? "✓" : "●"}</span>
          </label>
          ${isOther ? `
          <div class="other-input-wrap" id="other-${q.id}" ${checked ? "" : "hidden"}>
            <label class="q-hint" for="otherin-${q.id}" style="margin-bottom:4px;display:block;">${esc(opt)} —</label>
            <input class="field-input" style="margin-top:0;" id="otherin-${q.id}" data-other="${q.id}" type="text"
              placeholder="${esc(t("otherPlaceholder"))}"
              value="${esc((a && a.other) || "")}" />
          </div>` : ""}`;
        }).join("")}
      </fieldset>`;
  }

  return `
    <section class="card q-card" id="card-${q.id}" aria-label="${esc(txt.q)}">
      <span class="done-tick" aria-hidden="true">✓</span>
      ${field}
      <div class="error-box" id="err-${q.id}" tabindex="-1"></div>
    </section>`;
}

/* ---------- Password practice lab card ----------
   NOTE: the typed password lives ONLY in the input element and a
   local variable. It is never written to state.answers,
   localStorage, or the submission payload. */
function pwLabHTML() {
  return `
    <section class="card q-card" id="card-pwlab" aria-labelledby="pwTitle">
      <span class="section-pill practice">${esc(t("optional"))} · ${esc(t("practiceNote"))}</span>
      <h3 class="q-title-sm" id="pwTitle" style="font-size:22px;margin:6px 0;">${esc(t("pwTitle"))}</h3>
      <p class="q-hint">${esc(t("pwHint"))}</p>
      <div class="pw-wrap">
        <label class="q-hint" for="pwInput" style="font-weight:700;color:var(--ink);">${esc(t("pwTitle"))}</label>
        <input class="field-input" style="padding-right:64px;" id="pwInput" type="password"
          placeholder="${esc(t("pwPlaceholder"))}" autocomplete="new-password" aria-describedby="pwStatus pwRules" />
          <button class="pw-toggle" id="pwToggle" type="button" aria-label="${esc(t("showPw"))}" title="${esc(t("showPw"))}">${EYE_OPEN}</button>
      </div>
      <p class="q-hint" style="margin:14px 0 0;font-weight:700;color:var(--ink);">${esc(t("pwStrength"))}</p>
      <div class="pw-meter" aria-hidden="true"><div class="pw-fill" id="pwFill"></div></div>
      <p class="pw-status" id="pwStatus" role="status" aria-live="polite"></p>
      <p class="pw-advice" id="pwAdvice"></p>
      <ul class="pw-rules" id="pwRules">
        ${["length", "upper", "lower", "digit", "special"].map((r) => `
          <li data-rule="${r}"><span class="tick" aria-hidden="true">✓</span><span>${esc(t("rule" + r[0].toUpperCase() + r.slice(1)))}</span></li>`).join("")}
      </ul>
      <p class="device-note">${esc(t("deviceNote"))}</p>
    </section>`;
}

/* ---------- Wire up all inputs on the page ---------- */
function wireForm() {
  // Text / email inputs: save draft + progress as the user types.
  app().querySelectorAll("input[data-q]").forEach((el) => {
    el.addEventListener("input", () => {
      state.answers[el.dataset.q] = el.value;
      hideCardError(el.dataset.q);
      saveProgress();
      updateProgress();
    });
  });

  // Choice inputs: save, toggle "Other" box, clear error, update progress.
  app().querySelectorAll('fieldset[data-q] input[name^="q-"]').forEach((el) => {
    el.addEventListener("change", () => {
      const qid = el.name.slice(2);
      collectFromCard(qid, true);
      toggleOtherBox(qid);
      hideCardError(qid);
      saveProgress();
      updateProgress();
    });
  });

  // "Other" free-text boxes.
  app().querySelectorAll("input[data-other]").forEach((el) => {
    el.addEventListener("input", () => {
      collectFromCard(el.dataset.other, true);
      hideCardError(el.dataset.other);
      saveProgress();
      updateProgress();
    });
  });

  wirePasswordLab();

  document.getElementById("submitBtn").addEventListener("click", handleSubmit);
  document.getElementById("stickySubmit").addEventListener("click", handleSubmit);
}

function toggleOtherBox(qid) {
  const q = QUESTIONS.find((x) => x.id === qid);
  if (!q || (q.type !== "radio-other" && q.type !== "checkbox-other")) return;
  const last = String(qt(q).options.length - 1);
  const checkedVals = [...app().querySelectorAll(`input[name="q-${qid}"]:checked`)].map((el) => el.value);
  const wrap = document.getElementById(`other-${qid}`);
  if (!wrap) return;
  const show = checkedVals.includes(last);
  wrap.hidden = !show;
  if (show) document.getElementById(`otherin-${qid}`)?.focus();
}

function wirePasswordLab() {
  const input = document.getElementById("pwInput");
  if (!input) return;
  const fill = document.getElementById("pwFill");
  const status = document.getElementById("pwStatus");
  const advice = document.getElementById("pwAdvice");
  const rulesEl = document.getElementById("pwRules");

  // Personal bits only used for a "don't use your own name" warning.
  const personalBits = [
    ...String(state.answers.name || "").toLowerCase().split(/[^a-z\u0900-\u097F]+/).filter((w) => w.length >= 3),
    String(state.answers.email || "").split("@")[0],
  ];

  function refresh() {
    const pw = input.value; // local only — never saved anywhere
    const r = evaluatePassword(pw, personalBits);
    fill.className = "pw-fill " + (pw ? r.level : "");
    fill.style.width = pw ? [8, 28, 50, 68, 86, 100][r.score] + "%" : "0%";
    status.className = "pw-status " + (pw ? r.level : "");
    if (!pw) {
      status.textContent = "";
      advice.textContent = "";
    } else if (r.level === "weak") {
      status.textContent = t("weakMsg");
      advice.textContent = adviceParts(r, "adviceWeak");
    } else if (r.level === "medium") {
      status.textContent = t("mediumMsg");
      advice.textContent = adviceParts(r, "adviceMedium");
    } else {
      status.textContent = t("strongMsg");
      advice.textContent = (r.warnings.length ? warnTexts(r).join(" ") + " " : "") + t("adviceStrong");
    }
    rulesEl.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("done", !!r.passed[li.dataset.rule] && pw.length > 0);
    });
  }
  function adviceParts(r, key) {
    // Only mention "still missing" when rules are actually missing;
    // a password can meet all 5 rules yet be medium due to warnings.
    const parts = [];
    const missing = missingNames(r);
    if (missing) parts.push(t(key, { missing }));
    parts.push(...warnTexts(r));
    return parts.join(" ");
  }
  function missingNames(r) {
    const map = { length: t("ruleLength"), upper: t("ruleUpper"), lower: t("ruleLower"), digit: t("ruleDigit"), special: t("ruleSpecial") };
    return Object.keys(r.passed).filter((k) => !r.passed[k]).map((k) => map[k]).join(", ");
  }
  function warnTexts(r) {
    const map = { common: t("warnCommon"), repeat: t("warnRepeat"), sequence: t("warnSequence"), personal: t("warnPersonal") };
    return r.warnings.map((w) => map[w]);
  }

  input.addEventListener("input", refresh);
  document.getElementById("pwToggle").addEventListener("click", (e) => {
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    e.currentTarget.innerHTML = show ? EYE_SHUT : EYE_OPEN;
    e.currentTarget.setAttribute("aria-label", show ? t("hidePw") : t("showPw"));
    input.focus();
  });
}

/* ---------- Read one card's inputs into state (draft = keep old on empty) ---------- */
function collectFromCard(qid, draft) {
  const q = QUESTIONS.find((x) => x.id === qid);
  if (!q || q.type === "password-lab") return;
  const root = app();

  if (q.type === "text" || q.type === "email") {
    const v = root.querySelector(`#in-${qid}`)?.value ?? "";
    if (v.trim() || !draft) state.answers[qid] = v;
    return;
  }
  const sels = [...root.querySelectorAll(`input[name="q-${qid}"]:checked`)].map((c) => c.value);
  const otherText = root.querySelector(`#otherin-${qid}`)?.value ?? "";
  if (q.type === "radio") {
    if (sels.length) state.answers[qid] = sels[0];
    else if (!draft) delete state.answers[qid];
  } else if (q.type === "checkbox") {
    if (sels.length) state.answers[qid] = sels;
    else if (!draft) delete state.answers[qid];
  } else if (q.type === "radio-other") {
    if (sels.length) state.answers[qid] = { value: sels[0], other: otherText };
    else if (!draft) delete state.answers[qid];
  } else if (q.type === "checkbox-other") {
    if (sels.length) state.answers[qid] = { values: sels, other: otherText };
    else if (!draft) delete state.answers[qid];
  }
}

function harvestAll() {
  COUNTED.forEach((q) => collectFromCard(q.id, true));
}

/* ---------- Validation ---------- */
function validateQuestion(q) {
  collectFromCard(q.id, false);
  if (!q.required) return null; // optional questions (e.g. stream) never block submit
  const a = state.answers[q.id];
  const txt = qt(q);

  if (q.type === "text") {
    if (!a || !String(a).trim()) return q.id === "name" ? t("errName") : t("errText");
    return null;
  }
  if (q.type === "email") {
    if (!a || !String(a).trim()) return t("errEmailEmpty");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(a).trim())) return t("errEmailBad");
    state.answers[q.id] = String(a).trim();
    return null;
  }
  if (q.type === "radio") return a ? null : t("errChoice");
  if (q.type === "checkbox") return a && a.length ? null : t("errMulti");
  if (q.type === "radio-other") {
    if (!a || !a.value) return t("errChoice");
    const last = String(txt.options.length - 1);
    if (a.value === last && !String(a.other || "").trim()) return t("errOther");
    return null;
  }
  if (q.type === "checkbox-other") {
    if (!a || !a.values || !a.values.length) return t("errMulti");
    const last = String(txt.options.length - 1);
    if (a.values.includes(last) && !String(a.other || "").trim()) return t("errOther");
    return null;
  }
  return null;
}

function showCardError(qid, msg) {
  const box = document.getElementById(`err-${qid}`);
  if (!box) return;
  box.innerHTML = `<span aria-hidden="true">⚠️</span><span>${esc(msg)}</span>`;
  box.classList.add("show");
  document.getElementById(`card-${qid}`)?.classList.add("has-error");
}
function hideCardError(qid) {
  const box = document.getElementById(`err-${qid}`);
  if (box) { box.classList.remove("show"); box.innerHTML = ""; }
  document.getElementById(`card-${qid}`)?.classList.remove("has-error");
}

/* ---------- Progress (sticky bar + submit hint) ---------- */
function updateProgress() {
  const done = answeredCount();
  const total = COUNTED.length;
  const pct = Math.round((done / total) * 100);
  const fill = document.getElementById("stickyFill");
  const prog = document.getElementById("stickyProg");
  const txt = document.getElementById("stickyText");
  const hint = document.getElementById("submitHint");
  if (fill) fill.style.width = pct + "%";
  if (prog) {
    prog.setAttribute("aria-valuenow", String(pct));
    prog.setAttribute("aria-label", t("answeredOf", { x: done, n: total }));
  }
  if (txt) txt.textContent = `${t("answeredOf", { x: done, n: total })} · ${pct}%`;
  if (hint) hint.textContent = t("answeredOf", { x: done, n: total });
  // Green ✓ on every answered card — users see progress as they scroll.
  COUNTED.forEach((cq) => {
    document.getElementById(`card-${cq.id}`)?.classList.toggle("is-done", isAnswered(cq));
  });
}

/* ---------- Submit ---------- */
async function handleSubmit(e) {
  const btn = e.currentTarget;
  const errors = [];
  COUNTED.forEach((q) => {
    const err = validateQuestion(q);
    if (err) errors.push({ q, err });
    else hideCardError(q.id);
  });
  saveProgress(true);
  updateProgress();

  const summary = document.getElementById("submitErr");
  if (errors.length) {
    errors.forEach(({ q, err }) => showCardError(q.id, err));
    summary.innerHTML = `<span aria-hidden="true">⚠️</span><span>${esc(t("errSummary", { n: errors.length }))}</span>`;
    summary.classList.add("show");
    // Jump to the first problem so the user never has to hunt for it.
    const first = document.getElementById(`card-${errors[0].q.id}`);
    if (first) {
      first.scrollIntoView({ block: "center" });
      document.getElementById(`err-${errors[0].q.id}`)?.focus({ preventScroll: true });
    }
    return;
  }
  summary.classList.remove("show");
  summary.innerHTML = "";

  btn.disabled = true;
  const original = btn.textContent;
  btn.textContent = t("submitting");
  try {
    await submitSurvey(buildPayload());
    clearProgress();
    state.answers = {};
    state.submitted = true;
    render();
  } catch (err) {
    btn.disabled = false;
    btn.textContent = original;
    summary.innerHTML = `<span aria-hidden="true">⚠️</span><span>${esc(t("submitFail"))}</span>`;
    summary.classList.add("show");
    summary.focus();
  }
}

/* ---------- Success ---------- */
function renderSuccess() {
  app().innerHTML = `
    <section class="card success" aria-labelledby="sTitle">
      <div class="success-mark" aria-hidden="true">
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <circle cx="12" cy="12" r="9.5"/>
          <path d="m8 12.3 2.8 2.8L16.5 9" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 id="sTitle">${esc(t("successTitle"))}</h1>
      <p>${esc(t("successLead"))}</p>
      <div><span class="success-summary">${esc(t("successSummary", { n: COUNTED.length }))}</span></div>
      <button class="btn btn-primary btn-block" id="doneBtn" type="button">${esc(t("done"))}</button>
    </section>`;
  document.getElementById("doneBtn").addEventListener("click", () => {
    state.submitted = false;
    render();
  });
  const h = app().querySelector("h1");
  if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
}

/* ============================================================
   SUBMISSION — kept separate from UI so any backend can plug in.
   The practice password is never part of the payload (it is not
   in state.answers at all).
   ============================================================ */
function answerDisplay(q) {
  const a = state.answers[q.id];
  const txt = qt(q);
  if (a == null || a === "" || (Array.isArray(a) && !a.length)) return null;
  if (typeof a === "string") return a;
  if (Array.isArray(a)) return a.map((i) => txt.options[Number(i)]).join("; ");
  if (a.values) {
    const parts = a.values.map((i) => txt.options[Number(i)]);
    const last = String(txt.options.length - 1);
    if (a.values.includes(last) && a.other) parts[parts.length - 1] += ` (“${a.other}”)`;
    return parts.join("; ");
  }
  if (a.value != null) {
    let s = txt.options[Number(a.value)];
    if (a.other) s += ` (“${a.other}”)`;
    return s;
  }
  return null;
}

function buildPayload() {
  const pick = (id) => {
    const q = QUESTIONS.find((x) => x.id === id);
    const disp = answerDisplay(q);
    return { question: q.i18n.en.q, answer: disp };
  };
  const section = (name) => {
    const o = {};
    QUESTIONS.filter((q) => q.section === name).forEach((q) => { o[q.id] = pick(q.id); });
    return o;
  };
  return {
    language: state.lang,
    submittedAt: new Date().toISOString(),
    profile: section("about"),
    cyberHygiene: section("cyber"),
    digitalPayments: section("payments"),
    // NOTE: no password field exists anywhere in this app.
  };
}

async function submitSurvey(payload) {
  // 1) Email every response to TO_EMAIL via FormSubmit (free, no backend
  //    needed — works on GitHub Pages). First submission triggers a one-time
  //    activation email to writemate.support@gmail.com — click "Activate".
  if (CONFIG.TO_EMAIL) {
    const flat = flattenPayloadForEmail(payload);
    const res = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(CONFIG.TO_EMAIL)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New Cyber Safety Survey response from ${flat["name"] || "Anonymous"}`,
          _template: "table",
          _captcha: "false",
          _replyto: flat["email"] || CONFIG.TO_EMAIL,
          ...flat,
        }),
      }
    );
    if (!res.ok) throw new Error("Email send failed: " + res.status);
    return res.json();
  }

  if (!CONFIG.ENDPOINT) {
    // Demo mode: pretend to save (keeps UI testable offline).
    await new Promise((r) => setTimeout(r, 900));
    return { ok: true };
  }
  const res = await fetch(CONFIG.ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Submit failed: " + res.status);
  return res.json();
}

/* Flatten the nested payload into "Question -> Answer" pairs so the
   email you receive is a readable table (FormSubmit _template: table). */
function flattenPayloadForEmail(payload) {
  const flat = {
    language: payload.language,
    submittedAt: payload.submittedAt,
  };
  for (const group of [payload.profile, payload.cyberHygiene, payload.digitalPayments]) {
    if (!group) continue;
    for (const id of Object.keys(group)) {
      const item = group[id];
      if (!item) continue;
      // Key = "id — question", value = answer (readable in inbox).
      flat[`${id} — ${item.question}`] = item.answer ?? "";
    }
  }
  // Shortcuts so subject/reply-to are easy.
  try {
    flat["name"] = payload.profile?.name?.answer || "";
    flat["email"] = payload.profile?.email?.answer || "";
  } catch (e) {}
  return flat;
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.addEventListener("click", () => {
      if (state.lang === b.dataset.lang) return;
      harvestAll(); // keep everything typed on screen
      state.lang = b.dataset.lang;
      saveProgress(true);
      render(false); // same page, same scroll position, no reload
      restoreInputs();
    });
  });
  const saved = loadProgress();
  if (saved) {
    if (["en", "hi", "mr"].includes(saved.lang)) state.lang = saved.lang;
    if (saved.answers && typeof saved.answers === "object") {
      state.answers = saved.answers;
      state.restored = Object.keys(saved.answers).length > 0;
    }
  }
  render();
}

/* After a language re-render, put saved answers back into the DOM. */
function restoreInputs() {
  COUNTED.forEach((q) => {
    const a = state.answers[q.id];
    if (a == null) return;
    if (typeof a === "string") {
      const el = document.getElementById(`in-${q.id}`);
      if (el) el.value = a;
    } else if (Array.isArray(a)) {
      a.forEach((v) => {
        const el = app().querySelector(`input[name="q-${q.id}"][value="${v}"]`);
        if (el) el.checked = true;
      });
    } else {
      const vals = a.values || (a.value != null ? [a.value] : []);
      vals.forEach((v) => {
        const el = app().querySelector(`input[name="q-${q.id}"][value="${v}"]`);
        if (el) el.checked = true;
      });
      if (a.other) {
        const oi = document.getElementById(`otherin-${q.id}`);
        if (oi) oi.value = a.other;
        const wrap = document.getElementById(`other-${q.id}`);
        if (wrap) wrap.hidden = false;
      }
    }
  });
  updateProgress();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}

/* Export pure logic for automated tests (harmless in browsers). */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { evaluatePassword, QUESTIONS, COUNTED, STRINGS, buildPayload };
}
