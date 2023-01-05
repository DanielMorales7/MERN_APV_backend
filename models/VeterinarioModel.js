import mongoose from "mongoose";
import bcrypt from "bcrypt";
import genrarId from "../helpers/generarId.js";

const veterinarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono:{
        type: String,
        default: null,
        trim: true
    },
    web:{
        type:String,
        default:null
    },
    token:{
        type: String,
        default: () => genrarId(),
    },
    confirmado:{
        type: Boolean,
        default: false
    }
});

//Mongoose tiene hook que permiten realizar acciones antes y después de operar como pre y post
veterinarioSchema.pre('save', async function(next){ // se utiliza function para el buen uso de this
    // Se genera una instancia del objeto que podemos utilizar con this
    
    if(!this.isModified("password")){ // esto indica que si el passwprd ya fue hasehado vaya al siguiente
        next();
    }

    const salt = await bcrypt.genSalt(10); // se genera el hash
    this.password = await bcrypt.hash(this.password, salt); // se asigna la contraseña hasehada
    
});


veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){

    return await bcrypt.compare(passwordFormulario, this.password); //Regressa un boolean

};

const VeterinarioModel = mongoose.model("VeterinarioModel",veterinarioSchema);
export default VeterinarioModel;