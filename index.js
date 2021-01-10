const path = require('path')
const fs = require('fs')
const { execSync } = require("child_process");
const express = require('express')
const shortid = require('shortid')
var bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.static('./public'))

app.get('/', async (req, res, next) => {
  res.sendFile('./index.html')
});

app.get('/getId', (req, res) => {
    const data = {
        userId: shortid.generate()
    }
    console.log(data);
    res.send(data);
});

app.post('/delete', (req, res, next) => {
    console.log(req.body.userId);
    const path = `${__dirname}/public/temp/temp_${req.body.userId}`
    try {
        fs.unlinkSync(path + '.pdf');
        fs.unlinkSync(path + '.aux');
        fs.unlinkSync(path + '.tex');
        fs.unlinkSync(path + '.log');
        //file removed
      } catch(err) {
        console.error(err)
      }
})


// const convertToPdf = (filename) => {
    console.log(4545);

// }

app.post('/submit', (req, res, next) => {
    let responseToClient = {status: "Knock Success"};
    const texCode = req.body.body;
    console.log(texCode);
    console.log('aisi ekhane');
    fs.writeFile(`${__dirname}/public/temp/temp_${req.body.userId}.tex`, texCode, function (err) {
        if (err) return console.log(err);
        console.log('Written propeely in temporary file.');

        try {
            
        execSync(`powershell pdflatex ${__dirname}/public/temp/temp_${req.body.userId}.tex --output-directory ${__dirname}/public/temp/`, (error, stdout, stderr) => {
            // console.log('aaaaaaaa');
            if (error) {
                // console.log(`error: ${error.message}`);
                responseToClient.status = "Error occured"
                return;
            }
            if (stderr) {
                responseToClient.status = "Error occured"
                return;
            }
            console.log(`stdout: ${stdout}`);
            
        });
        } catch (error) {
            console.log('hit');
            responseToClient.status = "Error occured"

        }
        res.send(responseToClient);
    });

    
});

const port = process.env.PORT || 4433
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
