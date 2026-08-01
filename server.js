const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { parseTex } = require('./tex_parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const LOGS_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOGS_DIR, 'activity.log');
const USERDATA_DIR = path.join(__dirname, '.userdata');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure required directories exist
[USERDATA_DIR, UPLOADS_DIR, LOGS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

let activeSessions = {};

// 1. Basic Middlewares
app.use(cors());
app.use(bodyParser.json());

// 2. Global Request Logger (CRITICAL for debugging)
app.use((req, res, next) => {
    console.log(`[DEBUG] ${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
    next();
});

// 3. Multer config for TeX uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 4. Utility Functions
function logActivity(message) {
    const entry = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(LOG_FILE, entry);
    console.log(entry.trim());
}

function loadData() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
        console.error("CRITICAL: Failed to load data.json", e);
        return { courses: [], content: [], exams: [], leaderboard: [] };
    }
}

function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("CRITICAL: Failed to save data.json", e);
    }
}

// Discord OAuth Helper & Handlers
function getDiscordConfig() {
    const configPath = path.join(__dirname, 'discord_config.json');
    let fileConfig = {};
    if (fs.existsSync(configPath)) {
        try {
            fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch (e) {
            console.error('Error reading discord_config.json', e);
        }
    }
    return {
        clientId: process.env.DISCORD_CLIENT_ID || fileConfig.clientId || '',
        clientSecret: process.env.DISCORD_CLIENT_SECRET || fileConfig.clientSecret || '',
        redirectUri: process.env.DISCORD_REDIRECT_URI || fileConfig.redirectUri || ''
    };
}

const handleDiscordLogin = (req, res) => {
    const { clientId, redirectUri: configuredRedirect } = getDiscordConfig();
    const redirectUri = configuredRedirect || `${req.protocol}://${req.get('host')}/auth/discord/callback`;
    
    if (!clientId) {
        return res.status(503).json({ 
            error: 'Discord OAuth credentials not configured on backend. Please set clientId in discord_config.json or DISCORD_CLIENT_ID env var.',
            authorizationUrl: null 
        });
    }

    const scope = encodeURIComponent('identify email');
    const authorizationUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
    res.json({ authorizationUrl });
};

const handleDiscordCallback = async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Authorization code required' });
    }

    const { clientId, clientSecret, redirectUri: configuredRedirect } = getDiscordConfig();
    const redirectUri = configuredRedirect || `${req.protocol}://${req.get('host')}/auth/discord/callback`;

    if (!clientId || !clientSecret) {
        return res.status(503).json({ error: 'Discord OAuth credentials not configured' });
    }

    try {
        const tokenParams = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri
        });

        const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams
        });

        if (!tokenRes.ok) {
            const errText = await tokenRes.text();
            throw new Error(`Token exchange failed (${tokenRes.status}): ${errText}`);
        }

        const tokenData = await tokenRes.json();
        const userRes = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });

        if (!userRes.ok) {
            throw new Error(`User fetch failed (${userRes.status})`);
        }

        const userData = await userRes.json();
        const username = userData.global_name || userData.username || 'Discord User';
        res.json({ name: username, discordId: userData.id });
    } catch (err) {
        console.error('[DISCORD_OAUTH_ERROR]', err);
        res.status(500).json({ error: err.message || 'Authentication failed' });
    }
};

// 5. API ROUTES (Must come before static middleware)

// Discord OAuth Routes
app.get(['/auth/discord/login', '/api/auth/discord/login'], handleDiscordLogin);
app.post(['/auth/discord/callback', '/api/auth/discord/callback'], handleDiscordCallback);

// Get All Data
app.get(['/data', '/api/data'], (req, res) => {
    const data = loadData();
    data.activeSessions = activeSessions;
    res.json(data);
});

