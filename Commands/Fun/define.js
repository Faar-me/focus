const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'define',
    description: `Looks up a term in the dictionary.`,
    usage: 'define `term`',
    guildOnly: true,
    async execute(message, args, prefix) {
        if (!args[0]) {
            message.channel.send(`Proper command usage: ${prefix}define [term]`);
            return message.react('❌');
        }
        let term = args.join(' ');
        let data = await fetch(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${term}?key=abef1297-7c98-456d-8682-4b605eb9c29b`)
            .then(res => res.json());
        if (!data[0])
            return message.channel.send(`Couldn't find any results for ${term}`);
        let synonyms = '```';
        data[0].meta.syns[0].map(syn => {
            synonyms = synonyms + syn + ', ';
        })
        synonyms = synonyms + '```';
        let defineembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(`What does ${args[0]} mean?`)
            .addFields(
                { name: 'Definition', value: `${data[0].def[0].sseq[0][0][1].dt[0][1]}` },
                { name: 'Synonyms', value: `${synonyms}` }
            )
            .setTimestamp();
        message.react('✔️');
        message.channel.send(defineembed);
    }
}