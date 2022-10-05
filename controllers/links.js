const {
  createLink,
  getAllLinks,
  getLinkById,
  deleteLinkById,
} = require('../db/links');

const { generateError } = require('../helpers');

// Controlador para crear un nuevo link
const newLinkController = async (req, res, next) => {
  try {
    const { url, title, description } = req.body;

    console.log(req.body);

    if (!url || url.length > 300) {
      throw generateError(
        'Debe introducir una url correcta o de menos de 300 caracteres',
        400
      );
    }

    const id = await createLink(req.userId, url, title, description);

    const link = await getLinkById(id);

    res.send({
      status: 'ok',
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

// Controlador que devuelva los links existentes
const getLinksController = async (req, res, next) => {
  try {
    const links = await getAllLinks();

    res.send({
      status: 'ok',
      data: links,
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para devolver un link concreto
const getSingleLinkController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const link = await getLinkById(id);

    res.send({
      status: 'ok',
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para borrar un link (sólo el del propio usuario)
const deleteLinkController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const link = await getLinkById(id);

    if (req.userId !== link.user_id) {
      throw generateError(
        'Estás intentando borrar un enlace que no es tuyo',
        401
      );
    }

    // Borrar el link
    await deleteLinkById(id);

    res.send({
      status: 'ok',
      message: `El link con id: ${id} ha sido borrado`,
    });
  } catch (error) {
    next(error);
  }
};

// Exporto funciones de controladores de rutas de links
module.exports = {
  newLinkController,
  getLinksController,
  getSingleLinkController,
  deleteLinkController,
};
