//Importamos las propiedades desestructuradas de moongose para crear objetos de la BD
const { Schema, model } = require("mongoose");

const ArticuloSchema = {
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    imagen: {
        type: String,
        default: "default.png",
        required: false
    }
}

//con model damos nombre al modelo (objeto), es el primer parámetro. Segundo el Schema y el tercero el collection de la BD
 module.exports = model("Articulos", ArticuloSchema, "articulos");