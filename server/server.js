const express= require ('express');
const jwt= require("jsonwebtoken");
const mongoose= require ("mongoose");
const app = express();
app.use(express.json());//this parses the json data sent by user to the server and makes it available to the request.body portion

const SECRET= 'SeCrEt';

//defining mongoose schemas

const userSchema= new mongoose.Schema({
    username: String,//={type : String},
    password: String,
    purchasedCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
});

const adminSchema= new mongoose.Schema({
    username: String,
    password: String


});
const courseSchema= new mongoose.Schema({
    title: String,
    description: String ,
    price: Number,
    imageLink: String,
    published: Boolean

});

//define mongoose models
const User = mongoose.model('User', userSchema);
const Admin=mongoose.model('Admin', adminSchema);
const Course= mongoose.model('Course', courseSchema);

//jwt authentication 

const authenticateJwt= (req, res, next )=>{
    const authHeader = req.headers.authorization;
    if(authHeader)
    {
        const token= authHeader.split(' ')[1];// authHeader.split(" ") will result in an array of 2 elemenst, one is Bearer string and the other is a token, so we need that toke, henc ewe are using this . split functuion is pretty necessary here'
        jwt.verify(token, SECRET, (err, user)=>
        {
            if(err){
                return res.sendStatus(403);
            }
            else{
                req.user= user;
                next();
            }
        })
    }
    else{
        res.sendStatus(401);
    }
}


//connect to a mongo db application server
mongoose.connect('', {});




//route handlers


app.post('/admin/signup', (req, res)=>
{
    const {username, password} = req.body;
    function callback(admin )// this admin is data retrived after admin. findOne works async way, if it is there 
    {
        if(admin)
        {
            res.sendStatus(403).json({message: 'User already exists '});}
        else
        {
            const obj= {username: username, password: password};
            const newAdmin= new Admin(obj);
            newAdmin.save();
            const token=  jwt.sign({username, role: 'admin'},SECRET, {expiresIn: '1 H'});
            res.json({message: 'Admin created successfully ', token});

        }

    }
    Admin.findOne({username }).then(callback);



});
app.post('/admin/login', (req, res)=>
{
    const {username , password }= req.headers ;
     Admin.findOne({username, password}).then((admin)=>{
        if(admin)
        {
            const token= jwt.sign({username, role: 'admin'},SECRET,{expiresIn: '1h'});
        res.json({message: 'Logged In successfully '}, token);

            
        }
        else{
            res.status(403).json({message : "wrong username or password "});

        }
     });
    //  or if async(req, res) is used , you can write 
    //  const admin= await Admin.findOne({username, password});
    // if(admin)
    // {
    //     const token= jwt.sign({username, role: 'admin'},SECRET,{expiresIn: '1h'});
    //     res.json({message: 'Logged In successfully '});

    // }
    // else{
    //     res.status(403).json({message : "wrong username or password "});
    // }

});

//The course.id in the code represents the unique identifier (ID) assigned to the newly saved Course instance. In many MongoDB and Mongoose models, including the Mongoose Model class, each document has an automatically generated _id field that serves as a unique identifier. Mongoose provides a convenience method to access this _id field, and it's exposed as the id virtual property.



app.post('/admin/courses', authenticateJwt, (req, res)=>{
    const course= new Course(req.body);
    course.save().then(()=>{
        res.json({message: 'Course created successfully ', courseId: course.id});
    })
});

// findByIdAndUpdate is a function in mongo db , used for its collections , to find by an id and update it. 
// {new: true } is used so that the document is returned
// next issue was that why req.params.courseId. so note that we used :courseId in the route , so basically that is provided by the user, and courseId is an identifier for that , now that identifier in express, cant be accesssed from the body of req..but the params heading of req- for that you can verify in postman, whenever you send a put request out ThemeProvider. even the user entered data in req. body availability is ensured by app.use(express.json()
//when not using async await, instead you have to use .then()&.catch(), you can ommit the .catch() function and belive on the defualt error handling mechanism of express

app.put('/admin/courses/:courseId', authenticateJwt,(req, res)=>{
    const course = Course.findByIdAndUpdate(req.params.courseId , req.body, {new : true } ).then((course)=>{
        if(course){
            res.json({message: 'Course updated successfulyy'});
        }
        else{
            res.status(403).json({message:'Course not found , error updating it '});
        }
    });
});

//also admin needs to get his courses he published so need a get request for that as well 
// Courses represents the entire schema of course database we created via mongoose, .find({}) with an empty query represents all elements within, as the search will match all elemenst within the data base 


app.get('/admin/courses', authenticateJwt, (req, res)=>{
    const courses = Courses.find({}).then((courses)=>{
        res.json({courses});
    })
})


//user routes


app.post('/user/sign up', (req, res)=>
{
    const {username , password}= req.headers ;
    User.findOne({username}).then((user)=>{
        if(user){
            res.sendStatus('403');
        }
        else{
            const obj ={username : username , password: password};
            const newUser = new User(obj );// first we create an instance of that schema , and then we save it by next line 
            newUser.save();// way to save in the data base 
            const token = jwt.sign({username, role: 'user'}, SECRET,{expiresIn: '1H'} );
            res.json({message: "User created successfully "})
        }

    });

});
app.post('/user/login', (req, res)=>
{
    const {username, password}= req.body;
    User.findOne({username, password }).then((user)=>
    {
        if(user){
            const token= jwt.sign({username , role:'user'},SECRET,{expiresIn:'1h'})

            res.json({message: 'Logged in Successfully '}, token);
        }
        else{
            res.status(403).json({message : 'Invalid username , password'});
        }
        
    });

});

app.get('/user/courses', (req, res)=>{
    const course= Course.find({}).then((courses)=>{
        res.json({courses});

    });
});

// Doubt that why req.user.username is used instead of req.body?
// If you were to use req.body.username instead, it would rely on the assumption that the client submits the username in the request body. However, this might not be secure, as clients can potentially manipulate or provide incorrect information in the request body.

// By relying on req.user.username, you are leveraging the information embedded in the authenticated token, which is considered a more secure and reliable source of user identity. It's a common pattern in token-based authentication systems.
// basically req.user represnts the authenticated user, populated by jwt authentication



app.post('/user/courses/:courseId', (req, res)=>{
    const course= Course.findById(req.params.courseId).then((course)=>{
        console.log(course);
        if(course){
            const user = User.findOne({username: req.user.username}).then((user)=>{
                if(user)
                {
                    user.purchasedCourses.push(course);
                    user.save().then(()=>{
                        res.json({message:"Course purchased successfully"});
                    });

                }
                else{
                    res.status(403).json({message:'User not found, error'});
        }});
                }
                else{
                    res.status(403).json({message: 'Course not found'});
                }
            });
            
        });
app.get('/user/courses/purchasedCourses',(req, res)=>{
    const user = User.findOne({username: req.user.username}).populate('purchasedCourses').then((user)=>{
        if(user){
            res.json({purchasedCourses: user.purchasedCourses || []});
        }
        else{
            res.status(403).json({message:'User not found'});
        }
    });

})















app.listen('/3000', ()=>{
    console.log("listening to port 3000 ");
})
