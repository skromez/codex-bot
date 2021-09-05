import { TeamSpeak } from 'ts3-nodejs-library';
import { MessageEmbed } from 'discord.js';
const { Client, Intents } = require('discord.js');

const discordToken = '';
const TSHost = '';
const TSPort = null;
const TSUsername = '';
const TSPassword = '';
const TSNickname = '';
const channelID = '';

(async() => {
  try {
    const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS] });
    await discordClient.login(discordToken);

    const TSClient = await TeamSpeak.connect({
      host: TSHost,
      serverport: TSPort,
      username: TSUsername,
      password: TSPassword,
      nickname: TSNickname,
    })

    let embedMessage;
    setInterval(async () => {
      const clients = await TSClient.clientList({ clientType: 0 })
      const users = clients.map((user) => ({
        nickname: user.nickname,
        muted: user.inputMuted || user.outputMuted,
      })).sort((a, b) => {
        const nicknameA = a.nickname.toLowerCase();
        const nicknameB = b.nickname.toLowerCase();
        if (nicknameA < nicknameB) {
          return -1;
        }
        if (nicknameA > nicknameB) {
          return 1;
        }
        return 0;
      })


      const msg = new MessageEmbed()
        .setAuthor('Codex Voice Activity')
        .setTitle('TeamSpeak Link')
        .setURL('https://goo.gl/VuSOxn')
        .setTimestamp(new Date())
        .setFooter('\u3000'.repeat(1000000))

      const usersString = `Users currently on TeamSpeak \n \n ${users.map((u) => {
        return `${u.muted ? ':mute:' : ':sound:'} ${u.nickname}`
      }).join('\n')} \n`

      msg.setDescription(usersString)

      const channel = discordClient.channels.cache.get(channelID)
      if (!embedMessage) {
        embedMessage = await channel.send({embeds: [msg]})
      } else {
        embedMessage.edit({ embeds: [msg]})
      }
    }, 1000 * 60)
  } catch (e) {
    console.log(e)
  }
})();
