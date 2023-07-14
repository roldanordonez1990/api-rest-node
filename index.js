//ESTE SCRIPT SE VA A EJECUTAR AUTOMÁTICO PORQUE ESTÁ INDICADO EN START DEL PACKAGE.JSON

//Importamos la clase de conexión
const{ conection } = require("./database/conection");
//Importamos el FW para hacer las peticiones http
const express = require("express");
//Importamos el Cors
const cors = require("cors");
const { json } = require("express/lib/response");
const req = require("express/lib/request");
const res = require("express/lib/response");

console.log("Hola! Iniciado la API...");

//Llamamos a la función de conexión
conection();

//SERVIDOR NODE
const app = express();
const puerto = 3900;
//Los use son como Middleware. Se ejecutan antes de una acción. Aquí ejecutamos el cors antes de una ruta 
//para que no de problemas
app.use(cors())
//Con este use Middleware parseamos directamente los objetos json para ser utilizados
//En formato content-type app/json
app.use(express.json());
//Aqui en formato form-urlencoded
app.use(express.urlencoded({extended: true}));
//Crear servidor y escuchar peticiones http
app.listen(puerto, () =>{
    console.log("Servidor corriendo y escuchando en el puerto: " +puerto);
});

//RUTAS Y PETICIONES HTTP

//Importamos la clase de rutas
const rutas = require("./routes/rutas");
//Cargamos las rutas en express
//El primer parámetro es opcional, le indicamos lo que queramos con que empiece la url de nuestras rutas. Un segmento añadido 
app.use("/api", rutas);

//Con send podemos enviar lo que queramos. Datos, Objetos, HTML....
app.get("/probando", (req, res) =>{

    return res.status(200).send({
        nombre: "Franciso",
        profesion: "Web Developer"
    })
})

