const { ShardingManager } = require('discord.js');
const DSU = require("dbdsoftuishardstats");

const manager = new ShardingManager('./Structures/index.js', { token: "MTA1Nzk1NDA3MTAzNTc4MTI0MA.G_c2tj.4Rh5DPb-E50RhsQaR6jxxIrBenIELPDA5xI7mE" });

manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`)
});

manager.spawn()