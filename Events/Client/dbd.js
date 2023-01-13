module.exports = {
    discord: {
        token: process.env.TOKEN,
        client: {
            id: process.env.CLIENT_ID,
            secret: process.env.CLIENT_SECRET,
        },
    },
    dbd: {
        port: process.env.DBD_PORT,
        domain: process.env.DBD_URL,
        redirectUri: process.env.DBD_REDIRECT_URI,
        license: process.env.DBD_LICENSE,
        ownerIDs: ["424868316398747648"]
    }
}