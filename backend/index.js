import {connect} from  './db.js'
import { router } from './routes/index.js'
import  express from "express"
import cors from 'cors'

const app = express()

const mainRouter = router
//middlewares

app.use(express.json())
app.use(cors())
app.use('/api/v1', mainRouter)





connect().then(()=>{
    app.listen(3000, ()=> console.log("server running at port 3000"))

}).catch(()=>{
    console.log(Error)
})




