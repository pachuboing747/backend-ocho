const{ Router } = require("express");
const ProductRoutes = require ("./api/Products-router.js");
const CartsRoutes = require ("./api/Cart-router.js");
const HomeRoutes = require ("./api/Home-router.js");
const UserRoutes = require('./api/user-router.js')
const AdminRoutes = require('./api/admin-router.js')

const api = Router()

// rutas de productos
api.use("/products", ProductRoutes)
api.use('/users', UserRoutes);

// rutas del carrito
api.use("/carts", CartsRoutes)
api.use('/admin', AdminRoutes)

const home = Router ()

home.use("/", HomeRoutes)



module.exports = {
    api, 
    home,
};