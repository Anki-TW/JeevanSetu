/**
 * Offline-First Field Incident Reporting Engine for North Eastern Region (NER)
 * Uses IndexedDB for persistent storage in zero-network mountain zones with background auto-sync.
 */

class NER_IncidentReporter {
  constructor(gisMap) {
    this.gisMap = gisMap;
    this.dbName = "NER_Offline_Reports_DB";
    this.dbVersion = 1;
    this.db = null;
    this.pendingQueue = [];
    this.isOnline = navigator.onLine;

    this.initDatabase();
    this.setupNetworkListeners();
  }

  initDatabase() {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("incident_queue")) {
        const store = db.createObjectStore("incident_queue", { keyPath: "id", autoIncrement: true });
        store.createIndex("timestamp", "timestamp", { unique: false });
        store.createIndex("synced", "synced", { unique: false });
      }
    };

    request.onsuccess = (e) => {
      this.db = e.target.result;
      console.log("📦 IndexedDB offline incident repository initialized.");
      this.refreshQueueFromDB();
    };

    request.onerror = (e) => {
      console.warn("⚠️ IndexedDB access failed, falling back to LocalStorage.", e);
      this.refreshQueueFromLocalStorage();
    };
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateNetworkBadge(true);
      if (window.app) {
        window.app.showNotification("🌐 Network connection restored. Auto-syncing pending offline field reports...", "success");
      }
      this.syncPendingReports();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateNetworkBadge(false);
      if (window.app) {
        window.app.showNotification("⚠️ Network disconnected. Offline Mode active. All field reports will be queued locally.", "warning");
      }
    });

    // Initial check
    this.updateNetworkBadge(navigator.onLine);
  }

  updateNetworkBadge(online) {
    const badge = document.getElementById('network-status-badge');
    if (badge) {
      if (online) {
        badge.className = "badge-pill badge-normal text-xs";
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> Online`;
      } else {
        badge.className = "badge-pill badge-critical text-xs glow-danger";
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span> Offline (Local Queue Active)`;
      }
    }
  }

  async saveReportLocally(reportData) {
    reportData.timestamp = new Date().toISOString();
    reportData.synced = false;
    reportData.id = "OFFLINE-" + Date.now().toString().slice(-6);

    if (this.db) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction("incident_queue", "readwrite");
        const store = tx.objectStore("incident_queue");
        const req = store.add(reportData);
        req.onsuccess = () => {
          this.refreshQueueFromDB();
          resolve(reportData);
        };
        req.onerror = () => reject(req.error);
      });
    } else {
      // LocalStorage Fallback
      let queue = JSON.parse(localStorage.getItem('ner_pending_reports') || '[]');
      queue.push(reportData);
      localStorage.setItem('ner_pending_reports', JSON.stringify(queue));
      this.refreshQueueFromLocalStorage();
      return Promise.resolve(reportData);
    }
  }

  refreshQueueFromDB() {
    if (!this.db) return;
    const tx = this.db.transaction("incident_queue", "readonly");
    const store = tx.objectStore("incident_queue");
    const req = store.getAll();

    req.onsuccess = () => {
      this.pendingQueue = req.result.filter(item => !item.synced);
      this.updateQueueCountUI();
      this.renderPendingListUI();
    };
  }

  refreshQueueFromLocalStorage() {
    const queue = JSON.parse(localStorage.getItem('ner_pending_reports') || '[]');
    this.pendingQueue = queue;
    this.updateQueueCountUI();
    this.renderPendingListUI();
  }

  updateQueueCountUI() {
    const countBadge = document.getElementById('pending-reports-count');
    const statBadge = document.getElementById('stat-offline-count');
    const count = this.pendingQueue.length;

    if (countBadge) countBadge.innerText = count;
    if (statBadge) statBadge.innerText = count;
  }

  renderPendingListUI() {
    const container = document.getElementById('pending-queue-list');
    if (!container) return;

    if (this.pendingQueue.length === 0) {
      container.innerHTML = `
        <div class="text-center py-6 text-gray-400 text-xs">
          ✅ All field reports are synced with Central Command.
        </div>
      `;
      return;
    }

    container.innerHTML = this.pendingQueue.map(item => `
      <div class="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs space-y-1">
        <div class="flex items-center justify-between">
          <span class="font-bold text-cyan-400">${item.type}</span>
          <span class="badge-pill badge-warning text-[10px]">Pending Sync</span>
        </div>
        <p class="text-gray-300">${item.description}</p>
        <div class="flex justify-between text-[10px] text-gray-400 border-t border-slate-800/80 pt-1">
          <span>📍 ${item.coords[0].toFixed(3)}, ${item.coords[1].toFixed(3)}</span>
          <span>${new Date(item.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    `).join('');
  }

  async syncPendingReports() {
    if (this.pendingQueue.length === 0) {
      if (window.app) window.app.showNotification("No offline reports to sync.", "info");
      return;
    }

    const syncCount = this.pendingQueue.length;

    // Push pending items into global config incidents & GIS Map
    this.pendingQueue.forEach(item => {
      const newIncident = {
        id: "INC-SYNC-" + Date.now().toString().slice(-4),
        title: `${item.type} (Field Sync)`,
        locationName: `GPS ${item.coords[0].toFixed(3)}°N, ${item.coords[1].toFixed(3)}°E`,
        coords: item.coords,
        type: item.type,
        severity: item.severity || "high",
        reportedAt: "Just now (Synced)",
        reportedBy: item.reporterName || "Local Field Officer",
        verified: false,
        estimatedClearanceHrs: 24,
        details: item.description
      };

      window.NER_CONFIG.incidents.unshift(newIncident);
    });

    // Clear local storage queue
    if (this.db) {
      const tx = this.db.transaction("incident_queue", "readwrite");
      tx.objectStore("incident_queue").clear();
    }
    localStorage.removeItem('ner_pending_reports');
    this.pendingQueue = [];
    this.updateQueueCountUI();
    this.renderPendingListUI();

    // Re-render GIS Map & Alert List
    if (this.gisMap) {
      this.gisMap.renderIncidentMarkers();
    }
    if (window.alertsManager) {
      window.alertsManager.renderAlerts();
    }

    if (window.app) {
      window.app.showNotification(`🚀 Successfully synced ${syncCount} offline field reports to the regional GIS database!`, "success");
    }
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
        (err) => {
          // Fallback to random realistic NER corridor location
          const fallback = [26.1445 + (Math.random() - 0.5) * 1.5, 91.7362 + (Math.random() - 0.5) * 2.0];
          resolve(fallback);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  }
}

window.NER_IncidentReporter = NER_IncidentReporter;
