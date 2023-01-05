import PacienteModel from "../models/PacienteModel.js";

const agregarPaciente = async (req, res) => {

    const paciente = new PacienteModel(req.body); // instancia la variable paciente con el modelo y toma los valores enviados en el endpoint
    
    paciente.veterinario = req.veterinario._id;

    try {

        const pacienteAlmacenado = await paciente.save();
        //console.log(paciente); // así lo almacena mondb
        res.json(pacienteAlmacenado);
        
    } catch (error) {

        console.log(error);
        
    }
    
    //res.json({msg:"Se agregará el paciente"});

}

const obtenerPacientes = async (req, res) =>{

    // const pacientes = await PacienteModel.find({veterinario})
    // req.veterinario => es una variable de sesion que tiene la información de los que están logueados

    console.log(req.veterinario);
    
    const pacientes = await PacienteModel.find()
        .where("veterinario")
        .equals(req.veterinario);

    res.json(pacientes);    
}

const obtenerPaciente = async (req, res)=>{

    const {id} = req.params;
    
    const paciente = await PacienteModel.findById(id);

    if(!paciente) return res.status(404).json({msg:"No encontrado"});
    
    // cuando es un objectId se tiene que cambiar a String para poder validar
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg:"Accion no valida"})
    }

    paciente && res.json(paciente);
} 

const actualizarPaciente = async (req, res)=> {

    const {id} = req.params;
    
    const paciente = await PacienteModel.findById(id);

    if(!paciente) return res.status(404).json({msg:"No encontrado"});

    // cuando es un objectId se tiene que cambiar a String para poder validar
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg:"Accion no valida"})
    }

    // Actualiza paciente

    paciente.nombre      = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email       = req.body.email || paciente.email;
    paciente.fecha       = req.body.fecha || paciente.fecha;
    paciente.sintomas    = req.body.sintomas || paciente.sintomas;

    // la variable paciente se le asigna en lo que venga en la petición, si no está se asigna el valor que tiene por defecto

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    } catch (error) {
        
        console.log(error);
        
    }

}

const eliminarPaciente = async (req, res) =>{

    const {id} = req.params;
    
    const paciente = await PacienteModel.findById(id);

    if(!paciente) return res.status(404).json({msg:"No encontrado"});

    // cuando es un objectId se tiene que cambiar a String para poder validar
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg:"Accion no valida"})
    }

    try {
        await paciente.deleteOne();
        res.json({msg:"Paciente Eliminado"});
    } catch (error) {
        
        console.log(error);
        
    }

}
export {agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente};