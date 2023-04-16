

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const API_KEY = "4941571d9ac7445a86621debb125084c-us21";
const LIST_ID = "f5f7767e9a";
const SERVER_PREFIX = "us21"; // You can find this at the end of your API key

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    res.sendFile(`${__dirname}/signup.html`);
})

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    // console.log(firstName, lastName, email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    // Make request
    const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}`;
    const options = {
        method: "POST",
        auth: `mulenga:${API_KEY}`
    };


    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })

        if (response.statusCode === 200){
            res.sendFile(`${__dirname}/success.html`);
        }else{
            res.sendFile(`${__dirname}/failure.html`);
        }
    });

    request.write(jsonData);
    request.end();
})

app.post("/failure.html", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
})



