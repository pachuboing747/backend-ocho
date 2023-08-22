const { Router } = require('express')
const router = Router();
const productManager = require('../../dao/managers/ProductManager.js')

router.use((req, res, next) => {
  if (req.user?.isAdmin) {
    console.error('Acceso no autorizado');
    next();
  } else {
    res.redirect('/login');
  }
});



module.exports = router