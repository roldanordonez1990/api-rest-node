const validator = require("validator");

const validacion = (parametros) =>{
    //isEmpty es un boolean que si está vacío devuelve true
    const titulo_validado1 = validator.isEmpty(parametros.titulo);
    //isLength es un boolean que devuelve true o false según se cumpla el filtro
    const titulo_validado2 = validator.isLength(parametros.titulo, {min: 4, max: undefined});
    const descripcion1 = validator.isEmpty(parametros.descripcion);
    const descripcion2 = validator.isLength(parametros.descripcion, {min: 5, max: undefined});
    //Condiciones para que NO cumpla los requisitos
    if(titulo_validado1 || !titulo_validado2 || descripcion1 || !descripcion2){
        throw new Error("No cumple los requisitos");
    }
}

module.exports = {
    validacion
}