import express from "express";
const router = express.Router();
import {agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente} from '../controllers/pacienteController.js';

import checkAuth from '../middleware/authMiddleware.js';

// mantienete la referencia del index.js /api/pacientes y cuando se manda post ejecuta agregar y cuando se ejecuta get, obtener paciente
router.route('/')
    .post(checkAuth, agregarPaciente)
    .get(checkAuth, obtenerPacientes);


router 
    .route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente);

export default router;