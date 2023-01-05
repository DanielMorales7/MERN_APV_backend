import jwt  from "jsonwebtoken";
import VeterinarioModel from "../models/VeterinarioModel.js";

const checkAuth = async (req, res, next) => {

    // la librería de JWT te permite crearlo pero también validarlo
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        
        try {
            token = req.headers.authorization.split(" ")[1]; // se asigna a la variable token el array de la posición 1 de la cadena separada (el token sin el bearer)
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica que el token que hayas mandado sea correcto
            
            // al hacer req.veterinario lo almacena en express y crea un sesión 
            req.veterinario = await VeterinarioModel.findById(decoded.id).select(
                "-password -token -confirmado"
            );
            
            return next();
            
        } catch (error) {
            
            const e = new Error("Token no válido");
            return res.status(403).json({msg: e.message});
            
        }
        
    }
    if (!token) {
        
        const error = new Error("Token no válido o inexistente");
        res.status(403).json({msg: error.message});

    }
    next();
}

export default checkAuth;