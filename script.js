/* ============================================================
   Kirana Pay Survey — Digital Payments Usage and Security
   Concerns in Local Kirana Stores.
   Single-page app, vanilla JS, no frameworks.
   Sections: About you -> Usage -> Safety & Security -> Submit
   * Questions mirror the Google Form verbatim (EN + HI + MR).
   * Stream/Course is OPTIONAL (not required).
   * UI text in STRINGS (EN + HI + MR). Language switch keeps answers.
   * Autosave to localStorage. Submission via FormSubmit email.
   ============================================================ */
"use strict";

/* ---------------- Backend hook ---------------- */
const CONFIG = {
  ENDPOINT: "",
  TO_EMAIL: "writemate.support@gmail.com",
  STORAGE_KEY: "kiranaPaySurveyV1",
};

/* ============================================================
   UI STRINGS — EN + HI + MR
   ============================================================ */
const STRINGS = {
  en: {
    skip: "Skip to survey",
    brand: "Kirana Pay Survey",
    brandSub: "Kirana stores · UPI · Safety",
    footer: "Anonymous survey for study purposes only. Your details are never shared. 🔒",
    welcomeKicker: "Field study · Local kirana stores",
    welcomeTitle: "Digital Payments Usage & Security Concerns",
    welcomeLead:
      "How do you pay at your local kirana shop — UPI, card, wallet or QR? Have you faced failed payments or fraud? This short survey records real usage and safety concerns. No right or wrong answers!",
    badgeTime: "2–3 minutes",
    badgeCount: "{n} quick questions",
    badgeAnon: "Anonymous",
    sectionAbout: "About you",
    sectionAboutDesc: "Tell us a little about yourself.",
    sectionUsage: "Payments at kirana stores",
    sectionUsageDesc: "How you pay day-to-day.",
    sectionSecurity: "Safety & security",
    sectionSecurityDesc: "Problems, fraud worries and safe habits.",
    submit: "Submit Survey ✓",
    submitting: "Submitting…",
    done: "Done",
    required: "Required",
    optional: "Optional",
    multiHint: "You can choose more than one answer.",
    otherPlaceholder: "Please write here…",
    answeredOf: "Answered {x} of {n}",
    errChoice: "Please choose one answer.",
    errMulti: "Please choose at least one answer.",
    errText: "Please write your answer.",
    errName: "Please enter your name.",
    errOther: "You chose “Other” — please write a few words.",
    errSummary: "Please answer the {n} highlighted question(s), then press Submit again.",
    restored: "✓ Welcome back! Your earlier answers were restored.",
    submitFail: "Could not submit. Please check your connection and try again.",
    successTitle: "Survey Submitted!",
    successLead: "Thank you! Your response about kirana-store digital payments has been recorded.",
    successSummary: "✓ You answered {n} questions",
  },
  hi: {
    skip: "सर्वेक्षण पर जाएँ",
    brand: "किराना पे सर्वेक्षण",
    brandSub: "किराना दुकान · UPI · सुरक्षा",
    footer: "यह सिर्फ पढ़ाई के लिए गुमनाम सर्वेक्षण है। आपकी जानकारी कभी साझा नहीं होगी। 🔒",
    welcomeKicker: "फील्ड स्टडी · स्थानीय किराना दुकानें",
    welcomeTitle: "डिजिटल पेमेंट का इस्तेमाल और सुरक्षा चिंताएँ",
    welcomeLead:
      "आप अपनी किराना दुकान पर कैसे पेमेंट करते हैं — UPI, कार्ड, वॉलेट या QR? क्या पेमेंट फेल हुआ या ठगी हुई? यह छोटा सर्वेक्षण असली इस्तेमाल और सुरक्षा दिक्कतों को दर्ज करता है। कोई सही-गलत जवाब नहीं!",
    badgeTime: "2–3 मिनट",
    badgeCount: "{n} आसान सवाल",
    badgeAnon: "गुमनाम",
    sectionAbout: "आपके बारे में",
    sectionAboutDesc: "अपने बारे में थोड़ा बताएँ।",
    sectionUsage: "किराना दुकान पर पेमेंट",
    sectionUsageDesc: "रोज़मर्रा में आप कैसे पेमेंट करते हैं।",
    sectionSecurity: "सुरक्षा और बचाव",
    sectionSecurityDesc: "दिक्कतें, ठगी की चिंता और सुरक्षित आदतें।",
    submit: "सर्वेक्षण जमा करें ✓",
    submitting: "जमा हो रहा है…",
    done: "हो गया",
    required: "ज़रूरी",
    optional: "वैकल्पिक",
    multiHint: "आप एक से ज़्यादा जवाब चुन सकते हैं।",
    otherPlaceholder: "कृपया यहाँ लिखें…",
    answeredOf: "{n} में से {x} जवाब दिए",
    errChoice: "कृपया एक जवाब चुनें।",
    errMulti: "कृपया कम से कम एक जवाब चुनें।",
    errText: "कृपया अपना जवाब लिखें।",
    errName: "कृपया अपना नाम लिखें।",
    errOther: "आपने “अन्य” चुना है — कृपया कुछ शब्द लिखें।",
    errSummary: "कृपया हाइलाइट किए गए {n} सवालों के जवाब दें, फिर से जमा करें दबाएँ।",
    restored: "✓ फिर से स्वागत है! आपके पहले के जवाब वापस ला दिए गए हैं।",
    submitFail: "जमा नहीं हो पाया। कृपया कनेक्शन जांचकर फिर कोशिश करें।",
    successTitle: "सर्वेक्षण जमा हो गया!",
    successLead: "धन्यवाद! किराना दुकान डिजिटल पेमेंट पर आपका जवाब दर्ज हो गया है।",
    successSummary: "✓ आपने {n} सवालों के जवाब दिए",
  },
  mr: {
    skip: "सर्वेक्षणाकडे जा",
    brand: "किराणा पे सर्वेक्षण",
    brandSub: "किराणा दुकान · UPI · सुरक्षा",
    footer: "हे फक्त अभ्यासासाठी गुमनाम सर्वेक्षण आहे. तुमची माहिती कधीही शेअर केली जाणार नाही. 🔒",
    welcomeKicker: "फील्ड स्टडी · स्थानिक किराणा दुकाने",
    welcomeTitle: "डिजिटल पेमेंटचा वापर व सुरक्षा चिंता",
    welcomeLead:
      "तुम्ही तुमच्या किराणा दुकानात कसे पेमेंट करता — UPI, कार्ड, वॉलेट की QR? पेमेंट फेल झाले का किंवा फसवणूक झाली का? हे छोटे सर्वेक्षण खरा वापर आणि सुरक्षेच्या अडचणी नोंदवते. बरोबर-चूक असे काही नाही!",
    badgeTime: "2–3 मिनिटे",
    badgeCount: "{n} सोपे प्रश्न",
    badgeAnon: "गुमनाम",
    sectionAbout: "तुमच्याबद्दल",
    sectionAboutDesc: "तुमच्याबद्दल थोडे सांगा.",
    sectionUsage: "किराणा दुकानात पेमेंट",
    sectionUsageDesc: "रोज तुम्ही कसे पेमेंट करता।",
    sectionSecurity: "सुरक्षा व बचाव",
    sectionSecurityDesc: "अडचणी, फसवणुकीची चिंता आणि सुरक्षित सवयी।",
    submit: "सर्वेक्षण सादर करा ✓",
    submitting: "सादर होत आहे…",
    done: "झाले",
    required: "आवश्यक",
    optional: "ऐच्छिक",
    multiHint: "तुम्ही एकापेक्षा जास्त उत्तरे निवडू शकता.",
    otherPlaceholder: "कृपया येथे लिहा…",
    answeredOf: "{n} पैकी {x} उत्तरे दिली",
    errChoice: "कृपया एक उत्तर निवडा.",
    errMulti: "कृपया किमान एक उत्तर निवडा.",
    errText: "कृपया तुमचे उत्तर लिहा.",
    errName: "कृपया तुमचे नाव लिहा.",
    errOther: "तुम्ही “इतर” निवडले आहे — कृपया थोडे लिहा.",
    errSummary: "कृपया हाइलाइट केलेल्या {n} प्रश्नांची उत्तरे द्या आणि पुन्हा सादर करा दाबा.",
    restored: "✓ परत स्वागत आहे! तुमची आधीची उत्तरे परत आणली आहेत.",
    submitFail: "सादर करता आले नाही. कृपया कनेक्शन तपासून पुन्हा प्रयत्न करा.",
    successTitle: "सर्वेक्षण सादर झाले!",
    successLead: "धन्यवाद! किराणा दुकान डिजिटल पेमेंटबद्दल तुमचे उत्तर नोंदवले गेले आहे.",
    successSummary: "✓ तुम्ही {n} प्रश्नांची उत्तरे दिलीत",
  },
};

