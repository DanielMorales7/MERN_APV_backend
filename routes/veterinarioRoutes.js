import  express from "express";
const router = express.Router();
import { registrar, perfil, confirmar, autenticar, olvidePasword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } from "../controllers/veterinarioController.js";

import checkAuth from '../middleware/authMiddleware.js';

// ruta, función que se hace en esa ruta ÁREA PUBLICA
router.post("/", registrar);
router.get("/confirmar/:token", confirmar); //En express puedes poner una ruta dinamica con :
router.post("/login", autenticar);
router.post("/olvide-password", olvidePasword); //valida email del usuario
router.get("/olvide-password/:token", comprobarToken); //lee el token
router.post("/olvide-password/:token", nuevoPassword); // cambiar a la nueva contraseña

// router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword) --> esto es lo mismo que los dos edpoints de arriba

// ÁREA PRIVADA
router.get("/perfil", checkAuth, perfil); // lo que hace esto es que primero cheque que esté autenticado, con el next salta al siguiente middleware que es perfil
router.put("/perfil/:id",checkAuth, actualizarPerfil);
router.put("/actualizar-password",checkAuth,actualizarPassword);

export default router;