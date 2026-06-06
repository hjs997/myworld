const mineflayer = require('mineflayer');
const express = require('express');

// 启动 Web 服务，应付 Render 的健康检查和防休眠 Ping
const app = express();
app.get('/', (req, res) => {
  res.send('Docker server is running strong!'); 
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Web 服务已在容器端口 ${port} 启动`);
});

// 核心 Bot 逻辑
function createBot() {
  const bot = mineflayer.createBot({
    host: '15.235.212.121', // 务必替换成你的服务器IP
    port: 11826,               // 替换为你的服务器端口
    username: 'myworldhappy',     // 你的假人名字
    version: false             // 自动适配 Paper 服务端版本
  });

  bot.on('spawn', () => {
    console.log('✅ 容器假人已成功空投进 Minecraft 服务器！');
    
    // 防暂离：每 5 分钟跳跃一次
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 1000);
      console.log('Bot 执行了战术跳跃。');
    }, 300000);
  });

  bot.on('error', err => console.log('❌ 容器内部错误:', err));
  
  bot.on('end', () => {
    console.log('⚠️ 连接断开，10秒后尝试重新部署接入...');
    setTimeout(createBot, 10000);
  });
}

createBot();
