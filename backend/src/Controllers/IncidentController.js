const connection = require('../database/connection')
const {  getConnections, sendMessage } = require('../websocket');

module.exports = {
    async indexUnique(request, response) {
        const { id } = request.params;

        const incidents = await connection('incidents').where('id', id).first();
        
        return response.json(incidents);
    },

    async index(request, response) {
        const { page = 1 } = request.query;

        const [count] = await connection('incidents').count();

        const incidents = await connection('incidents') 
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .limit(5)
        .offset((page - 1) * 5)
        .select(['incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf'
        ]);

        response.header('X-Total-Count', count['count(*)'])

        return response.json(incidents);
    },

    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

      const [id]  =  await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        const incident = await connection('incidents') 
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .where('incidents.id', id)
        .select(['incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf'
        ]);

        const sendSocketMessageTo = getConnections();

        console.log('usuarios:');
        console.log(sendSocketMessageTo);
        console.log(incident);

        sendMessage(sendSocketMessageTo, 'new-incident', incident);

        return response.json({ id });
    },

    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if (incident.ong_id !== ong_id) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    },

    async update(request, response){
        const {id, title, description, value} = request.body;
        const ong_id = request.headers.authorization;

        const a = await connection('incidents').update({
            title,
            description,
            value
        }).where({ ong_id, id });

        return response.status(204).send();
    },
}