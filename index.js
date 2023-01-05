import express from "express";
import dotenv from  'dotenv';
import cors from 'cors'
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js"
import pacienteRoutes from "./routes/pacienteRoutes.js"

// cuando importas dependencias no necesitas la extensión, pero cuando son tus archivos, si

const app = express();

app.use(express.json()); //se utiliza para enviar datos desde api usando json

dotenv.config(); // extensión para utilizar las variables de entrono

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {

    origin: function (origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1){

            // El origen del request está en el parametro
            callback(null, true);
        } else {
            callback( new Error(`No permitido por CORS ${origin}`));
        }
    }

}


//console.log(process.env.MONGO_URI);

// sintaxis propias de express request y response => esto maneja el routing del servidor 

// NOTA, la primera vez no funcionó, se baja y se inicia npm start eso pasó porque se inició antes de colocar el req y res

app.use(cors(corsOptions));

app.use('/api/veterinarios',veterinarioRoutes);
app.use('/api/pacientes',pacienteRoutes);


// ************** las dependencias de desarrollo son ignoradas en el deployment

// se asigna la función express a la variable app


// inicial la varaible, si no existe process.env.PORT aplicale el puero 4000
const PORT = process.env.PORT || 4000;



app.listen(PORT, ()=> {
    console.log(`Servidor Funcionando en el puerto ${PORT}`);
    
});
