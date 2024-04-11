import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import CORS middleware
import bcrypt from 'bcrypt';
import session from 'express-session';

 
import jwt from 'jsonwebtoken'



const app = express();
const PORT = 5000;

// MongoDB connection
const DB_URL = 'mongodb://127.0.0.1:27017/projectsDB';
const JWT_SECRET="your-secret-key";

mongoose.connect(DB_URL)
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });



// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
// Allow requests from specific origin
const corsOptions = {
  origin: ['http://localhost:3000'],  // Change this to your frontend URL
  credentials: true
};
app.use(cookieParser());



// Allow requests from specific origin
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your frontend URL
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });

app.use(cors(corsOptions));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Extract token from cookies
  const token = req.cookies.token;
  console.log("token please --  - - - -   ", token);
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to request object
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};




// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username + " " + password);

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1d' }); // Change secret key and expiration as needed
    // localStorage.setItem('token', token);
    
console.log('Generated token in registration:', token);

    // Send JWT as a cookie
    res.cookie('token', token, { httpOnly: true });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});


// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("username ",username,"pasword ",password);

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1d' }); // Change secret key and expiration as needed
// Log the token to the console
// localStorage.setItem('token', token);
console.log('Generated token in login:', token);
console.log("token = ",token);
    // Send JWT as a cookie
    res.cookie('token', token, { httpOnly: true });
    console.log("token genereated by man ",token);

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout endpoint
app.get('/api/logout', (req, res) => {
  res.clearCookie('token'); // Clear JWT cookie
  res.json({ message: 'Logout successful' });
});


const domainSchema = new mongoose.Schema({
  domainName: String,
});
const {ObjectId} = mongoose.Schema.Types
const projSchema = new mongoose.Schema({
  projectName: String,
  domain: String,
  description: String,
  likes:[{type:ObjectId,ref:"User"}],
  comments:[{
      text:String,
      postedBy:{type:ObjectId,ref:"User"}
  }],
});

const Domain = mongoose.model('Domain', domainSchema);
const Proj = mongoose.model('Proj', projSchema);


app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Endpoint for submitting domain name
app.post('/api/domains', async (req, res) => {
  try {
    const { domainName } = req.body;
    // Check if domain already exists
    const existingDomain = await Domain.findOne({ domainName });
    if (existingDomain) {
      return res.status(400).json({ error: 'Domain already exists' });
    }
    // Save domain
    const domain = new Domain({ domainName });
    await domain.save();
    res.json({ message: 'Domain submitted successfully', domain });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for fetching all domain names
app.get('/api/domains', async (req, res) => {
    try {
      // Fetch all domains from the database
      const domains = await Domain.find({}, 'domainName'); // Only retrieve domainName field
      res.json({ domains });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Endpoint for adding a project
app.post('/api/project', async (req, res) => {
  try {
    const { domain, projectName, description } = req.body;
    
    // Check if project already exists for this domain
    const existingProject = await Proj.findOne({ domain, projectName });
    if (existingProject) {
      console.log('Project already exists for this domain:', domain, projectName);
      return res.status(400).json({ error: 'Project already exists for this domain' });
    }
    
    // Save project
    const project = new Proj({ domain, projectName, description });
    await project.save();
    
    console.log('Project added successfully:', project);
    res.json({ message: 'Project added successfully', project });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for fetching projects based on domain
app.get('/api/project', async (req, res) => {
    try {
      const { domain } = req.query;
      if (!domain) {
        return res.status(400).json({ error: 'Domain is required' });
      }
      const project = await Proj.find({ domain });
      res.json({ project });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// Like endpoint
app.put('/api/project/like', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Check if the user has already liked the project
    const project = await Proj.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isLiked = project.likes.includes(req.userId);

    // Update project likes based on like status
    let updatedProject;
    if (isLiked) {
      // Remove user ID from likes array
      updatedProject = await Proj.findByIdAndUpdate(projectId, {
        $pull: { likes: req.userId }
      }, {
        new: true
      }).exec();
    } else {
      // Add user ID to likes array
      updatedProject = await Proj.findByIdAndUpdate(projectId, {
        $push: { likes: req.userId }
      }, {
        new: true
      }).exec();
    }

    res.status(200).json({ ok: true, data: updatedProject });
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});

  

// // Unlike endpoint
// app.post('/api/project/unlike', async (req, res) => {
//   try {
//     // Get the project ID from the request body
//     const { projectId } = req.body;

//     // Update the project document to pull the user ID from the likes array
//     const updatedProject = await Proj.findByIdAndUpdate(projectId, {
//       $pull: { likes: req.user._id } // Pull the user ID from the likes array
//     }, { new: true });

//     // Return the updated project document
//     res.json(updatedProject);
//   } catch (error) {
//     console.error('Error unliking project:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.post('/api/project/comment',requireLogin,(req,res)=>{
//   const comment = {
//       text:req.body.text,
//       postedBy:req.user._id
//   }
//   Proj.findByIdAndUpdate(req.body.projectId,{
//       $push:{comments:comment}
//   },{
//       new:true
//   })
//   .populate("comments.postedBy","_id name")
//   .populate("postedBy","_id name")
//   .exec((err,result)=>{
//       if(err){
//           return res.status(422).json({error:err})
//       }else{
//           res.json(result)
//       }
//   })
// })

// app.delete('api/project/deletepost/:projectId',requireLogin,(req,res)=>{
//   Post.findOne({_id:req.params.projectId})
//   .populate("postedBy","_id")
//   .exec((err,post)=>{
//       if(err || !post){
//           return res.status(422).json({error:err})
//       }
//       if(post.postedBy._id.toString() === req.user._id.toString()){
//             post.remove()
//             .then(result=>{
//                 res.json(result)
//             }).catch(err=>{
//                 console.log(err)
//             })
//       }
//   })
// })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