// Userdata Storage (unifysymbolic.com/.userdata/userid/)
app.get(['/userdata/:userid', '/api/userdata/:userid'], (req, res) => {
    const userPath = path.join(USERDATA_DIR, req.params.userid, 'profile.json');
    if (fs.existsSync(userPath)) {
        res.json(JSON.parse(fs.readFileSync(userPath, 'utf8')));
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.post(['/userdata/:userid', '/api/userdata/:userid'], (req, res) => {
    const userDir = path.join(USERDATA_DIR, req.params.userid);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    fs.writeFileSync(path.join(userDir, 'profile.json'), JSON.stringify(req.body, null, 2));
    res.json({ success: true });
});

// Log Student Attempt Start
app.post(['/activity/start', '/api/activity/start'], (req, res) => {
    const { student, examTitle, examId } = req.body;
    logActivity(`STUDENT_START: ${student} started "${examTitle}"`);
    if (examId) activeSessions[examId] = (activeSessions[examId] || 0) + 1;
    res.json({ success: true });
});

// Log Student Attempt Finish
app.post(['/activity/finish', '/api/activity/finish'], (req, res) => {
    const { student, examTitle, score, total, examId } = req.body;
    logActivity(`STUDENT_FINISH: ${student} finished "${examTitle}" with score ${score}/${total}`);
    if (examId) activeSessions[examId] = Math.max(0, (activeSessions[examId] || 1) - 1);
    
    const data = loadData();
    data.leaderboard.push({
        name: student,
        examId: req.body.examId,
        score: score,
        total: total,
        time: new Date().toLocaleTimeString(),
        rank: data.leaderboard.length + 1
    });
    saveData(data);
    res.json({ success: true });
});

// Log Student Attempt Exit
app.post(['/activity/exit', '/api/activity/exit'], (req, res) => {
    const { examId } = req.body;
    if (examId) activeSessions[examId] = Math.max(0, (activeSessions[examId] || 1) - 1);
    res.json({ success: true });
});

// Admin: Deploy New Exam from LaTeX
app.post(['/admin/deploy', '/api/admin/deploy'], upload.single('texFile'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const { category, title } = req.body;
    logActivity(`ADMIN_DEPLOY: Deploying "${title}" to category "${category}"`);

    const parsed = parseTex(req.file.path);
    if (!parsed) return res.status(500).json({ error: 'Failed to parse LaTeX file' });

    const data = loadData();
    const newExam = {
        id: 'exam_' + Date.now(),
        title: title || req.file.originalname,
        category: category || 'General',
        questions: parsed.questions.map((qObj, i) => ({
            q: qObj.q,
            options: qObj.options,
            correct: parsed.answerKey[i] !== undefined ? parsed.answerKey[i] : 0
        })),
        sourceFile: req.file.filename
    };

    data.exams.push(newExam);
    saveData(data);

    logActivity(`ADMIN_DEPLOY_SUCCESS: Created exam "${newExam.id}" with ${newExam.questions.length} questions`);
    res.json({ success: true, examId: newExam.id });
});

// Admin: Upload Course Content
app.post(['/admin/content-upload', '/api/admin/content-upload'], (req, res) => {
    const { courseId, moduleTitle, video, syllabus } = req.body;
    const data = loadData();
    const newContent = {
        courseId,
        moduleTitle,
        video,
        syllabus,
        timestamp: new Date().toISOString()
    };
    data.content.push(newContent);
    saveData(data);
    logActivity(`ADMIN_CONTENT: Added module "${moduleTitle}" to course "${courseId}"`);
    res.json({ success: true });
});

// Admin: View Logs
app.get(['/admin/logs', '/api/admin/logs'], (req, res) => {
    if (!fs.existsSync(LOG_FILE)) return res.json({ logs: [] });
    const logs = fs.readFileSync(LOG_FILE, 'utf8').split('\n').filter(l => l);
    res.json({ logs: logs.reverse().slice(0, 50) });
});

// Admin: Create New Course
app.post(['/admin/course-create', '/api/admin/course-create'], (req, res) => {
    const { id, name, category, icon, syllabus, module, eqn } = req.body;
    if (!name || !category) return res.status(400).json({ error: 'Name and Category are required' });
    const data = loadData();
    const courseId = id || name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newCourse = {
        id: courseId,
        name,
        category,
        icon: icon || '📚',
        status: 'Published',
        contentCount: 0,
        syllabus: syllabus || '',
        module: module || 'General',
        eqn: eqn || ''
    };
    data.courses.push(newCourse);
    saveData(data);
    logActivity(`ADMIN_COURSE_CREATE: Created course "${name}" (${courseId})`);
    res.json({ success: true, course: newCourse });
});

// Admin: Delete Course
app.delete(['/admin/courses/:id', '/api/admin/courses/:id'], (req, res) => {
    const courseId = req.params.id;
    const data = loadData();
    const initialLen = data.courses.length;
    data.courses = data.courses.filter(c => c.id !== courseId);
    if (data.courses.length < initialLen) {
        saveData(data);
        logActivity(`ADMIN_DELETE_COURSE: Deleted course ${courseId}`);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Course not found' });
    }
});

// Admin: Direct Manual Exam Creator
app.post(['/admin/exam-create', '/api/admin/exam-create'], (req, res) => {
    const { title, category, questions } = req.body;
    if (!title || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ error: 'Title and Questions array are required' });
    }
    const data = loadData();
    const newExam = {
        id: 'exam_' + Date.now(),
        title,
        category: category || 'General',
        questions,
        sourceFile: 'manual_entry'
    };
    data.exams.push(newExam);
    saveData(data);
    logActivity(`ADMIN_EXAM_CREATE: Created manual exam "${newExam.id}" (${title}) with ${questions.length} Qs`);
    res.json({ success: true, examId: newExam.id });
});

// Admin: Clear Leaderboard
app.delete(['/admin/leaderboard', '/api/admin/leaderboard'], (req, res) => {
    const data = loadData();
    data.leaderboard = [];
    saveData(data);
    logActivity(`ADMIN_LEADERBOARD_CLEAR: Leaderboard reset.`);
    res.json({ success: true });
});

// Admin: Upload Media File (Images, Videos, Podcasts, PDFs)
app.post(['/admin/upload-media', '/api/admin/upload-media'], upload.single('mediaFile'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No media file uploaded' });
    const { title, mediaType, description } = req.body;
    const mediaUrl = `/uploads/${req.file.filename}`;
    const data = loadData();
    data.media = data.media || [];
    const mediaItem = {
        id: 'media_' + Date.now(),
        title: title || req.file.originalname,
        type: mediaType || req.file.mimetype,
        url: mediaUrl,
        filename: req.file.filename,
        description: description || '',
        uploadDate: new Date().toISOString()
    };
    data.media.push(mediaItem);
    saveData(data);
    logActivity(`ADMIN_MEDIA_UPLOAD: Uploaded ${mediaItem.type} "${mediaItem.title}"`);
    res.json({ success: true, media: mediaItem });
});

// Admin & Student: Get All Media
app.get(['/media', '/api/media'], (req, res) => {
    const data = loadData();
    res.json({ media: data.media || [] });
});

// Podcasts: Get all published podcasts
app.get(['/podcasts', '/api/podcasts'], (req, res) => {
    const data = loadData();
    res.json({ podcasts: data.podcasts || [] });
});

// Podcasts: Publish new podcast (audio file upload or external link)
app.post(['/podcasts', '/api/podcasts'], upload.single('audioFile'), (req, res) => {
    const { title, author, description, externalUrl } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    
    let audioUrl = externalUrl || '';
    if (req.file) {
        audioUrl = `/uploads/${req.file.filename}`;
    }

    const data = loadData();
    data.podcasts = data.podcasts || [];
    const newPodcast = {
        id: 'pod_' + Date.now(),
        title,
        author: author || 'Student Podcaster',
        description: description || '',
        audioUrl,
        likes: 0,
        createdAt: new Date().toISOString()
    };
    data.podcasts.push(newPodcast);
    saveData(data);
    logActivity(`PODCAST_PUBLISH: ${newPodcast.author} published "${title}"`);
    res.json({ success: true, podcast: newPodcast });
});

// Podcasts: Delete / Moderate Podcast
app.delete(['/podcasts/:id', '/api/podcasts/:id'], (req, res) => {
    const data = loadData();
    data.podcasts = (data.podcasts || []).filter(p => p.id !== req.params.id);
    saveData(data);
    logActivity(`PODCAST_DELETE: Deleted podcast ${req.params.id}`);
    res.json({ success: true });
});

// Connect: Search Students and Institutes
app.get(['/users/search', '/api/users/search'], (req, res) => {
    const query = (req.query.q || '').toLowerCase();
    
    const sampleInstitutes = [
        { id: 'inst_1', name: 'Unify Academy', type: 'Institute', location: 'Kerala', members: 1420 },
        { id: 'inst_2', name: 'National Institute of Physics', type: 'College', location: 'New Delhi', members: 890 },
        { id: 'inst_3', name: 'St. Joseph Higher Secondary School', type: 'School', location: 'Kochi', members: 640 },
        { id: 'inst_4', name: 'IISER Research Forum', type: 'University', location: 'Thiruvananthapuram', members: 2150 }
    ];

    let userFiles = [];
    if (fs.existsSync(USERDATA_DIR)) {
        userFiles = fs.readdirSync(USERDATA_DIR).map(dir => {
            const profilePath = path.join(USERDATA_DIR, dir, 'profile.json');
            if (fs.existsSync(profilePath)) {
                try { return JSON.parse(fs.readFileSync(profilePath, 'utf8')); } catch(e){}
            }
            return { name: dir, userid: dir };
        }).filter(Boolean);
    }

    const filteredUsers = userFiles.filter(u => (u.name || '').toLowerCase().includes(query));
    const filteredInstitutes = sampleInstitutes.filter(i => (i.name || '').toLowerCase().includes(query) || (i.location || '').toLowerCase().includes(query));

    res.json({ users: filteredUsers, institutes: filteredInstitutes });
});

// Connect: Peer Direct Messaging
app.get(['/messages/:user', '/api/messages/:user'], (req, res) => {
    const data = loadData();
    data.messages = data.messages || [];
    const userMsgs = data.messages.filter(m => m.to === req.params.user || m.from === req.params.user);
    res.json({ messages: userMsgs });
});

app.post(['/messages', '/api/messages'], (req, res) => {
    const { from, to, text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });
    const data = loadData();
    data.messages = data.messages || [];
    const msg = {
        id: 'msg_' + Date.now(),
        from: from || 'Anonymous',
        to: to || 'Global',
        text,
        timestamp: new Date().toISOString()
    };
    data.messages.push(msg);
    saveData(data);
    res.json({ success: true, message: msg });
});

