from flask import Flask, jsonify
from flask_cors import CORS
import psutil
import time
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app)
START_TIME = time.time()
_previous_net = psutil.net_io_counters()
_previous_net_time = time.time()

@app.get("/")
def health():
    return jsonify({"status": "healthy", "service": "devops-monitor-api"})

@app.get("/metrics")
def metrics():
    global _previous_net, _previous_net_time
    cpu = psutil.cpu_percent(interval=None)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    current_net = psutil.net_io_counters()
    now = time.time()
    elapsed = max(now - _previous_net_time, 0.001)
    upload = (current_net.bytes_sent - _previous_net.bytes_sent) / elapsed / 1024
    download = (current_net.bytes_recv - _previous_net.bytes_recv) / elapsed / 1024
    _previous_net, _previous_net_time = current_net, now
    return jsonify({
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "cpu": {"percent": cpu, "logical_cores": psutil.cpu_count(logical=True)},
        "memory": {"total_mb": round(memory.total / 1048576, 1), "used_mb": round(memory.used / 1048576, 1), "available_mb": round(memory.available / 1048576, 1), "percent": memory.percent},
        "disk": {"total_gb": round(disk.total / 1073741824, 2), "used_gb": round(disk.used / 1073741824, 2), "free_gb": round(disk.free / 1073741824, 2), "percent": disk.percent},
        "network": {"sent_mb": round(current_net.bytes_sent / 1048576, 2), "received_mb": round(current_net.bytes_recv / 1048576, 2), "upload_kbps": round(upload, 2), "download_kbps": round(download, 2)},
        "uptime_seconds": int(now - START_TIME)
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
