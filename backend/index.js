const express = require('express');
const session = require('express-session');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db');

const app = express();
require('dotenv').config();

// ROUTES function
const { getHere } = require('./routes/getHere');
const { uploadImage } = require('./routes/uploadImage');
const { createBlog } = require('./routes/createBlog');
const { signUp }  = require('./routes/signUp');
const { login } = require('./routes/login');
const { viewBlog } = require('./routes/viewBlog');
const { editBlog } = require('./routes/editBlog');
const { deleteBlog } = require('./routes/deleteBlog');
const { readAllBlogs } = require('./routes/readAllBlogs');
const { logout } = require('./routes/logout');
const { roleAssignment } = require('./routes/roleAssignment');
const { getRole } = require('./routes/getRole');
const { getUser } = require('./routes/getUser');
const { getPermissions} = require('./routes/getPermissions');
const { createRole } = require('./routes/createRole');


// Middleware
const checkPermission = require('./middleware/checkPermission');
const { getRoleByName } = require('./routes/getRoleByName');
const { editRole } = require('./routes/editRole');
const { getPermissionsByRoleId } = require('./routes/getPermissionByRoleId');

const corsOption = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus: 200
}

// middleware
app.use(cors(corsOption));
app.use(express.json());

// middleware for parsing the form-data
app.use(express.urlencoded({ extended: false }))

// express-session middleware for session-storage
app.use(session( {
    secret: 'sessionSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 60*60*1000 // Cookie expiry 1 day
    }
}))

// login passport middleware
app.use(passport.initialize());
app.use(passport.session());

// defining to use serialization and deserialization
passport.use(new LocalStrategy(
    {
        usernameField: 'email_id',
        passwordField: 'user_password'
    },
    async (email_id, password, done) => {
        try {
            const result = await pool.query("SELECT * FROM users WHERE email_id = $1", [email_id]);
            if(result.rows.length === 0) {
                return done(null, false, {statusCode: 404, message: "Incorrect email"});
            }
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.user_password);
            if(!isMatch) {
                console.log("password mismatch");
                return done(null, false, {statusCode: 401, message: "Incorrect Password"});
            }
            return done(null, user);
        }
        catch(err) {
            return done(err);
        }
    }
));

// how does user info stored in the session
passport.serializeUser((user, done) => {
    done(null, {id: user.user_id, role: user.role_id});
});

passport.deserializeUser(async (user, done) => {

    try {
        const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [user.id]);
        done(null, result.rows[0]);
    }
    catch(err) {
        done(err);
    }
})

// middleware to check the user is authenticated
const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        console.log("User: ",req.session.passport);
        console.log("user is authenticated");
        return next();
    }
    else {
        return res.status(401).json({message: 'Unauthorized. Please log in.'});
    }
} 
// middleware to check the user is authenticated and has admin
const isAuthor = (req, res, next) => {
    console.log("Session: ", req.session);
    if(req.isAuthenticated()) {
        if(req.session.passport.user.role === 'author') {
            console.log("user is author");
            return next();
        }
        else {
            return res.status(403).json({message: "Forbidden to perform the operation"});
        }
    }
    else {
        return res.status(401).json({message: 'Unauthorized. Please log in.'});
    }
} 

const isAuthorById = async(req, res, next) => {
    console.log("Session: ", req.session);
    if(req.isAuthenticated()) {
        if(req.session.passport.user.role === 'admin') {
            next();
        }
        else if(req.session.passport.user.role === 'author') {
            const {id} = req.params;
            console.log("blog id: ", id);
            const userResult = await pool.query("SELECT * FROM user_blogs WHERE blog_id = $1", [id]);
            console.log(userResult.rows);
            console.log("user session: ", req.user);
            if(userResult.rows[0].user_id === req.user.user_id) {
                console.log("user_id matched");
                next();
            }
            else {
                console.log("Error in authorization of the author");
            }
        }
        else {
            console.log("user is not author");
        }
    }
    else {
        console.log("user is not authenticated");
    }
}

// middleware for storing images in custom manner
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    },
});
const upload = multer({storage});

// STATIC FILE FOR IMAGE
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// POST: upload img
app.post('/upload',isAuthenticated, upload.single('fileInput'), uploadImage);

// POST: create blog
app.post('/createBlog', checkPermission(1) ,createBlog);

// GET: Read blog using blog_id
app.get('/viewBlog/:id', viewBlog);

// GET: view all blogs
app.get('/readAllBlogs', readAllBlogs);

// PUT: Edit blog using blog_id
app.put('/editBlog/:id', isAuthorById, editBlog);

// DELETE: Delete blog using blog_id
app.delete('/deleteBlog/:id', isAuthorById, deleteBlog);


// Signup
app.post('/signup', signUp);

// Login
app.post('/login', login);

// Getting profile of each candidate
app.get('/profile', (req, res) => {
    console.log(req.session);
    if(req.isAuthenticated()) {
        const user = req.session.passport.user;
        console.log(user);
        console.log(req.session);
        res.json({message: "User profile", user});
    }
    else {
        res.status(401).json({message: "Not authenticated"});
    }
})

// GET: logout using passport.js
app.get('/logout', logout);

app.post('/roleAssignment', roleAssignment);

app.get('/getRole', getRole);

app.get('/getUser', getUser);

app.get('/getPermissions', getPermissions);

app.get('/getPermissionsByRoleId/:id', getPermissionsByRoleId);

app.post('/createRole', createRole);

app.get('/getRole/:name', getRoleByName);

app.post('/editRole', editRole);


app.get("/here", getHere);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`);
})