/* ============================================================
   QUESTIONS — mirrors the Google Form:
   https://docs.google.com/forms/d/e/1FAIpQLSdNr8UQoZRY35bEJtg48g_gls-TwlPfBHWoWCnJxEk9A_CBFA/viewform
   Profile: Name, Age Group, Gender, Stream/Course (OPTIONAL here)
   Q1–Q10: usage + security, verbatim options.
   Notes:
   * Form typo "B.AB.Sc" fixed to "B.A / B.Sc".
   * Q3 4th option in the Form ("QR code problem") is a copy-paste
     error — mapped to "Other" with free text so data stays useful.
   * Q9 asks for "measures" (plural) so it is multi-select here.
   Types: text | radio | checkbox | radio-other | checkbox-other
   ============================================================ */
const QUESTIONS = [
  {
    id: "name", section: "about", type: "text", required: true,
    i18n: {
      en: { q: "What is your name?", placeholder: "Enter your full name" },
      hi: { q: "आपका नाम क्या है?", placeholder: "अपना पूरा नाम लिखें" },
      mr: { q: "तुमचे नाव काय आहे?", placeholder: "तुमचे पूर्ण नाव लिहा" },
    },
  },
  {
    id: "age", section: "about", type: "radio", required: true,
    i18n: {
      en: { q: "What is your age group?", options: ["Below 18", "18-20", "21-23", "Above 23"] },
      hi: { q: "आपका आयु समूह क्या है?", options: ["18 से कम", "18–20", "21–23", "23 से अधिक"] },
      mr: { q: "तुमचा वयोगट कोणता?", options: ["18 पेक्षा कमी", "18–20", "21–23", "23 पेक्षा जास्त"] },
    },
  },
  {
    id: "gender", section: "about", type: "radio-other", required: true,
    i18n: {
      en: { q: "What is your gender?", options: ["Male", "Female", "Prefer not to say", "Other"] },
      hi: { q: "आपका लिंग क्या है?", options: ["पुरुष", "महिला", "नहीं बताना चाहते", "अन्य"] },
      mr: { q: "तुमचे लिंग काय आहे?", options: ["पुरुष", "स्त्री", "सांगू इच्छित नाही", "इतर"] },
    },
  },
  {
    id: "stream", section: "about", type: "radio", required: false,
    i18n: {
      en: { q: "What is your Stream / Course?", options: ["B.Sc IT", "B.Com", "B.A / B.Sc", "BCA", "Others"] },
      hi: { q: "आपका स्ट्रीम / कोर्स क्या है?", options: ["B.Sc IT", "B.Com", "B.A / B.Sc", "BCA", "अन्य"] },
      mr: { q: "तुमचा स्ट्रीम / कोर्स कोणता?", options: ["B.Sc IT", "B.Com", "B.A / B.Sc", "BCA", "इतर"] },
    },
  },

  /* ---------- Usage at kirana stores (Form Q1–Q4) ---------- */
  {
    id: "q1", section: "usage", type: "radio", required: true,
    i18n: {
      en: { q: "How often do you use digital payments at local kirana stores?", options: ["Always", "Sometimes", "Often", "Rarely"] },
      hi: { q: "आप स्थानीय किराना दुकान पर डिजिटल पेमेंट कितनी बार करते हैं?", options: ["हमेशा", "कभी-कभी", "अक्सर", "शायद ही कभी"] },
      mr: { q: "स्थानिक किराणा दुकानात डिजिटल पेमेंट किती वेळा करता?", options: ["नेहमी", "कधीकधी", "अनेकदा", "क्वचितच"] },
    },
  },
  {
    id: "q2", section: "usage", type: "checkbox", required: true,
    i18n: {
      en: { q: "Which digital payment methods do you use at kirana stores?", options: ["UPI", "Debit/Credit cards", "Mobile wallet", "QR Code payment"] },
      hi: { q: "किराना दुकान पर आप कौन-से डिजिटल पेमेंट तरीके इस्तेमाल करते हैं?", options: ["UPI", "डेबिट / क्रेडिट कार्ड", "मोबाइल वॉलेट", "QR कोड पेमेंट"] },
      mr: { q: "किराणा दुकानात कोणत्या डिजिटल पेमेंट पद्धती वापरता?", options: ["UPI", "डेबिट / क्रेडिट कार्ड", "मोबाईल वॉलेट", "QR कोड पेमेंट"] },
    },
  },
  {
    id: "q3", section: "usage", type: "radio-other", required: true,
    i18n: {
      en: { q: "Which UPI app do you mostly use?", options: ["Google Pay", "PhonePe", "Paytm", "Other"] },
      hi: { q: "आप सबसे ज़्यादा कौन-सा UPI ऐप इस्तेमाल करते हैं?", options: ["Google Pay", "PhonePe", "Paytm", "अन्य"] },
      mr: { q: "तुम्ही सर्वात जास्त कोणते UPI अ‍ॅप वापरता?", options: ["Google Pay", "PhonePe", "Paytm", "इतर"] },
    },
  },
  {
    id: "q4", section: "usage", type: "checkbox-other", required: true,
    i18n: {
      en: { q: "Why do you prefer digital payments at kirana stores?", options: ["Fast and convenient", "No need to carry cash", "Secure", "Other"] },
      hi: { q: "किराना दुकान पर डिजिटल पेमेंट क्यों पसंद करते हैं?", options: ["तेज़ और सुविधाजनक", "नकद रखने की ज़रूरत नहीं", "सुरक्षित है", "अन्य"] },
      mr: { q: "किराणा दुकानात डिजिटल पेमेंट का आवडते?", options: ["जलद आणि सोयीस्कर", "रोख पैसे बाळगायची गरज नाही", "सुरक्षित आहे", "इतर"] },
    },
  },

  /* ---------- Safety & security (Form Q5–Q10) ---------- */
  {
    id: "q5", section: "security", type: "radio", required: true,
    i18n: {
      en: { q: "How safe do you feel while making digital payments?", options: ["Very Safe", "Safe", "Neutral", "Unsafe"] },
      hi: { q: "डिजिटल पेमेंट करते समय आप कितना सुरक्षित महसूस करते हैं?", options: ["बहुत सुरक्षित", "सुरक्षित", "ठीक-ठाक", "असुरक्षित"] },
      mr: { q: "डिजिटल पेमेंट करताना किती सुरक्षित वाटते?", options: ["खूप सुरक्षित", "सुरक्षित", "ठीक-ठाक", "असुरक्षित"] },
    },
  },
  {
    id: "q6", section: "security", type: "radio", required: true,
    i18n: {
      en: { q: "Have you ever faced a problem while making a digital payment?", options: ["Yes", "No"] },
      hi: { q: "क्या डिजिटल पेमेंट करते समय कभी कोई दिक्कत आई है?", options: ["हाँ", "नहीं"] },
      mr: { q: "डिजिटल पेमेंट करताना कधी अडचण आली का?", options: ["होय", "नाही"] },
    },
  },
  {
    id: "q7", section: "security", type: "radio-other", required: true,
    i18n: {
      en: { q: "What type of digital payment problems have you experienced?", options: ["Payment failed", "Wrong amount entered", "QR code problem", "Other"] },
      hi: { q: "आपको किस तरह की पेमेंट दिक्कतें आई हैं?", options: ["पेमेंट फेल हो गया", "गलत रकम डाल दी", "QR कोड की दिक्कत", "अन्य"] },
      mr: { q: "कोणत्या प्रकारच्या पेमेंट अडचणी आल्या?", options: ["पेमेंट फेल झाले", "चुकीची रक्कम टाकली", "QR कोडची अडचण", "इतर"] },
    },
  },
  {
    id: "q8", section: "security", type: "radio", required: true,
    i18n: {
      en: { q: "Are you concerned about fraud or scams while using digital payments?", options: ["Very Concerned", "Concerned", "Neutral", "Not Concerned", "Not at all Concerned"] },
      hi: { q: "डिजिटल पेमेंट में धोखाधड़ी / ठगी को लेकर कितने चिंतित हैं?", options: ["बहुत ज़्यादा चिंतित", "चिंतित", "ठीक-ठाक", "चिंतित नहीं", "बिल्कुल चिंतित नहीं"] },
      mr: { q: "डिजिटल पेमेंटमधील फसवणुकीबद्दल किती काळजी वाटते?", options: ["खूप जास्त काळजी", "काळजी वाटते", "ठीक-ठाक", "काळजी नाही", "अजिबात काळजी नाही"] },
    },
  },
  {
    id: "q9", section: "security", type: "checkbox", required: true,
    i18n: {
      en: { q: "What security measures do you follow while making digital payments?", options: ["I check the payment amount before paying", "I verify the shopkeeper / QR code", "I keep my phone locked", "I check the transaction message", "None"] },
      hi: { q: "डिजिटल पेमेंट करते समय क्या सावधानी रखते हैं?", options: ["पेमेंट से पहले रकम देखता हूँ", "QR कोड और दुकानदार जांचता हूँ", "फोन में लॉक रखता हूँ", "पेमेंट वाला मैसेज पढ़ता हूँ", "कोई नहीं"] },
      mr: { q: "डिजिटल पेमेंट करताना कोणती काळजी घेता?", options: ["पेमेंटआधी रक्कम पाहतो", "QR कोड आणि दुकानदार तपासतो", "फोनला लॉक ठेवतो", "पेमेंटचा मेसेज वाचतो", "काहीच नाही"] },
    },
  },
  {
    id: "q10", section: "security", type: "radio", required: true,
    i18n: {
      en: { q: "Do you think kirana store owners need more awareness about digital payment security?", options: ["Yes", "No", "Maybe"] },
      hi: { q: "क्या किराना दुकानदारों को डिजिटल पेमेंट सुरक्षा की और जानकारी चाहिए?", options: ["हाँ", "नहीं", "शायद"] },
      mr: { q: "किराणा दुकानदारांना डिजिटल पेमेंट सुरक्षेबद्दल अधिक माहिती हवी आहे का?", options: ["होय", "नाही", "कदाचित"] },
    },
  },
];

