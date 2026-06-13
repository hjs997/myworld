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

// 🚨 核心修复 1：把定时器变量声明在外面
let actionInterval = null; 

function createBot() {
  const bot = mineflayer.createBot({
    host: '15.235.212.121', 
    port: 11826,               
    username: 'myworldhappy',  
    version: false,
    physics: false             
  });

  bot.on('spawn', () => {
    console.log('✅ 假人已成功进服！');
    bot.physicsEnabled = false; 

    // 以防万一，启动新定时器前先清空旧的
    if (actionInterval) clearInterval(actionInterval);

    // 赋值给外面的变量
    actionInterval = setInterval(() => {
      try {
        bot.swingArm('right'); 
        bot.look(Math.random() * Math.PI * 2, 0); 
        console.log('Bot 执行了安全防暂离动作 (挥手+转头)。');
      } catch (err) {
        console.log('执行动作失败，可能已掉线。');
      }
    }, 300000);
  });

  bot.on('error', err => console.log('❌ 内部错误:', err));
  
  bot.on('end', () => {
    console.log('⚠️ 连接断开，10秒后尝试重连...');
    
    // 🚨 核心修复 2：Bot 掉线时，立刻销毁定时器，释放内存！
    if (actionInterval) {
      clearInterval(actionInterval);
      actionInterval = null;
    }
    
    setTimeout(createBot, 10000);
  });
}

createBot();