// Admin: Delete Exam
app.delete(['/admin/exams/:id', '/api/admin/exams/:id'], (req, res) => {
    const examId = req.params.id;
    console.log(`[DELETE_HANDLER] Received request for ID: ${examId}`);
    
    const data = loadData();
    const initialLen = data.exams.length;
    data.exams = data.exams.filter(e => e.id !== examId);
    
    if (data.exams.length < initialLen) {
        saveData(data);
        console.log(`[DELETE_HANDLER] Deleted exam: ${examId}`);
        logActivity(`ADMIN_DELETE: Deleted exam ${examId}`);
        res.json({ success: true });
    } else {
        console.warn(`[DELETE_HANDLER] Exam NOT found in data.json: ${examId}`);
        res.status(404).json({ error: 'Exam not found in database: ' + examId });
    }
});

// 6. STATIC ROUTES
app.use('/uploads', express.static('uploads'));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
const distPath = path.join(__dirname, '..', 'UnifyStudyApp', 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
} else {
    // Fallback: Redirect root / to /admin panel if frontend dist folder is not uploaded on VPS
    app.get('/', (req, res) => res.redirect('/admin'));
}

// 7. Start Server
app.listen(PORT, '0.0.0.0', () => {
    logActivity(`Unify Shared API running on http://0.0.0.0:${PORT}`);
});
