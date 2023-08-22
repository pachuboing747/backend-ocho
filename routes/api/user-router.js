const { Router } = require('express')

const router = Router()
const manager = require('../../dao/managers/userManager.js')

router.post('/', async (req, res) => {
  const { body } =  req

  const created = await manager.create(body)

  res.send(created)
})

module.exports = router