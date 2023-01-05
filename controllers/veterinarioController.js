
import VeterinarioModel from "../models/VeterinarioModel.js";
import generarJWT from "../helpers/generarJWT.js";
import genrarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {

    console.log(req.body);

    const {email, nombre, telefono} = req.body;

    //Prevenir usuarios duplicados
    const existeUsuario = await VeterinarioModel.findOne({email}); //variable que se inicializa y verifica si existe email

    if(existeUsuario){
        const error = new Error("Usuario ya registrado"); // el new Error se almacena en error.message
        return res.status(400).json({msg: error.message});
    }
    

    try {
        // Guardar un veterinario
        const veterinario = new VeterinarioModel(req.body); // se instancia un variable con el modelo y el body de lo que se manda
        const veterinarioGuardado = await veterinario.save(); // .save es parte de moongse y guarda los datos

        // Enviar el emil
        emailRegistro({
            email,
            nombre,
            telefono,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);
    } catch (error) {

       console.log(error);
        
    }

};

const perfil = (req,res)=>{

    const {veterinario} = req;
    
    res.json({
        _id: veterinario._id,
        nombre: veterinario.nombre,
        email: veterinario.email,
        telefono: veterinario.telefono,
        web: veterinario.web,
        token: generarJWT(veterinario.id)
    });
}

const confirmar = async (req, res) => {
    // console.log(req.params.token); // variable que trae el valor del parametro-> el token
    
    //como nombres tu parametro se manda a llamar en params req.params."nombre de tu parametro"
    const {token} = req.params;

    const usurioConfimar = await VeterinarioModel.findOne({token:token}); //{token:token} nombre del atributo y el valor del token

    if(!usurioConfimar){
        const error = new Error('Token no válido');
        return res.status(404).json({msg: error.message});
    }
    
    try {

        // como la variable usuarioConfirmar es una instancia del objeto se puede modificar

        usurioConfimar.token = null;
        usurioConfimar.confirmado = true;
        await usurioConfimar.save();
        
        res.json({msg:"Usuario confimdo correctamente"});
        
    } catch (error) {
        
        console.log(error);
        
    }
   
}

const autenticar = async (req, res) =>{

    const {email, password} = req.body;
    
    // comprobar si el usuario existe
    const usuario = await VeterinarioModel.findOne({email});

    if(!usuario){
        
        const error = new Error("El usurio no existe");
        return res.status(404).json({ msg: error.message})
        
    }
    //Comprobar si el usuario está comprobado
    if(!usuario.confirmado){

        const error = new Error("El usuario no está confirmado");
        return res.status(403).json({msg: error.message});
    }

    //Revisar el password
    if( await usuario.comprobarPassword(password)) { // se puede utilizar comprobas password por la instancia de la BD

        console.log(usuario);
        
        //usuario.token = generarJWT(usuario.id)
        res.json({
           _id: usuario._id,
           nombre: usuario.nombre,
           email: usuario.email,
           token: generarJWT(usuario.id)
        });
        
    }else{
        const error = new Error("El password es incorrecto");
        return res.status(403).json({msg: error.message});
        
    }

};

const olvidePasword = async (req, res) =>{

    const {email} = req.body;

    const existeVeterinario = await VeterinarioModel.findOne({email});

    if(!existeVeterinario){
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message});
    }
    
    try {

        existeVeterinario.token = genrarId();
        await existeVeterinario.save();

        //Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre:existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({msg: "Hemos enviado un email con las instrucciones"});
        
    } catch (error) {
        
        console.log(error);
        
    }
}

const comprobarToken = async (req, res) => {

    const {token} = req.params;

    const tokenValido = await VeterinarioModel.findOne({token});

    if(tokenValido){

        res.json({ msg: "Token válido y el usuario existe"});
    }else{

        const error = new Error("Token no válido");
        return res.status(400).json({ msg: error.message});

    }
}

const nuevoPassword = async (req, res) => {

    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await VeterinarioModel.findOne({token});
    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg:error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save()
        res.json({msg: 'Password modificado correctamente'});
        
    } catch (error) {

        console.log(error);
        
    }
}

const actualizarPerfil = async(req, res) =>{
    const veterinario = await VeterinarioModel.findById(req.params.id);
    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg:error.message})
    }

    const {email} = req.body;
    if(veterinario.email !== req.body.email){
        const existeEmail = await VeterinarioModel.findOne({email});
        if(existeEmail){
            const error = new Error("Ese email ya está en uso");
            return res.status(400).json({msg: error.message})
        }
    }
    
    try {

        veterinario.nombre   = req.body.nombre   ;
        veterinario.email    = req.body.email    ;
        veterinario.web      = req.body.web      ;
        veterinario.telefono = req.body.telefono ;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
        
    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async (req, res) =>{

    //leer datos
    const {id} = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;

    // comprobar que el veterinario exista
    const veterinario = await VeterinarioModel.findById(id);
    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg:error.message})
    }

    // comprobamos su password

    if(await veterinario.comprobarPassword(pwd_actual)){
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: 'Password Almacenado Correctamente'});
    }else{
        const error = new Error("El password Actual es incorrecto");
        return res.status(400).json({msg:error.message})
    }

}

export { registrar, perfil, confirmar, autenticar, olvidePasword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword }