import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(process.env.DATABASE_URL || "course_vault.db");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'lecturer', 'student')) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT UNIQUE NOT NULL,
    course_title TEXT NOT NULL,
    level INTEGER NOT NULL,
    semester TEXT NOT NULL,
    lecturer_id INTEGER,
    FOREIGN KEY (lecturer_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    course_id INTEGER NOT NULL,
    uploaded_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
  );
`);

// Seed Admin if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "System Admin",
    "admin@vault.com",
    hashedPassword,
    "admin"
  );
}

// Seed requested lecturers if they don't exist
const lecturersToSeed = [
  { name: "Dr.Amadi", email: "amadi@vault.com" },
  { name: "Engr.Emeka", email: "emeka@vault.com" },
  { name: "Dr.John", email: "john@vault.com" },
  { name: "Asimobi", email: "asimobi@vault.com" }
];

const lecturerPassword = bcrypt.hashSync("lecturer123", 10);
const checkUser = db.prepare("SELECT * FROM users WHERE email = ?");
const insertUser = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");

lecturersToSeed.forEach(l => {
  const exists = checkUser.get(l.email);
  if (!exists) {
    insertUser.run(l.name, l.email, lecturerPassword, "lecturer");
  }
});

const app = express();
app.use(express.json());

// File Upload Setup
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOCX, PPT, and PPTX are allowed."));
    }
  },
});

// Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authorizeRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    next();
  };
};

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
      name,
      email,
      hashedPassword,
      role || "student"
    );
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(400).json({ message: "Email already exists" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Admin Routes
app.get("/api/admin/users", authenticateToken, authorizeRole(["admin"]), (req, res) => {
  const users = db.prepare("SELECT id, name, email, role FROM users").all();
  res.json(users);
});

app.post("/api/admin/create-user", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
      name,
      email,
      hashedPassword,
      role
    );
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error creating user" });
  }
});

// Course Routes
app.get("/api/courses", authenticateToken, (req, res) => {
  const courses = db.prepare("SELECT * FROM courses").all();
  res.json(courses);
});

app.post("/api/courses", authenticateToken, authorizeRole(["admin", "lecturer"]), (req: any, res) => {
  const { course_code, course_title, level, semester } = req.body;
  const lecturer_id = req.user.role === 'lecturer' ? req.user.id : req.body.lecturer_id;
  try {
    db.prepare("INSERT INTO courses (course_code, course_title, level, semester, lecturer_id) VALUES (?, ?, ?, ?, ?)").run(
      course_code,
      course_title,
      level,
      semester,
      lecturer_id
    );
    res.status(201).json({ message: "Course created" });
  } catch (err) {
    res.status(400).json({ message: "Course code already exists" });
  }
});

// Material Routes
app.post("/api/materials/upload", authenticateToken, authorizeRole(["lecturer"]), upload.single("file"), (req: any, res) => {
  const { title, course_id } = req.body;
  const file_path = req.file.filename;
  const uploaded_by = req.user.id;

  try {
    db.prepare("INSERT INTO materials (title, file_path, course_id, uploaded_by) VALUES (?, ?, ?, ?)").run(
      title,
      file_path,
      course_id,
      uploaded_by
    );
    res.status(201).json({ message: "Material uploaded successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error saving material info" });
  }
});

app.get("/api/materials", authenticateToken, (req, res) => {
  const { course_code, level, semester } = req.query;
  let query = `
    SELECT m.*, c.course_code, c.course_title, c.level, c.semester, u.name as lecturer_name 
    FROM materials m
    JOIN courses c ON m.course_id = c.id
    JOIN users u ON m.uploaded_by = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (course_code) {
    query += " AND c.course_code LIKE ?";
    params.push(`%${course_code}%`);
  }
  if (level) {
    query += " AND c.level = ?";
    params.push(level);
  }
  if (semester) {
    query += " AND c.semester = ?";
    params.push(semester);
  }

  const materials = db.prepare(query).all(...params);
  res.json(materials);
});

app.get("/api/materials/download/:filename", authenticateToken, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
