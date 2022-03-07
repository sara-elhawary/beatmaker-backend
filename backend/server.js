require('dotenv').config()
const express = require('express')
const app = express()
const projectRouter = require('./projects/projectRouter')
const userRouter = require('./Users/userRouter')
const port = 3000

app.use(express.static('./client/public'))

app.use('/project', projectRouter)
app.use('/login', userRouter)

require('./db')

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})