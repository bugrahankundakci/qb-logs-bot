const { Client, GatewayIntentBits, ChannelType, AttachmentBuilder } = require('discord.js');
const { Readable } = require('stream');
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
});

client.on('messageCreate', async message => {
    if (message.content.toLowerCase() === '!logkur') {
        message.channel.send('Kurulum başladı.');

        const category = await message.guild.channels.create({
            name: 'minik logs',
            type: ChannelType.GuildCategory,
        });

        const channelNames = [
            'default', 'testwebhook', 'playermoney', 'playerinventory', 'robbing',
            'cuffing', 'drop', 'trunk', 'stash', 'glovebox', 'banking',
            'vehicleshop', 'vehicleupgrades', 'shops', 'dealers', 'storerobbery',
            'bankrobbery', 'powerplants', 'death', 'joinleave', 'ooc', 'report',
            'me', 'pmelding', '112', 'bans', 'anticheat', 'weather', 'moneysafes',
            'bennys', 'bossmenu', 'robbery', 'casino', 'traphouse', '911',
            'palert', 'house', 'qbjobs', 'adminmenu'
        ];

        const webhookUrls = {};

        for (const name of channelNames) {
            const channel = await message.guild.channels.create({
                name: name,
                type: ChannelType.GuildText,
                parent: category.id
            });

            const webhook = await channel.createWebhook({
                name: `${name} Webhook`,
                avatar: client.user.displayAvatarURL(),
            });

            webhookUrls[name] = webhook.url;
            channel.send(`${name} Webhook URL: ${webhook.url}`);
        }

        let webhookData = 'Webhook URL\'leri:\n';
        for (const name in webhookUrls) {
            webhookData += `['${name}'] = '${webhookUrls[name]}',\n`;
        }

        const readableStream = Readable.from(webhookData);
        const attachment = new AttachmentBuilder(readableStream, { name: 'webhook_urls.txt' });
        message.channel.send({ content: 'Log kanalları ve webhooks başarıyla oluşturuldu!', files: [attachment] });
    }

    if (message.content.toLowerCase().startsWith('!kategorisil')) {
        const args = message.content.split(' ').slice(1);
        const categoryName = args.join(' ');

        const category = message.guild.channels.cache.find(c => c.name === categoryName && c.type === ChannelType.GuildCategory);
        if (!category) {
            return message.channel.send(`Kategori bulunamadı: ${categoryName}`);
        }

        for (const channel of category.children.cache.values()) {
            await channel.delete();
        }

        await category.delete();
        message.channel.send(`Kategori ve içindeki tüm kanallar silindi: ${categoryName}`);
    }
});

client.login('buraya botun tokenini gir');
