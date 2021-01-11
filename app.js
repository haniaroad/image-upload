const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/', 
    filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + 
    path.extname(file.originalname));
}});

//Init Upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('image');                // Upload multiple files with .array

//Validate File Type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;

    //Check file extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    //Check mimetype
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }
    else{
        cb('Error: Images only');
    }
}

//Init app variables
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});

//EJS
app.set('view engine', 'ejs');

//Public folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));


app.post('/upload', (req, res) => {
    upload(req, res, (err) =>{
        if(err){
            res.render('index', {
                msg: err
            });
            
            console.log("There was an error");
        }
            else{
                if(req.file == undefined){
                    res.render('index', {
                        msg: 'Error: No file selected'
                    });
                } else{
                    res.render('index', {
                        msg: 'File uploaded!',
                        file: `uploads/${req.file.filename}`
                    });
                }
            }
    })
})