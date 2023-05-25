const express = require("express")
const app = express()
const adminRoute = require('#endpoints/admin.js')
app.use('/admin', adminRoute)
app.listen(4018, () => {
  console.log(`[https://api.oratorbot.xyz] Started at port 4018`)
})