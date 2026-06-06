const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.send('Docker Bot is running strong!'); 
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Web 服务已在容器端口 ${port} 启动`);
});

function createBot() {
  const bot = mineflayer.createBot({
    host: '15.235.212.121', // 记得改回你的 IP
    port: 11826,               // 记得改回你的端口
    username: 'myworldhappy',  // 你的假人名字
    version: false,
    physics: false             // 🚨 核心破解：直接在创建时关闭物理引擎！
  });

  bot.on('spawn', () => {
    console.log('✅ 假人已成功进服！');
    
    // 强制彻底禁用物理计算，防止 Paper 踢人
    bot.physicsEnabled = false; 

    // 改良版防暂离：每 5 分钟原地挥手 + 随机转头
    setInterval(() => {
      try {
        bot.swingArm('right'); // 挥动右手
        bot.look(Math.random() * Math.PI * 2, 0); // 随便转一下视角
        console.log('Bot 执行了安全防暂离动作 (挥手+转头)。');
      } catch (err) {
        console.log('执行动作失败，可能已掉线。');
      }
    }, 300000);
  });

  bot.on('error', err => console.log('❌ 内部错误:', err));
  
  bot.on('end', () => {
    console.log('⚠️ 连接断开，10秒后尝试重新部署接入...');
    setTimeout(createBot, 10000);
  });
}

createBot();
