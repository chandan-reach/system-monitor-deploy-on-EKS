const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, "public");

app.use(express.static(publicDirectory));
app.get("/", (req, res) => res.json({status: "healthy", service: "devops-monitor-frontend"}));
app.use((req, res) => res.sendFile(path.join(publicDirectory, "index.html")));

app.listen(PORT, "0.0.0.0", () => console.log(`Frontend running at http://localhost:${PORT}`));
