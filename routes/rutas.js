//Importamos express
const express = require("express");
//Dentro de express, accedemos al método Router para definir las rutas
const router = express.Router();
//Importamos el controlador para usarlo como segundo parámetro en la ruta de petición
const articuloController = require("../controller/articuloController");
//Importamos multer para la subida de img
const multer = require("multer");
//Configuramos el almacenamiento de img. 
const almacenamiento = multer.diskStorage({
    //cb es la ruta donde queremos guardar
    destination: (req, file, cb) => {
        cb(null, "./images/articulos");
    },
    //cb en este caso es el nombre del FILENAME que le queremos dar al fichero subido.
    //Empieza por la palabra artículo + fecha + nombre original.
    filename: (req, file, cb) => {
        cb(null, "articulo" + Date.now() + file.originalname);

    }
});
//Una vez configurado el almacenamiento, lo añadimos a multer en el param storage.
//Esto va a actuar como un MIDDLEWARE, o sea, esta acción se va a ejecutar ANTES que el método de HTTP
const subidas = multer({storage: almacenamiento});

//DEFINIMOS LAS RUTAS
router.get("/prueba", articuloController.prueba);
router.get("/prueba2", articuloController.prueba2);
router.post("/crear", articuloController.crear);
router.get("/listar/:num?", articuloController.listar); //parámetro opcional si ponemos la ?
router.get("/articulo/:id", articuloController.getArticle);
router.delete("/articulo/:id", articuloController.borrar);
router.put("/articulo/:id", articuloController.editar);
//Single es porque se va a subir un solo fichero. Y el nombre "File" es el que debemos usar como Key al subir. 
//Se puede poner el que quieras
router.post("/subir-img/:id", [subidas.single("file")], articuloController.subirImg);
router.get("/imagen/:filename", articuloController.getImg);
router.get("/buscar/:texto?", articuloController.buscar);


module.exports = router;