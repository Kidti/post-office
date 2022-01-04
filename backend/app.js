const express = require('express')
const app = express()
const port = 8080
const fs = require("fs")
const cors = require("cors")
const { response } = require('express')
app.use(cors())
app.use(express.json())

const loadData = (req, res, next) =>{
  const database = fs.readFileSync("./backend/mails.json")
  const parsedData = JSON.parse(database)
  res.locals.tempParsedData = parsedData
  next();
}

app.use(loadData)

app.get('/api/mails', (req, res) => {
  const parsedData = res.locals.tempParsedData
  res.json(parsedData)
})

//If same ref number, dont post mail
app.post('/api/mails', (req, res, next) => {
    const parsedData = res.locals.tempParsedData

   /* const newMail = { 
      id: parsedData.length +1,
      from: req.body.from,
      to: req.body.to, 
      message: req.body.message, 
      reference: req.body.reference
}*/
    let id = parsedData.length+1

    let mailsFound = false
    for(let mail of parsedData){
      if(mail.reference === req.body.reference){
        mailsFound = true
        console.log(mail.reference);
      }
    }
    if(mailsFound){
      res.sendStatus(400)
    }else{
      parsedData.push({ id, ...req.body });
      console.log({ id, ...req.body });
      fs.writeFileSync("./backend/mails.json", JSON.stringify(parsedData, null, 2))
      res.status(200).json({ message: "succesful" });
    }
})

app.get('/api/mails/:reference', (req, res) => {
  res.send(res.locals.tempParsedData.filter(mail => mail.reference == req.params.reference))
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
