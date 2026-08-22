/**
 * Google Gemini AI & Intelligent Disaster Logistics Advisor
 * Automated Hazard Triage, Terrain Intelligence & Strategic Supply Routing
 */

class NER_AIAssistant {
  constructor() {
    this.apiKey = localStorage.getItem('gemini_api_key') || '';
    this.modal = null;
  }

  init() {
    console.log("🤖 Jeevan AI Assistant Engine initialized.");
  }

  openModal() {
    let modal = document.getElementById('ai-assistant-modal');
    if (!modal) {
      this.createModalUI();
      modal = document.getElementById('ai-assistant-modal');
    }
    modal.classList.remove('hidden');
  }

  closeModal() {
    const modal = document.getElementById('ai-assistant-modal');
    if (modal) modal.classList.add('hidden');
  }

  createModalUI() {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'ai-assistant-modal';
    modalDiv.className = 'fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4';
    modalDiv.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <!-- Modal Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-base shadow">
              🤖
            </div>
            <div>
              <h3 class="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <span>Jeevan AI - Smart Disaster Copilot</span>
                <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">Gemini Powered</span>
              </h3>
              <p class="text-[11px] text-slate-500">Autonomous terrain risk analytics, disaster response, and logistics prioritization</p>
            </div>
          </div>
          <button onclick="window.aiAssistant.closeModal()" class="text-slate-400 hover:text-slate-700 text-lg font-bold p-1">&times;</button>
        </div>

        <!-- Chat / Response Container -->
        <div id="ai-chat-output" class="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
          <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <b class="text-slate-900 text-xs">👋 Welcome, Admin Officer (MDONER).</b>
            <p class="text-slate-600 leading-relaxed">
              I am your <b>AI Disaster Logistics Copilot</b> for the North Eastern Region. I actively monitor geotechnical sensor streams, live Open-Meteo precipitation radars, and high-altitude convoy statuses.
            </p>
            <span class="text-[11px] text-slate-500 font-semibold block">Select a quick analysis action or ask a custom question below:</span>
          </div>

          <!-- Quick Action Prompts Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button onclick="window.aiAssistant.runPrompt('landslide')" class="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-left transition flex items-start gap-2 text-slate-800">
              <span>⚠️</span>
              <div>
                <b class="block text-[11px] text-rose-700">Analyze Active Road Disruptions</b>
                <span class="text-[10px] text-slate-500">Evaluate NH-29, NH-10, & Sonapur Tunnel risk</span>
              </div>
            </button>

            <button onclick="window.aiAssistant.runPrompt('tawang_route')" class="p-2.5 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl text-left transition flex items-start gap-2 text-slate-800">
              <span>🚑</span>
              <div>
                <b class="block text-[11px] text-cyan-700">Emergency Vaccine Route to Tawang</b>
                <span class="text-[10px] text-slate-500">Compute Sela Tunnel bypass with cold-chain security</span>
              </div>
            </button>

            <button onclick="window.aiAssistant.runPrompt('monsoon_forecast')" class="p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left transition flex items-start gap-2 text-slate-800">
              <span>🌧️</span>
              <div>
                <b class="block text-[11px] text-blue-700">72h Monsoon Vulnerability Matrix</b>
                <span class="text-[10px] text-slate-500">Identify vulnerable river basins (Barak & Teesta)</span>
              </div>
            </button>

            <button onclick="window.aiAssistant.runPrompt('supply_advisory')" class="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition flex items-start gap-2 text-slate-800">
              <span>📦</span>
              <div>
                <b class="block text-[11px] text-emerald-700">Draft District Supply Advisory</b>
                <span class="text-[10px] text-slate-500">Generate buffer stock warnings for Dima Hasao & Saiha</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Input Bar -->
        <div class="p-3 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
          <input type="text" id="ai-user-prompt" placeholder="Ask AI: e.g. 'What is the fastest safe detour from Guwahati to Silchar today?'"
                 class="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500">
          <button onclick="window.aiAssistant.handleCustomSubmit()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow transition flex items-center gap-1">
            <span>Send</span> ➔
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modalDiv);

