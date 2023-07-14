//require es como el import. Para las dependencias.
//require lo que hace es buscar dentro del node_module la dependencia.
const mongoose = require("mongoose")

//Función de conexión con la BD
const conection = async() =>{

    try {

      //Conexión con la BD
      await mongoose.connect("mongodb://127.0.0.1:27017/blog");
      console.log("Conectado correctamente con la BD");
        
    } catch (error) {
        console.log("Error" + error)
        throw new Error("No se ha realizado la conexión")
    }

}

//Esto es como el export de React para dar salida a la función
module.exports = {
    conection
}