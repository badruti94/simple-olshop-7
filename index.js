require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const app = express()

const auth = require('./src/routes')
const { mustRole } = require('./src/middlewares/auth')


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(fileUpload())

app.use('/v1/', auth)
app.get('/v1/tes', mustRole('all'), (req, res) => {
    res.send('tes')
})

app.use((error, req, res, next) => {
    let errorCode = error.errorCode || 500
    let message = error.message
    const data = error.data

    if (error.name === 'SequelizeUniqueConstraintError') {
        errorCode = 400
        message = error.errors[0].message
    }else if(error.name === 'SequelizeForeignKeyConstraintError'){
        errorCode = 400
        message = 'Item idak bisa dihapus karena telah dimasukan ke keranjang atau dipesan oleh pembeli'
    }

    res.status(errorCode).send({ message, data })
})

const port = process.env.PORT || 4000
app.listen(port, console.log(`Listening on port ${port}`))