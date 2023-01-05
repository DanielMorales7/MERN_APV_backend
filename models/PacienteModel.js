import mongoose from "mongoose";

// se crea relación del paciente con el veterinario, su relación es a través del veterinario
const pacientesSchema = mongoose.Schema({
    nombre:{
        type:String,
        required: true
    },
    propietario:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    fecha:{
        type:Date,
        required: true,
        default: Date.now()
    },
    sintomas:{
        type:String,
        required: true
    },
    veterinario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "VeterinarioModel"
    },
},
{
    timestamps:true,
}
);

const PacienteModel = mongoose.model("PacienteModel", pacientesSchema);
export default PacienteModel;


