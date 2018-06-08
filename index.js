
const express = require('express')
const app = express()

var bodyParser = require('body-parser');
var session = require('express-session')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

//app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'capacitor',    
}))

/*
 Add our static files. NOTE: you don't pass in the folder name
 Example: http://localhost:3000/login.html will load the login.html
 file inside the static folder
*/
app.use(express.static('static'));
app.use(express.static('images'));





var usernames = [];
var passwords = [];
var balances = [];

//
//Read in the usernames and store it in our array
readFileByLine("usernames.txt", usernames);
readFileByLine("password.txt", passwords);
readFileByLine("balances.txt", balances);


function readFileByLine(inputFile, storageArray) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    rl.on('line', function (line) {
        console.log(line);
        storageArray.push(line);
    });

    rl.on('close', function (line) {        
        console.log('done reading file.');
        
    });
}

function newUser(username, password) {
    var fs = require('fs');
    fs.appendFile('usernames.txt', "\n" + username, function (err) {
        if (err) throw err;
        console.log('Saved Username');
    });

    fs.appendFile('password.txt', "\n" + password, function (err) {
        if (err) throw err;
        console.log('Saved Password');
    });

    fs.appendFile('balances.txt', "\n" + "0", function (err) {
        if (err) throw err;
        console.log('Saved Password');
    });



}



function findUser(username, password) {
    var index = usernames.indexOf(username);
    console.log("Loggin in with: " + username + " and " + password + " Found at " + index);
    console.log(usernames);

    if (index <= -1) {
        //
        //This means the user was not found
        return false;
    }
    else {
        //
        //This means that the user was found in the DB
        if (passwords[index] == password) {
            return true;
        }
        else {
            console.log("Invalid password");
            return false;
        }
    }
   
}

function checkUser(username, password) {
    var index = usernames.indexOf(username);
    var passIndex = passwords.indexOf(password);



    if (index > -1 || passIndex >-1) {
        return false;
    }
    else {
        return true;
    }
}
//
//Read in the passwords and store it in our array







app.post('/login', function (req, res) {

    var user_id = req.body.username;
    var password = req.body.password;
    var loginBool = findUser(user_id, password);

    if (loginBool == true) {

        //res.send("Succesfully logged in");
        req.session.user_id = user_id;
        
        res.redirect('dashboard.html');
    }

    else {

        res.send("Not found");

    }
})


app.post('/register', function (req, res) {

    var user_id = req.body.username;
    var password = req.body.password;
    var loginBool = checkUser(user_id, password);
    console.log(loginBool);
    console.log("Username: " + user_id);
    console.log("Password: " + password);

    if (loginBool == true) {

        res.send("Username Taken!");

    }

    else {

        newUser(user_id, password)
        readFileByLine("usernames.txt", usernames);
        readFileByLine("password.txt", passwords);
        readFileByLine("balances.txt", balances);
        
        res.redirect('login.html');

    }


    
})

app.post('/username', function (req, res) {
    var user_id = req.session.user_id;
})

app.get('/balance', function (req, res) {
    
    var user_id = req.session.user_id;
    var index = usernames.indexOf(user_id);
    var balance = balances[index];
    
    console.log(req.session.user_id);

    console.log("The balances" +  balances[index]);
    
    if (balance === "undefined") {
        balance = "0";
    }

    res.send(balance);

})



app.listen(3000, () => console.log('Example app listening on port 3000!'));