/* Only required questions block submit (stream is optional). */
const COUNTED = QUESTIONS.filter((q) => q.required);

/* ============================================================
   STATE + AUTOSAVE
   ============================================================ */
const state = {
  lang: "en",
  submitted: false,
  answers: {},
  restored: false,
};

function saveProgress() {
  try {
    localStorage.setItem(
      CONFIG.STORAGE_KEY,
      JSON.stringify({ lang: state.lang, answers: state.answers })
    );
  } catch (e) { /* private mode — survey still works */ }
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
   RENDERING
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

function sectionMeta(section) {
  if (section === "about") return { title: t("sectionAbout"), desc: t("sectionAboutDesc"), icon: "👤" };
  if (section === "usage") return { title: t("sectionUsage"), desc: t("sectionUsageDesc"), icon: "💳" };
  return { title: t("sectionSecurity"), desc: t("sectionSecurityDesc"), icon: "🛡️" };
}

function questionLabel(q) {
  if (q.section === "about") return "";
  if (q.id[0] === "q") return "Q" + q.id.slice(1);
  return "";
}

function render(resetScroll = true) {
  document.documentElement.lang = state.lang;
  document.getElementById("brandName").textContent = t("brand");
  document.getElementById("brandSub").textContent = t("brandSub");
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

function renderForm() {
  const sections = ["about", "usage", "security"];
  app().innerHTML = `
    <section class="card hero" aria-labelledby="wTitle">
      <p class="hero-kicker">${esc(t("welcomeKicker"))}</p>
      <h1 id="wTitle">${esc(t("welcomeTitle"))}</h1>
      <p class="lead">${esc(t("welcomeLead"))}</p>
      <ul class="info-badges">
        <li>${esc(t("badgeTime"))}</li>
        <li>${esc(t("badgeCount", { n: COUNTED.length }))}</li>
        <li>${esc(t("badgeAnon"))}</li>
      </ul>
      ${state.restored ? `<p class="restored" role="status">${esc(t("restored"))}</p>` : ""}
      <div class="hero-art" aria-hidden="true">
        <div class="pay-chip"><span>UPI</span></div>
        <div class="pay-chip alt"><span>QR ✓</span></div>
        <div class="pay-chip small"><span>₹</span></div>
      </div>
    </section>

    ${sections.map((s, i) => {
      const meta = sectionMeta(s);
      return `
      <div class="section-block">
        <h2 class="section-head">
          <span class="sec-num">0${i + 1}</span>
          <span class="sec-text"><span class="sec-icon">${meta.icon}</span> ${esc(meta.title)}<small>${esc(meta.desc)}</small></span>
          <span class="sec-rule" aria-hidden="true"></span>
        </h2>
        ${QUESTIONS.filter((q) => q.section === s).map((q) => cardHTML(q)).join("")}
      </div>`;
    }).join("")}

    <section class="card submit-card" aria-labelledby="submitTitle">
      <h2 class="q-title" id="submitTitle">${esc(t("submit"))}</h2>
      <p class="q-hint" id="submitHint">${esc(t("answeredOf", { x: answeredCount(), n: COUNTED.length }))}</p>
      <div class="submit-progress"><div class="submit-fill" id="submitFill"></div></div>
      <div class="error-box" id="submitErr" role="alert" tabindex="-1"></div>
      <button class="btn btn-success btn-block" id="submitBtn" type="button">${esc(t("submit"))}</button>
    </section>

    <div class="sticky-bar" id="stickyBar">
      <div class="sticky-info">
        <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="stickyProg">
          <div class="progress-fill" id="stickyFill" style="width:0%"></div>
        </div>
        <div class="sticky-text" id="stickyText" aria-live="polite"></div>
      </div>
      <button class="btn btn-submit" id="stickySubmit" type="button">${esc(t("submit"))}</button>
    </div>`;

  wireForm();
  updateProgress();
  state.restored = false;
}

function cardHTML(q) {
  const txt = qt(q);
  const num = questionLabel(q);
  const badge = q.required
    ? `<span class="required-badge">${esc(t("required"))}</span>`
    : `<span class="optional-badge">${esc(t("optional"))}</span>`;
  let field = "";

  if (q.type === "text") {
    const a = state.answers[q.id];
    field = `
      <label class="field-label" for="in-${q.id}">${esc(txt.q)} ${badge}</label>
      <input class="field-input" id="in-${q.id}" data-q="${q.id}" type="text"
        value="${esc(typeof a === "string" ? a : "")}"
        placeholder="${esc(txt.placeholder || "")}" autocomplete="name" />`;
  } else {
    const multi = q.type === "checkbox" || q.type === "checkbox-other";
    const hasOther = q.type === "radio-other" || q.type === "checkbox-other";
    const a = state.answers[q.id];
    const group = q.type.startsWith("radio") ? "radiogroup" : "group";
    field = `
      <fieldset class="options" data-q="${q.id}" role="${group}" aria-label="${esc(txt.q)}">
        <legend>
          ${num ? `<span class="q-num">${esc(num)}</span>` : ""}<span class="q-title-sm">${esc(txt.q)}</span> ${badge}
        </legend>
        ${multi ? `<p class="q-hint">${esc(t("multiHint"))}</p>` : ""}
        <div class="options-grid">
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
            <span class="opt-text">${esc(opt)}</span>
            <span class="option-marker" aria-hidden="true">✓</span>
          </label>
          ${isOther ? `
          <div class="other-input-wrap" id="other-${q.id}" ${checked ? "" : "hidden"}>
            <input class="field-input other-input" id="otherin-${q.id}" data-other="${q.id}" type="text"
              placeholder="${esc(t("otherPlaceholder"))}"
              value="${esc((a && a.other) || "")}" aria-label="${esc(opt)}" />
          </div>` : ""}`;
        }).join("")}
        </div>
      </fieldset>`;
  }

  return `
    <section class="card q-card" id="card-${q.id}" aria-label="${esc(txt.q)}">
      <span class="done-tick" aria-hidden="true">✓</span>
      ${field}
      <div class="error-box" id="err-${q.id}" tabindex="-1"></div>
    </section>`;
}

/* ---------- Wire up ---------- */
function wireForm() {
  app().querySelectorAll("input[data-q]").forEach((el) => {
    el.addEventListener("input", () => {
      state.answers[el.dataset.q] = el.value;
      hideCardError(el.dataset.q);
      saveProgress();
      updateProgress();
    });
  });

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

  app().querySelectorAll("input[data-other]").forEach((el) => {
    el.addEventListener("input", () => {
      collectFromCard(el.dataset.other, true);
      hideCardError(el.dataset.other);
      saveProgress();
      updateProgress();
    });
  });

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
  wrap.hidden = !checkedVals.includes(last);
}

function collectFromCard(qid, draft) {
  const q = QUESTIONS.find((x) => x.id === qid);
  if (!q) return;
  const root = app();

  if (q.type === "text") {
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
  const streamEl = app().querySelector("#in-stream, input[name='q-stream']:checked");
  const sq = QUESTIONS.find((x) => x.id === "stream");
  if (sq) collectFromCard("stream", true);
}

/* ---------- Validation ---------- */
function validateQuestion(q) {
  collectFromCard(q.id, false);
  if (!q.required) return null;
  const a = state.answers[q.id];
  const txt = qt(q);

  if (q.type === "text") {
    if (!a || !String(a).trim()) return q.id === "name" ? t("errName") : t("errText");
    return null;
  }
  if (q.type === "radio") return a != null && a !== "" ? null : t("errChoice");
  if (q.type === "checkbox") return a && a.length ? null : t("errMulti");
  if (q.type === "radio-other") {
    if (!a || a.value == null || a.value === "") return t("errChoice");
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

/* ---------- Progress ---------- */
function updateProgress() {
  const done = answeredCount();
  const total = COUNTED.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const fill = document.getElementById("stickyFill");
  const prog = document.getElementById("stickyProg");
  const txt = document.getElementById("stickyText");
  const hint = document.getElementById("submitHint");
  const sfill = document.getElementById("submitFill");
  if (fill) fill.style.width = pct + "%";
  if (sfill) sfill.style.width = pct + "%";
  if (prog) {
    prog.setAttribute("aria-valuenow", String(pct));
    prog.setAttribute("aria-label", t("answeredOf", { x: done, n: total }));
  }
  if (txt) txt.textContent = `${t("answeredOf", { x: done, n: total })} · ${pct}%`;
  if (hint) hint.textContent = t("answeredOf", { x: done, n: total });
  COUNTED.forEach((cq) => {
    document.getElementById(`card-${cq.id}`)?.classList.toggle("is-done", isAnswered(cq));
  });
}

/* ---------- Submit ---------- */
async function handleSubmit(e) {
  const btn = e.currentTarget;
  const errors = [];
  QUESTIONS.forEach((q) => {
    const err = validateQuestion(q);
    if (err) errors.push({ q, err });
    else hideCardError(q.id);
  });
  saveProgress();
  updateProgress();

  const summary = document.getElementById("submitErr");
  if (errors.length) {
    errors.forEach(({ q, err }) => showCardError(q.id, err));
    summary.innerHTML = `<span aria-hidden="true">⚠️</span><span>${esc(t("errSummary", { n: errors.length }))}</span>`;
    summary.classList.add("show");
    const first = document.getElementById(`card-${errors[0].q.id}`);
    if (first) {
      first.scrollIntoView({ block: "center", behavior: "smooth" });
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
    console.error("[survey] submit failed:", err);
    const detail =
      err && err.message && /activat/i.test(err.message)
        ? ` First-time setup: open ${CONFIG.TO_EMAIL}, click the FormSubmit "Activate" link (check Spam), then submit again.`
        : err && err.message ? ` (${err.message})` : "";
    summary.innerHTML = `<span aria-hidden="true">⚠️</span><span>${esc(t("submitFail"))}${esc(detail)}</span>`;
    summary.classList.add("show");
    summary.focus();
  }
}

/* ---------- Success ---------- */
function renderSuccess() {
  app().innerHTML = `
    <section class="card success" aria-labelledby="sTitle">
      <div class="success-mark" aria-hidden="true">✓</div>
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
   SUBMISSION payload
   ============================================================ */
function answerDisplay(q) {
  const a = state.answers[q.id];
  const txt = q.i18n.en;
  if (a == null || a === "" || (Array.isArray(a) && !a.length)) return null;
  if (typeof a === "string") {
    if (q.type === "radio") {
      const idx = Number(a);
      if (Number.isInteger(idx) && txt.options && txt.options[idx] != null) return txt.options[idx];
    }
    return a;
  }
  if (Array.isArray(a)) return a.map((i) => txt.options[Number(i)]).join("; ");
  if (a.values) {
    const parts = a.values.map((i) => txt.options[Number(i)]);
    const last = String(txt.options.length - 1);
    if (a.values.includes(last) && a.other) parts[parts.length - 1] += ` (“${a.other}”)`;
    return parts.join("; ");
  }
  if (a.value != null) {
    let s = txt.options[Number(a.value)];
    const last = String(txt.options.length - 1);
    if (String(a.value) === last && a.other) s += ` (“${a.other}”)`;
    else if (a.other && q.type === "radio-other") s += ` (“${a.other}”)`;
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
    form: "Digital Payments Usage and Security Concerns in Local Kirana Stores",
    language: state.lang,
    submittedAt: new Date().toISOString(),
    profile: section("about"),
    usage: section("usage"),
    security: section("security"),
  };
}

async function submitSurvey(payload) {
  if (CONFIG.TO_EMAIL) {
    const flat = flattenPayloadForEmail(payload);
    const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.TO_EMAIL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `New Kirana Pay response from ${flat["name"] || "Anonymous"}`,
        _template: "table",
        _captcha: "false",
        _replyto: CONFIG.TO_EMAIL,
        ...flat,
      }),
    });
    let data = null;
    try { data = await res.json(); }
    catch (e) { if (!res.ok) throw new Error("Email send failed: " + res.status); }
    if (data && String(data.success).toLowerCase() === "false") {
      throw new Error(data.message || "Form needs activation. Check inbox.");
    }
    if (!res.ok) throw new Error("Email send failed: " + res.status);
    return data || { ok: true };
  }
  if (!CONFIG.ENDPOINT) {
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

function flattenPayloadForEmail(payload) {
  const flat = { language: payload.language, submittedAt: payload.submittedAt };
  for (const group of [payload.profile, payload.usage, payload.security]) {
    if (!group) continue;
    for (const id of Object.keys(group)) {
      const item = group[id];
      if (!item) continue;
      flat[`${id} — ${item.question}`] = item.answer ?? "";
    }
  }
  try {
    flat["name"] = payload.profile?.name?.answer || "";
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
      harvestAll();
      state.lang = b.dataset.lang;
      saveProgress();
      render(false);
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

function restoreInputs() {
  QUESTIONS.forEach((q) => {
    const a = state.answers[q.id];
    if (a == null) return;
    if (typeof a === "string") {
      const el = document.getElementById(`in-${q.id}`);
      if (el) el.value = a;
      else {
        const radio = app().querySelector(`input[name="q-${q.id}"][value="${a}"]`);
        if (radio) radio.checked = true;
      }
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

if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTIONS, COUNTED, STRINGS, buildPayload };
}
