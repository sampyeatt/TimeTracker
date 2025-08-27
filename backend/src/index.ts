import express from 'express'
import {Request, Response} from 'express'
import timeRoute from './routes/time.route'

const app = express()
const port: number = 3001


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/time', timeRoute)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