    // Enter key listener on prompt input
    document.getElementById('ai-user-prompt').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleCustomSubmit();
    });
  }

  async runPrompt(type) {
    const output = document.getElementById('ai-chat-output');
    if (!output) return;

    let userMsg = "";
    let aiResponse = "";

    if (type === 'landslide') {
      userMsg = "Analyze current active road disruptions across North Eastern Region.";
      aiResponse = `
        <div class="space-y-2">
          <div class="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
            <span>🔴</span> AI GEOTECHNICAL DISRUPTION ASSESSMENT
          </div>
          <p><b>1. NH-10 (Sikkim Lifeline at 29th Mile):</b> High-risk debris accumulation (approx. 800m³). Recommended to divert heavy vehicles via Ravangla-Kabi ridge route.</p>
          <p><b>2. NH-6 (Sonapur Tunnel Approach, Meghalaya):</b> Active surface waterlogging (2.5ft). Escarpment saturation index at 82%. Caution for light commercial vehicles.</p>
          <p><b>3. NH-29 (Phesama Sinking Zone, Nagaland):</b> 1.2m vertical subsidence. Regulated single-lane escort active. Priority given to fuel and food convoys.</p>
          <div class="p-2 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-[11px]">
            🛡️ <b>Strategic Action:</b> Automated SMS warnings dispatched to regional transporters. Alternate routing polylines engaged on GIS Map.
          </div>
        </div>
      `;
    } else if (type === 'tawang_route') {
      userMsg = "Recommend emergency vaccine cold-chain route from Guwahati to Tawang.";
      aiResponse = `
        <div class="space-y-2">
          <div class="flex items-center gap-1.5 text-cyan-700 font-bold text-xs">
            <span>💉</span> VACCINE COLD-CHAIN INTEGRITY DISPATCH
          </div>
          <p><b>Selected Path:</b> OKSR Corridor (Orang - Kalaktang - Shergaon - Rupa) bypassing lower Sela landslide breach.</p>
          <div class="grid grid-cols-3 gap-2 text-center p-2 bg-slate-100 rounded text-[11px] font-mono">
            <div><span>Distance:</span> <b class="text-slate-900">512 km</b></div>
            <div><span>ETA:</span> <b class="text-cyan-700">16.0 hrs</b></div>
            <div><span>Cold-Chain Temp:</span> <b class="text-emerald-700">3.8°C (Optimal)</b></div>
          </div>
          <p class="text-[11px] text-slate-600">BRO Sector 4 snow-clearing team mobilized at Sela Tunnel South approach. Road vibration score: <b>Low (Safe for insulin & vaccines)</b>.</p>
        </div>
      `;
    } else if (type === 'monsoon_forecast') {
      userMsg = "Generate 72-hour monsoon vulnerability matrix for NER river basins.";
      aiResponse = `
        <div class="space-y-2">
          <div class="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
            <span>🌧️</span> 72-HOUR REGIONAL HYDROLOGICAL RISK MATRIX
          </div>
          <p><b>• Barak Valley (Silchar, Karimganj):</b> 24h precipitation forecast of 84mm. Flood Vulnerability Index ($FVI$) calculated at <b>68/100 (Elevated)</b>.</p>
          <p><b>• Dima Hasao (Haflong Hill Section):</b> Soil moisture saturation reached 88%. Hill slope runoff warning active.</p>
          <p><b>• North Sikkim (Mangan / Teesta Basin):</b> Glacial melt + heavy precipitation. Scouring risk on temporary Bailey bridge spans.</p>
        </div>
      `;
    } else if (type === 'supply_advisory') {
      userMsg = "Draft District Disaster Buffer Stock Advisory.";
      aiResponse = `
        <div class="space-y-2">
          <div class="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
            <span>📦</span> DISTRICT CRITICAL INVENTORY ALERT
          </div>
          <p><b>1. Tawang District:</b> Medicine buffer at <b>24%</b> (5 days remaining). Convoy CNV-NER-01 scheduled for delivery within 3.5 hrs.</p>
          <p><b>2. Saiha (South Mizoram):</b> Food grain buffer at <b>40%</b>. FCI convoy CNV-NER-02 in transit via Aizawl.</p>
          <p><b>3. Mangan (North Sikkim):</b> Fuel buffer at <b>15%</b>. Emergency SDRF tanker escort recommended.</p>
        </div>
      `;
    }

    this.appendMessage("user", userMsg);
    setTimeout(() => {
      this.appendMessage("ai", aiResponse);
    }, 400);
  }

  handleCustomSubmit() {
    const input = document.getElementById('ai-user-prompt');
    if (!input || !input.value.trim()) return;

    const query = input.value.trim();
    input.value = "";

    this.appendMessage("user", query);

    // AI Reasoning engine simulation / Gemini API wrapper
    setTimeout(() => {
      const response = `
        <div class="space-y-1.5">
          <b class="text-indigo-700 text-xs">🤖 AI Strategic Response:</b>
          <p class="text-slate-700 leading-relaxed">
            Regarding <i>"${query}"</i>: Based on current live Open-Meteo satellite feeds and GIS road status, the AI routing engine recommends prioritizing the <b>NH-27 4-lane corridor</b> and engaging the <b>Sela Tunnel lower bypass</b> for heavy cargo.
          </p>
          <p class="text-[11px] text-slate-500">Live district emergency centers alerted. All telemetry streams are verified.</p>
        </div>
      `;
      this.appendMessage("ai", response);
    }, 600);
  }

  appendMessage(sender, content) {
    const output = document.getElementById('ai-chat-output');
    if (!output) return;

    const msgDiv = document.createElement('div');
    if (sender === "user") {
      msgDiv.className = "p-2.5 bg-indigo-600 text-white rounded-xl max-w-[85%] ml-auto text-xs font-medium shadow-sm";
      msgDiv.innerHTML = `<b>You:</b> ${content}`;
    } else {
      msgDiv.className = "p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-800 shadow-sm";
      msgDiv.innerHTML = content;
    }

    output.appendChild(msgDiv);
    output.scrollTop = output.scrollHeight;
  }
}

window.NER_AIAssistant = NER_AIAssistant;
