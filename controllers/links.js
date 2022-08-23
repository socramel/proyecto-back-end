const { createLink, getAllLinks, getLinkById, deleteLinkById } = require("../db/links");
const { generateError } = require('../helpers');

const newLinkController = async (req, res, next) => {

        try {
            const {url, title, description} = req.body;

            if(!url || url.length > 250) {
                throw generateError(
                    'Debe introducir una url correcta o de menos de 250 caracteres', 400
                );
            }
        
            const id = await createLink(req.userId, url, title, description);

        res.send({
            status: 'ok',
            message: `Link con id: ${id} creado correctamente`,
        });
    } catch(error) {
        next(error);
    }
};

const getLinkController = async (req, res, next) => {
    try {
        const links = await getAllLinks();

        res.send({
        status: 'ok',
        data: links,
         });
    } catch(error) {
        next(error);
    }
};

const deleteLinkController = async (req, res, next) => {

    try {
        const {id} = req.params;

        const link = await getLinkById(id);
    
        console.log(link);
    
        if(req.userId !== link.user_id) {
            throw generateError('Estás intentando borrar un enlace que no es tuyo', 401)
        }

        await deleteLinkById(id);

        res.send({
            status: 'ok',
            message: `El link con id: ${id} fue borrado`,
        });
    } catch(error) {
        next(error);
    }
};

// Exporto funciones de controladores de rutas de links
module.exports = {
    getLinkController,
    newLinkController,
    deleteLinkController,
};