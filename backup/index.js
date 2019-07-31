const config = require('./config');
const NoticePush = require('./lib/notice_push');

async function run() {
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: __dirname + '/cache'
    });

    const page = await browser.newPage();
    await page.goto('https://www.apicloud.com/console');
    listener(page);

    console.log(page.url());

    await login(page);
    await appIn(page);

    await buildTest(page);
    // await buildProd(page);
}

// 监听数据
function listener(page) {
    page.on('response', async response => {
        const req = response.request();
        if (response.url() === 'https://www.apicloud.com/api/apps') {
            console.log('apps列表');
            console.log("Response 的:" + req.method(), response.status(), req.url(), await response.json());
        }
        if (response.url().includes('https://www.apicloud.com/getPKG?')) {
            console.log('包的信息')
            console.log("Response 的:" + req.method(), response.status(), req.url(), await response.json());
        }
        if (response.url() === 'https://www.apicloud.com/getPKGState') {
            console.log('编译中。。。')
            console.log("Response 的:" + req.method(), response.status(), req.url(), await response.json());
        }
    });

    // await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.url() === 'https://www.apicloud.com/addUnpack') {
            console.log('点击编译')
        }
    });
}

// 推送通知
async function pushNotice() {
    const notice = new NoticePush(config.robot[0]);
    let result = await notice.appPush({
        "msgtype": "news",
        "news": {
            "articles": [
                {
                    "title": "android",
                    "description": "餐厅端v3.3.0",
                    "url": "http://downloadpkg.apicloud.com/app/download?path=http://A6084505171811.qiniucdn.apicloud-system.com/a2a1b90a79544ce006785cf501111e3d_d",
                    "picurl": "http://chuantu.xyz/t6/702/1564418216x992245975.png"
                }
            ]
        }
    });

    console.log('消息推送', result.data);
}

// 登录
async function login(page) {
    const nameId = '#username';
    const passwordId = '#password';

    // 等待url跳转完毕
    await page.waitFor(1000);
    if (page.url() === 'https://www.apicloud.com/console') return
    console.log('输入账号');
    await page.waitForSelector(nameId);
    await page.tap(nameId);
    await page.type(nameId, config.userName, {
        delay: 10, // 每个字母之间输入的间隔
    });

    console.log('输入密码');
    await page.waitForSelector(passwordId);
    await page.tap(passwordId);
    await page.type(passwordId, config.password, {
        delay: 10, // 每个字母之间输入的间隔
    });

    page.tap('#submit');
}

// 进入应用
async function appIn(page) {
    console.log('查看更多应用');
    await page.waitForSelector('.loading-more');
    await page.waitFor(1000);
    await page.tap('.loading-more');

    console.log('进入对应的应用');
    await page.waitForSelector('[title=boss]');
    await page.tap('[title=boss]');

    console.log('进入云编译');
    await page.waitForSelector('.cloud');
    await page.tap('.cloud');
}

async function buildTest(page) {
    console.log('选择平台');
    await page.waitForSelector('#platform-area');
    await page.waitFor(6000);
    await page.tap('.ios.pf-name');
    await page.tap('.android.pf-name');

    console.log('andorid不使用升级环境编译');
    await page.waitFor(200);
    await page.waitForSelector('.package-temp-label.optimize-inp');
    await page.click('.package-temp-label.optimize-inp');

    console.log('打包类型选择');
    await page.click('#pack-type .package-temp-label:nth-of-type(2)');

    console.log('调试模式选择');
    await page.click('#debug-model .package-temp-label:nth-of-type(1)');
    await page.waitFor(600);
    await page.waitForSelector('.btn.btn-info.confirm');
    await page.click('[value=继续启用]');
    await page.waitFor(1000);

    // console.log('证书选择');
    await page.click('#chooseCerti .package-temp-label:nth-of-type(2)');

    console.log('禁用加密');
    await page.click('#encrypt .package-temp-label:nth-of-type(2)');

    console.log('打包渠道否');
    await page.click('#channelPack .package-temp-label:nth-of-type(2)');

    console.log('svn设置否');
    await page.click('#svnSet .package-temp-label:nth-of-type(2)');

    console.log('云编译');
    await page.click('.btn.package');
    await page.waitFor(200);
    if (await page.$('.engine-show.hidden')) {
        await page.click('#engine-cancel');
    }
    // 等待modal关闭
    await page.waitFor(200);

    // 未上传iOS与Android证书, 无法进行编译
    if (await page.$('.engine-show.warning-show')) {
        console.error(' 您未上传iOS与Android证书，无法进行编译');
        process.exit(1);
    }
}


run();