const {Router} = require ("express");
const productManager =require("../../dao/managers/ProductManager.js")
const cartsManager = require ("../../dao/managers/CartsManager.js")
const userManager = require ("../../dao/managers/userManager.js")
const auth = require("../../midlewares/auth.js")

const router = Router()


router.get("/", async (req, res) => {
    const { page = 1, limit = 10, sort, query } = req.query;
 
    const pageValue = parseInt(page);
    const limitValue = parseInt(limit);
 
    const { docs: products, ...pageInfo } = await productManager.getAllPaginate(pageValue, limitValue);
  
    let filteredProducts = products;
    if (query) {
      filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    if (sort === "asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}` : "";
    pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}` : "";
  
    res.render("home", {
    title: "Productos",
    products: filteredProducts,
    pageInfo,
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user?.role === 'Admin',
    } : null,
    style: "home"
  });
    
});
  

router.get("/carts", async(req, res)=>{

  const carts = await cartsManager.getAll()
    res.render("carts", {
    title: "Carrito",
    carts,
    style: "carrito"
  })
})

router.get("/realTimesProducts", async(req, res)=>{

  const products = await productManager.getAll()
    res.render("realTimesProducts", {
    title: "RealTimesProducts",
    products,
    style: "realTime"
  }
  
  )
    
})

router.get("/chat", (req, res)=>{
    res.render("chat",{
        title: "Chat",
        style:"home"
    })
    
})

router.post("/realTimesProducts", async (req, res) => {
    try {
      const requestData = req.body;
      const response = { message: "Solicitud POST exitosa", data: requestData };
      res.status(200).json(response);
    } catch (error) {
    
      const errorMessage = "Ocurrió un error durante el procesamiento de la solicitud POST.";
      res.status(500).json({ error: errorMessage });
    }
});

router.get("/products", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageValue = parseInt(page);
  const limitValue = parseInt(limit);

  const { docs: products, ...pageInfo } = await productManager.getAllPaginate(pageValue, limitValue);

  res.render("products", {
    title: "Productos",
    products,
    pageInfo,
    style: "products"
  });
});

router.get('/login', (_, res) => res.render('login'))

router.post('/login', async (req, res) => {
  const { email } = req.body

  try {

    const user = await userManager.getByEmail(email)

    if (!user) {
      return res.render('login', { error: 'El usuario no existe' })
    }

    req.session.user = {
      name: user.firstname,
      id: user._id,

      ...user
    }

    req.session.save((err) => {
      if(!err) {
        res.redirect('/')
      }
    })
  } catch(e) {
    res.render('login', { error: 'Ha ocurrido un error' })
  }
  
})

router.get('/logout', auth, (req, res) => {

  res.clearCookie('user')

  req.session.destroy((err) => {
    if(err) {
      return res.redirect('/error')
    }

    res.render('logout', {
      user: req.user.name
    })

    req.user = null
  })

})

router.get("/profile", auth, (req,res)=>{
  res.render("profile",{
    ...req.session.user
  })
})

router.get('/signup', (_, res) => res.render('signup'))
router.post('/signup', async (req, res) => {
  const user = req.body
  
  console.log(user)

  const existing = await userManager.getByEmail(user.email)

  if (existing) {
    return res.render('signup', {
      error: 'El email ya existe'
    })
  }

  try {
    const newUser = await userManager.create(user)

    req.session.user = {
      name: newUser.firstname,
      id: newUser._id,
      ...newUser._doc
    }

    console.log(req.session)

    req.session.save((err) => {
      res.redirect('/')
    })

  } catch(e) {
    return res.render('signup', {
      error: 'Ocurrio un error. Intentalo mas tarde'
    })
  }
})

module.exports = router;