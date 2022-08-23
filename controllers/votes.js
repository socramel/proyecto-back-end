const { getLinkById } = require("../db/links");
const { newVote } = require("../db/votes");
const { generateError } = require("../helpers");

const newVoteController = async (req, res, next) => {
    try {
        const {id} = req.params;

        const link = await getLinkById(id);

        if(req.userId === link.user_id) {
            throw generateError('No puedes votar tu propio link', 401)
        }

        await newVote(req.userId, link.id)

        res.send({
            status: 'ok',
            message: 'Gracias por votar'
        });
    } catch(error) {
        next(error);
    }
};

module.exports = {
    newVoteController,
};