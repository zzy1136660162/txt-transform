# Quasar App (text-transform)

A Quasar Project

## Install the dependencies
```bash
yarn  install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


 

### Format the files
```bash
yarn format 
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

## txt 文字长度转换：

35160000|张三|大马路99弄33号901室|013516393600000000069009|家庭|天然气|200000|罗生|4509|2624000000|王老五|202506|20250626|20250808|69.00|157|180|智能采集|23|0|0|0|23|3.00|69.00|0|0|0.00|0|0|0|0|0|0||4|123.00|0||0|1|11|21|56|||||0|1|23|3.00|69.00|0|0.00|0.00|0|0.00|0.00|0|0.00|0.00|0|0.00|0.00|0|0.00|0.00|0|截止本次账单，贵户用气年度累计气量已达145立方米。第一档可用气量310立方米，还剩余165立方米。||1|罗生门26号|5640000，56490000|周一至周五8:30—17:00,双休日及节假日8:30—16:30||||罗生|||结算周期：2025年04月09日-2025年06月06日|https://payapp.weixin.qq.com/life/index?fr=p&pg=charge&ct=310000&sv=3&ch=021009028&bk=35163936|https://mpshgas.shgas.com.cn/al/scanCode?chan=shjfzfb&cid=35163936&comp=SB
35160001|张三|大马路99弄33号901室|013516393600000000069009|家庭|天然气|200000|罗生|4509|2624000000|王老五|202506|20250626|20250808|69.00|157|180|智能采集|23|0|0|0|23|3.00|69.00|0|0|0.00|0|0|0|0|0|0||4|123.00|0||0|1|11|21|56|||||0|1|23|3.00|69.00|0|0.00|0.00|0|0.00|0.00|0|0.00|0.00|0|0.00|0.00|0|0.00|0.00|0|截止本次账单，贵户用气年度累计气量已达145立方米。第一档可用气量310立方米，还剩余165立方米。||1|罗生门26号|5640000，56490000|周一至周五8:30—17:00,双休日及节假日8:30—16:30||||罗生|||结算周期：2025年04月09日-2025年06月06日|https://payapp.weixin.qq.com/life/index?fr=p&pg=charge&ct=310000&sv=3&ch=021009028&bk=35163936|https://mpshgas.shgas.com.cn/al/scanCode?chan=shjfzfb&cid=35163936&comp=SB
35160002|张三|大马路99弄33号901室|013516393600000000069009|家庭|天然气|200000|罗生|4509|2624000000|王老五|202506|20250626|20250808|69.00|157|180|智能采集|23|0|0|0|23|3.00|69.00|0|0|0.00|0|0|0|0|0|0||4|123.00|0||0|1|11|21|56|||||0|1|23|3.00|69.00|0|0.00|0.00|0|0.00|0.00|0|0.00|0.00|0|0.00|0.00|0|0.00|0.00|0|截止本次账单，贵户用气年度累计气量已达145立方米。第一档可用气量310立方米，还剩余165立方米。||1|罗生门26号|5640000，56490000|周一至周五8:30—17:00,双休日及节假日8:30—16:30||||罗生|||结算周期：2025年04月09日-2025年06月06日|https://payapp.weixin.qq.com/life/index?fr=p&pg=charge&ct=310000&sv=3&ch=021009028&bk=35163936|https://mpshgas.shgas.com.cn/al/scanCode?chan=shjfzfb&cid=35163936&comp=SB


数据元以txt方式保存，“|”为字段分隔符，换行即为一条新的数据，以上为背景

以下为说明：

数据的最后两个字段：
https://payapp.weixin.qq.com/life/index?fr=p&pg=charge&ct=310000&sv=3&ch=021009028&bk=35163936
https://mpshgas.shgas.com.cn/al/scanCode?chan=shjfzfb&cid=35163936&comp=SB

因为字符长度差异，导致我们专用的软件生成二维码的大小有差异，而专用软件中的可编程函数非常少，无法对这两个字段进行加工，所以需要编写一个外部程序进行数据处理

处理目标:

1. 导入数据txt文件
2. 识别最后数据字段
3. 判断最后两个字段长度
4. 用“#”做为补充符号将较短的字段补齐到一样长度
5. 重新输出数据txt文件

```javascript
核心代码：
const fs = require('fs');
const readline = require('readline');

// 输入输出文件路径
const inputFile = 'input.txt';
const outputFile = 'output.txt';

// 创建可写流
const outputStream = fs.createWriteStream(outputFile, { encoding: 'utf8' });

// 创建readline接口
const rl = readline.createInterface({
  input: fs.createReadStream(inputFile),
  crlfDelay: Infinity
});

// 逐行处理
rl.on('line', (line) => {
  // 检查是否为分隔线或空行
  if (!line.includes('|') || line.trim().length === 0) {
    outputStream.write(line + '\n');
    return;
  }

  // 分割数据项
  const items = line.split('|');

  // 检查是否有足够的项
  if (items.length < 84) {
    outputStream.write(line + '\n');
    return;
  }

  // 获取第83和84项（索引82和83）
  let item83 = items[82] || '';
  let item84 = items[83] || '';

  // 计算长度并填充较短项
  const len83 = item83.length;
  const len84 = item84.length;

  if (len83 < len84) {
    items[82] = item83 + '#'.repeat(len84 - len83);
  } else if (len84 < len83) {
    items[83] = item84 + '#'.repeat(len83 - len84);
  }

  // 重新组合行并写入
  outputStream.write(items.join('|') + '\n');
});

// 处理完成
rl.on('close', () => {
  outputStream.end();
  console.log('处理完成！结果已保存至', outputFile);
});

// 错误处理
rl.on('error', (err) => {
  console.error('读取文件出错:', err);
});

outputStream.on('error', (err) => {
  console.error('写入文件出错:', err);
});
```

### 编码说明

当输入的文本文件采用 GBK 编码时，转换后的文件也会以 GBK 编码保存。

# 联系作者：18840016119 张老师
