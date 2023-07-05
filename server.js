const express = require('express')
const { logger } = require("#functions/Logger.js")
const app = express()

const adminRoute = require('#endpoints/admin.js')
app.use('/admin', adminRoute)

const statusRoute = require("#endpoints/status.js")
app.use("/status", statusRoute)

const operationsRoute = require("#endpoints/operations.js")
app.use("/operations", operationsRoute)

app.listen(4018, () => {
  logger(`[https://api.oratorbot.xyz] Started at port 4018`, "success")
})