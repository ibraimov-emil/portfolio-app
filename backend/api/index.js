const strapi = require('@strapi/strapi');

let strapiInstance;

module.exports = async (req, res) => {
    if (!strapiInstance) {
        strapiInstance = await strapi({ distDir: './dist' }).load();
    }
    strapiInstance.server.app.callback()(req, res);
};
