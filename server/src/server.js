const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "algoflow_secret_key";

// ---------- MIDDLEWARE ----------
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// ---------- HEALTH CHECK ----------
app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send("AlgoFlow backend is running 🚀");
});

// ---------- IN-MEMORY USER STORE (Replace with DB later) ----------
const users = new Map();

// ---------- AUTH ROUTES ----------
app.post("/api/auth/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required"
        });
    }

    // Check if user already exists
    if (users.has(email)) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    // Store user (in production, hash password with bcrypt)
    users.set(email, { name, email, password });

    // Generate token
    const token = jwt.sign({ email, name }, JWT_SECRET, { expiresIn: "24h" });

    res.status(201).json({
        success: true,
        message: "Registration successful",
        data: {
            token,
            user: { name, email }
        }
    });
});

app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    // Check if user exists
    const user = users.get(email);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    // Verify password (in production, use bcrypt.compare)
    if (user.password !== password) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    // Generate token
    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "24h" });

    res.json({
        success: true,
        message: "Login successful",
        data: {
            token,
            user: { name: user.name, email: user.email }
        }
    });
});

// ---------- IN-MEMORY PROGRESS STORE ----------
const userProgress = new Map();

// ---------- PROTECTED ROUTES ----------
app.get("/api/progress", verifyToken, (req, res) => {
    const progress = userProgress.get(req.user.email) || [];

    res.json({
        success: true,
        data: progress
    });
});

app.post("/api/progress/update", verifyToken, (req, res) => {
    const { algorithmId, status, currentStep, totalSteps } = req.body;

    if (!algorithmId || !status) {
        return res.status(400).json({
            success: false,
            message: "algorithmId and status are required"
        });
    }

    // Get user's progress
    let progress = userProgress.get(req.user.email) || [];

    // Find existing progress for this algorithm
    const existingIndex = progress.findIndex(p => p.algorithmId === algorithmId);

    const progressItem = {
        algorithmId,
        status,
        currentStep: currentStep || 0,
        totalSteps: totalSteps || 0,
        updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
        progress[existingIndex] = progressItem;
    } else {
        progress.push(progressItem);
    }

    userProgress.set(req.user.email, progress);

    res.json({
        success: true,
        message: "Progress updated",
        data: progressItem
    });
});

app.delete("/api/progress/:algorithmId", verifyToken, (req, res) => {
    const { algorithmId } = req.params;

    let progress = userProgress.get(req.user.email) || [];
    progress = progress.filter(p => p.algorithmId !== algorithmId);
    userProgress.set(req.user.email, progress);

    res.json({
        success: true,
        message: "Progress deleted"
    });
});

// ---------- TOKEN MIDDLEWARE ----------
function verifyToken(req, res, next) {
    const header = req.headers["authorization"];
    if (!header) return res.status(401).json({ message: "No token provided" });

    const token = header.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = decoded;
        next();
    });
}

// ---------- START SERVER ----------
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
