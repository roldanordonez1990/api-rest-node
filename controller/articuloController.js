const req = require("express/lib/request");
const res = require("express/lib/response");
const {validacion} = require("../utils/validar")
const Articulos = require("../modelo/Articulos");
const fs = require("fs");
const path = require("path");

//Este va a ser el controlador con el cual definamos la lógica de las peticiones y consultas
const prueba = (req, res) =>{
    return res.status(200).json({
        mensaje: "Soy un mensaje de prueba"
    });
}

const prueba2 = (req, res) =>{
    return res.status(200).json({
        nombre: "Franciso",
        profesion: "Web Developer"
    })
}

//Se tiene que hacer con async await porque con versiones recientes de mongoose no funciona sin ellas
const crear = async(req, res) => {
    try {
        //Recogemos los datos del body
        let parametros = req.body;
        //Validamos los datos con la libreria validator
        validacion(parametros);
        //Guardamos el objeto en la BD
        const articulo = await new Articulos(parametros).save();

        return res.status(200).json({
            articulo: articulo,
            mensaje: "Artículo guardado correctacmente"
        });

    } catch (error) {
        return res.status(400).json({
            mensaje: "No se ha guardado el artículo"
        });         
    }   
}

//Se tiene que hacer con async await porque con versiones recientes de mongoose no funciona sin ellas
const listar = async (req, res) => {
    try {
        //Con sort -1 ordena de más reciente a más viejo
        let lista = await Articulos.find({}).sort({fecha: -1}); 

        //Si queremos separar los filtros para hacer condiciones tiene que ser así y no todo en uno.
        //No funciona si hacemos: lista.limit(2), hay que escribirlo completo ya que necesita el await
        if(req.params.num){
            let num = parseInt(req.params.num);
            //Con limit limitamos los que queremos que salgan
            lista = await Articulos.find({}).limit(num).sort({fecha: -1});
        }
        
        if(lista != null){
            return res.status(200).json({
                articulos: lista,
                número: lista.length,
                mensaje: "Listado de todos los artículos"
            });

        }else{
            throw new Error("No hay listado");
        }
        
    } catch (error) {
        return res.status(400).json({
            mensaje: "No es posible mostrar el listado"
        });
    }
}

const getArticle = async(req, res) =>{
    try {
        //Obtenemos el id por el parámetro
        let id = req.params.id;
        //Filtramos por id
        const article = await Articulos.findById(id);

            if(article != null){
                return res.status(200).json({
                    articulo: article,
                    mensaje: "Artículo filtrado"
                });

            }else{
                throw new Error("No se encuentra el artículo");
            }
    } catch (error) {

        return res.status(400).json({
            mensaje: "No es posible encontrar el artículo"
        });
    }  
}

const borrar = async(req, res) =>{
    try {
        let id = req.params.id;
        const articulo_borrado = await Articulos.findByIdAndDelete({_id: id}); //_id es como viene en MongoDB

        if(articulo_borrado != null) {
            return res.status(200).json({
                mensaje: "Artículo borrado con éxito"
            });
        }else{
            throw new Error("No se ha podido borrar el artículo");
        }
        
    } catch (error) {
        return res.status(400).json({
            mensaje: "No es posible borrar el artículo"
        });
    }
}

const editar = async(req, res) =>{
    try {
        //Conseguimos el id
        let id = req.params.id;
        //Conseguimos los nuevos parámetros
        let parametros = req.body;
        //Validamos los nuevos valores
        validacion(parametros);
        //Actualizamos el artículo
        //primer parámetro haciendo referencia al id del objeto va entre {}
        //Con el new: true, le decimos que devuelva el objeto actualizado. False o no poniendo nada devuelve el antiguo primero
        const articulo_actualizado = await Articulos.findByIdAndUpdate({_id: id}, parametros, {new: true});

        if(articulo_actualizado != null){
            return res.status(200).json({
                articulo: articulo_actualizado,
                mensaje: "Artículo actualizado correctamente"
            });
        }else{
            throw new Error(err)
        }
        
    } catch (error) {
        return res.status(400).json({
            mensaje: "No se ha podido actualizar el artículo"
        });
    }
}

const subirImg = async(req, res) =>{
    if(!req.file){
        return res.status(400).json({
            mensaje: "Petición inválida"
        });
    }
    //Obtenemos el nombre de la imagen subida
    let nombre_img = req.file.originalname;
    //Obtenemos la extensión usando split y cortando a partir del punto
    //extensión devolverá un array. Ej: Si el nombre es Woody.jpg -> ["Woody", "jpg"]
    let extension_split = nombre_img.split(".");
    let extension = extension_split[1];
    //Comprobamos la extensión
    if(extension != "jpg" && extension != "png" && extension != "jpeg"){
        //fileSistem (fs) es una librería con la cual podemos borrar el fichero
        //Le pasamos el path completo
        //Hace falta pasar callback
        fs.unlink(req.file.path, (error) =>{
            return res.status(400).json({
                mensaje: "Formato incorrecto. Archibo no subido"
            });
        });

    }else{
        //Actualizamos el artículo con la imagen
        let id = req.params.id;
        const articulo_actualizado = await Articulos.findByIdAndUpdate({_id: id}, {imagen: req.file.filename}, {new: true});
        return res.status(200).json({
            articulo_actualizado: articulo_actualizado,
            extension: extension,
            file: req.file,
            mensaje: "Imagen subida correctamente"
        });
    }     
}

const getImg = (req, res) =>{
    //Obtenemos la ruta completa de la imagen
    let ruta_fisica = "./images/articulos/" +req.params.filename;
    //el método stat dentro de fileSystem, nos dice si existe o no esa ruta
    fs.stat(ruta_fisica, (err, existe) =>{
        if(existe){
            //Si existe, se envía con la librería path
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                mensaje: "No se encuentra la ruta"
            });
        }
    })
}

const buscar = async(req, res) => {
    //Obtenemos el texto de la ruta
    if(req.params.texto){
        let texto = req.params.texto;
        //Con el método find, podemos hacer búsquedas tipo SQL
        //En este caso, el $or sería como hacer un || en una condición: 
        //Si sólo buscásemos por título, valdría poner $and
        //Pero como buscamos por título OR descripción, usamos $or
        //"Select * from blog where titulo = texto"
        //Luego dentro lleva un array en el que podemos indicar condiciones. 
        //En este caso que en el título se incluya el texto.
        const articulo_encontrado = await Articulos.find({"$or": 
        [
            //con las opciones de la regex, la "i" significa que si el texto se INCLUYE
            {"titulo": {"$regex": texto, "$options": "i"}},
            {"descripcion": {"$regex": texto, "$options": "i"}}
        ]}).sort({fecha: -1});

        if(!articulo_encontrado || articulo_encontrado.length <= 0 || articulo_encontrado == null){
            return res.status(404).json({
                mensaje: "No se encuentra el artículo"
            });

        }else{
            return res.status(200).json({
                resultados: articulo_encontrado.length,
                articulo: articulo_encontrado,
                mensaje: "Artículo encontrado con éxito"
            });
        }
    }else{
        return res.status(400).json({
            mensaje: "No has introducido ningún texto de búsqueda"
        });
    }   
}

module.exports = {
    prueba,
    prueba2,
    crear,
    listar,
    getArticle,
    borrar,
    editar,
    subirImg,
    getImg,
    buscar
}