import express from 'express';
const app = express()
import bypass from './bypass.js'
import { resolve, join } from "path";
import { readFileSync } from 'node:fs';
const configDirectory = resolve(process.cwd(), "prod");
import path from 'path';
import {fileURLToPath} from 'url';
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

app.use(express.static(join(__dirname, 'images')))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({limit: '1mb', extended: false}))

app.get('/', function (req, res) {
    const file = readFileSync(join(configDirectory, './index.html'), "utf8");
    res.status(200).send(file)
})

app.post('/rewrite', async(req, res) => {
   console.log(req.body)
    let document = await bypass(req.body.document)
    res.status(200).send({document}) 
})



  
const PORT = 80

app.listen(PORT, () => console.log(`listening on port ${PORT}`))