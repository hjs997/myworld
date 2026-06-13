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

let actionInterval = null; 

function createBot() {
  const bot = mineflayer.createBot({
    host: '15.235.212.121', 
    port: 11826,               
    username: 'myworldhappy',  
    version: false,
    physics: false // 🚨 认怂保平安：彻底关闭物理引擎，不计算XYZ坐标
  });

  bot.on('spawn', () => {
    console.log('✅ 假人已成功进服！开始原地狂飙演技...');
    bot.physicsEnabled = false; 

    if (actionInterval) clearInterval(actionInterval);

    // 每 5 分钟做一套“全国中学生广播体操”
    actionInterval = setInterval(() => {
      try {
        // 1. 猛烈挥动右手
        bot.swingArm('right'); 
        
        // 2. 随机四处张望 (改变视角包，向服务器证明我是活的)
        bot.look(Math.random() * Math.PI * 2, 0); 
        
        // 3. 疯狂蹲起 (Sneak 动作，极佳的活跃证明)
        bot.setControlState('sneak', true);
        
        // 蹲 1 秒钟后站起来
        setTimeout(() => {
          bot.setControlState('sneak', false);
        }, 1000);

        console.log('Bot 执行了高强度体操 (蹲起 + 挥手 + 张望)。');
      } catch (err) {
        console.log('执行动作失败，可能已掉线。');
      }
    }, 300000); 
  });

  bot.on('error', err => console.log('❌ 内部错误:', err));
  
  bot.on('end', () => {
    console.log('⚠️ 连接断开，10秒后尝试重连...');
    if (actionInterval) {
      clearInterval(actionInterval);
      actionInterval = null;
    }
    setTimeout(createBot, 10000);
  });
}

createBot();
