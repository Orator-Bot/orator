const express = require('express')
const { logger } = require("#functions/Logger.js")
const app = express()

const adminRoute = require('#endpoints/admin.js')
app.use('/admin', adminRoute)

app.listen(4018, () => {
  logger(`[https://api.oratorbot.xyz] Started at port 4018`, "success")
})