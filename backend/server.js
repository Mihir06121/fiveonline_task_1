const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
mongoose.set('strictQuery', false)

const appRouter = require("./routes/appRoutes")

mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true
}).then(() => console.log('DB connected'))
.catch(err => {
    console.log("DB CONNECTION ERROR", err)
})

app.use(morgan('dev'))

app.use(bodyParser.json())
app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
    app.use(cors({origin: `${process.env.CLIENT_URL}`}))
}
app.use(cors())

app.use('/api', appRouter)

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server on port: ${port} started`)
})