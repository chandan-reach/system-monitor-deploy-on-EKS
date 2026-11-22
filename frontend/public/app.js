const API_BASE = "http://localhost:5000";
const $ = (id) => document.getElementById(id);
function progress(id, value){$(id).style.width = `${Math.max(0,Math.min(100,Number(value)||0))}%`;}
function uptime(s){const d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),sec=s%60;return `${d}d ${h}h ${m}m ${sec}s`;}
function service(name,ok){$(`${name}-indicator`).className=`indicator ${ok?"ok":"fail"}`;$(`${name}-health`).textContent=ok?"Healthy":"Unavailable";$(`${name}-health`).className=ok?"":"fail";}
async function loadMetrics(){
 try{
  const r=await fetch(`${API_BASE}/metrics`);if(!r.ok)throw Error(`HTTP ${r.status}`);const d=await r.json();
  $("cpu-value").textContent=d.cpu.percent.toFixed(1);$("cpu-cores").textContent=`${d.cpu.logical_cores} logical cores`;progress("cpu-bar",d.cpu.percent);
  $("memory-value").textContent=d.memory.percent.toFixed(1);$("memory-detail").textContent=`${d.memory.used_mb} / ${d.memory.total_mb} MB`;progress("memory-bar",d.memory.percent);
  $("disk-value").textContent=d.disk.percent.toFixed(1);$("disk-detail").textContent=`${d.disk.used_gb} / ${d.disk.total_gb} GB`;progress("disk-bar",d.disk.percent);
  $("uptime-value").textContent=uptime(d.uptime_seconds);
  $("upload-rate").textContent=`${d.network.upload_kbps} KB/s`;$("download-rate").textContent=`${d.network.download_kbps} KB/s`;$("sent-total").textContent=`${d.network.sent_mb} MB`;$("received-total").textContent=`${d.network.received_mb} MB`;
  $("api-status").textContent="API connected";$("system-status").textContent="Monitoring is active";$("system-message").textContent="Latest system metrics received successfully.";$("status-tag").textContent="OPERATIONAL";$("updated").textContent=`Updated ${new Date(d.timestamp).toLocaleTimeString()}`;service("backend",true);
 }catch(e){console.error(e);$("api-status").textContent="API unavailable";$("system-status").textContent="Cannot reach Flask backend";$("system-message").textContent="Start Flask and check port 5000.";$("status-tag").textContent="DEGRADED";$("updated").textContent="Waiting for backend";service("backend",false);}
}
async function checkFrontend(){try{const r=await fetch("/health");service("frontend",r.ok);}catch{service("frontend",false);}}
async function refresh(){await Promise.all([loadMetrics(),checkFrontend()]);}
refresh();setInterval(refresh,3000);
