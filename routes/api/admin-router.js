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

router.get('/product/add', async (req, res) => {
  res.render('Admin/addProduct', 
  { 
    title: 'Agregar nuevo producto',
    style: 'Admin'
  })
})

router.post('/products/add', async (req, res) => {
  await productManager.create(req.body)
  
  res.redirect('/Admin/product/add')
})

module.exports = router