const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync, spawn } = require('child_process');
const logger = require("./utils/log.js");
const login = require("./hzi");
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const listbuiltinModules = require("module").builtinModules;
const readline = require("readline");
const totp = require("totp-generator");
( async () => {
   process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

const fs = require("fs");
const path = require("path");
const axios = require("axios");

const appstatePath = path.join(__dirname, "appstate.json"); // đảm bảo đúng đường dẫn
const tokenPath = path.join(__dirname, "token.json");

global.relogin = async function () {
  const { EMAIL, PASSWORD, OTPKEY } = global.config.LOGIN;
  const otpkey = (OTPKEY || "").replace(/\s+/g, "").toLowerCase();
  const url = `http://localhost:3700/api/login?username=${EMAIL}&password=${PASSWORD}&twofactor=${otpkey}`;

  try {
    const res = await axios.get(url);
    if (res.data.status && res.data.data?.session_cookies) {
      const appState = res.data.data.session_cookies;
      const token = res.data.data.access_token_eaad6v7;
      fs.writeFileSync(tokenPath, JSON.stringify(token, null, 2), "utf8");
      logger("✅ token mới đã được lưu thành công!", "[ REL0GIN ]");
      fs.writeFileSync(appstatePath, JSON.stringify(appState, null, 2), "utf8");
      logger("✅ Appstate mới đã được lưu thành công!", "[ REL0GIN ]");

      // ✅ Tự động restart bot sau khi relogin
      logger("🔁 Đang khởi động lại bot để áp dụng appstate mới...", "[ RESTART ]");
      process.exit(1);

      return appState;
    } else {
      throw new Error("API không trả về session_cookies");
    }
  } catch (err) {
    logger("❌ Lỗi khi relogin: " + err.message, "[ REL0GIN ]");
    return null;
  }
};

global.client = new Object({
    noprefix: new Map(),
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    noprefixRegistered: new Array(),
    eventRegistered: new Array(),
    handleSchedule: new Array(),
    handleReaction: new Array(),
    handleReply: new Array(),
    mainPath: process.cwd(),
    configPath: new String(),
    resetExp: true,
	resetWeek: true
});

global.data = new Object({
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: new Array(),
    allUserID: new Array(),
    allCurrenciesID: new Array(),
    allThreadID: new Array()
});

global.utils = require("./utils");

global.nodemodule = new Object();

global.config = new Object();

global.configModule = new Object();

global.moduleData = new Array();



var configValue;
try {
    global.client.configPath = join(global.client.mainPath, "config.json")
    configValue = require("./config.json");
    var l = require('chalkercli');
     const chalk = require("chalk");
var rainbow = l.rainbow(`
                      ==========================================
                    *                                            *
             ██████╗░██╗░░░██╗███╗░░██╗░██████╗░██╗░░██╗░█████╗░███╗░░██╗
             ██╔══██╗██║░░░██║████╗░██║██╔════╝░██║░██╔╝██╔══██╗████╗░██║
             ██║░░██║██║░░░██║██╔██╗██║██║░░██╗░█████═╝░██║░░██║██╔██╗██║
             ██║░░██║██║░░░██║██║╚████║██║░░╚██╗██╔═██╗░██║░░██║██║╚████║
             ██████╔╝╚██████╔╝██║░╚███║╚██████╔╝██║░╚██╗╚█████╔╝██║░╚███║
             ╚═════╝░░╚═════╝░╚═╝░░╚══╝░╚═════╝░╚═╝░░╚═╝░╚════╝░╚═╝░░╚══╝
                    *                                            *
                    *               - INFO PROJECT -             *
                    *   → PROJECT SUMIBOT                        *
                    *   → Loại Project: NodeJS                   *
                    *   → Phiên bản: V1.2.15                     *
                    *               - INFO ADMIN -               *
                    *   → Tên: Nguyễn Đinh Tiến Dũng - Dũngkon   *
                    *   → FB: Nguyễn Đinh Tiến Dũng              *
                    *   → SĐT/Zalo: 0367281079                   *
                    *   → Email: dungnguyen200214@gmail.com      *
                    *   → Github: dungkon2002                    *
                    *   → Website1: https://dungkon.me           *
                    *   → Website2: https://dungkon.id.vn        *
                    *   → Website3: https://profile.dungkon.net  *
                    *                                            *
                      ==========================================`).stop();
rainbow.render();
var frame = rainbow.frame();
console.log(frame);


    logger("Đã tìm thấy cấu hình tệp: config.json", "[ CONFIG ]");
}
catch (e) {
    if (existsSync(global.client.configPath.replace(/\.json/g,"") + ".temp")) {
        configValue = readFileSync(global.client.configPath.replace(/\.json/g,"") + ".temp");
        configValue = JSON.parse(configValue);
        logger.loader(`Tìm: ${global.client.configPath.replace(/\.json/g,"") + ".temp"}`, `[ CONFIG ]`);
    }
    else { 
        console.log(e)
        return logger.loader("config.json không tìm thấy!", "error");
    }
}


try {
    for (const key in configValue) global.config[key] = configValue[key];
    logger.loader("Tải cấu hình tệp Config thành công!");
}
catch { return logger.loader("Không thể tải cấu hình tệp Config!", "error") }

const { Sequelize, sequelize } = require("./database");

writeFileSync(global.client.configPath + ".temp", JSON.stringify(global.config, null, 4), 'utf8');

try {
    var appStateFile = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"));
    var appState = require(appStateFile);
    logger("Đã tìm thấy file appstate!", "[ APPSTATE ]")
}
catch { 
  try {
let configPath = "";
let argv = process.argv.slice(2);
if (argv.length !== 0) configPath = argv[0];
else configPath = "./config.json";

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const config = require(`./${configPath}`);
let otpkey = config.OTPKEY.replace(/\s+/g, '').toLowerCase();
if ( config.EMAIL == "" || config.PASSWORD == "" ) {
  logger("Vui lòng nhập Email và Password trong file Config!", "warn");
    process.exit(0);
}
login({ email : config.EMAIL , password : config.PASSWORD }, (err, api) => {
    if (err) {
        switch (err.error) {
            case "login-approval":
                if (otpkey) err.continue(totp(otpkey));
                else {
                    logger("Nhập mã xác minh 2 lớp:", "warn");
                    rl.on("line", line => {
                        err.continue(line);
                        rl.close();
                    });
                }
                break;
            default:
            logger(err, "error");
            process.exit(1);
        }
        return;
    }
    const json = JSON.stringify(api.getAppState());
    writeFileSync(`./${config.APPSTATEPATH}`, json);
    logger("Đã ghi xong appstate!", "[ LOGIN DONE ]");
    function startBot(message) {
    (message) ? logger(message, "[ ĐANG KHỞI ĐỘNG ]") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "sumi.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot("Khởi động lại...");
            global.countRestart += 1;
            return;
        } else return;
    });

    child.on("error", function (error) {
        logger("Đã xảy ra lỗi: " + JSON.stringify(error), "[ ĐANG KHỞI ĐỘNG ]");
        
    });
};
startBot();
});

  } 
catch{
  return logger.loader("Không tìm thấy file appstate", "error") 
  if (typeof global.relogin === "function") {
        await global.relogin();
    }
    return;
  }
}
function onBot({ models }) {
    const loginData = {};
    loginData['appState'] = appState;
    login(loginData, async(loginError, loginApiData) => {
        if (loginError){
           logger(JSON.stringify(loginError), `ERROR`);
      return  setInterval(async function () {
		try {
let configPath = "";
let argv = process.argv.slice(2);
if (argv.length !== 0) configPath = argv[0];
else configPath = "./config.json";

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const config = require(`./${configPath}`);
let otpkey = config.OTPKEY.replace(/\s+/g, '').toLowerCase();
if ( config.EMAIL == "" || config.PASSWORD == "" ) {
  logger("Vui lòng nhập Email và Password trong file Config!", "warn");
    process.exit(0);
}
login({ email : config.EMAIL , password : config.PASSWORD }, (err, api) => {
    if (err) {
        switch (err.error) {
            case "login-approval":
                if (otpkey) err.continue(totp(otpkey));
                else {
                    logger("Nhập mã xác minh 2 lớp:", "warn");
                    rl.on("line", line => {
                        err.continue(line);
                        rl.close();
                    });
                }
                break;
            default:
            logger(err, "error");
            process.exit(1);
        }
        return;
    }
    const json = JSON.stringify(api.getAppState());
    writeFileSync(`./${config.APPSTATEPATH}`, json);
    logger("Đã ghi xong appstate!", "[ LOGIN DONE ]");
    function startBot(message) {
    (message) ? logger(message, "[ ĐANG KHỞI ĐỘNG ]") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "sumi.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot("Khởi động lại...");
            global.countRestart += 1;
            return;
        } else return;
    });

    child.on("error", function (error) {
        logger("Đã xảy ra lỗi: " + JSON.stringify(error), "[ ĐANG KHỞI ĐỘNG ]");
    });
};
startBot();
});

  } 
  catch{
  return logger.loader("Không tìm thấy file appstate", "error") 
  }
			}, 10000);
        }
       loginApiData.setOptions(global.config.FCAOption)
        writeFileSync(appStateFile, JSON.stringify(loginApiData.getAppState(), null, '\x09'))
        global.config.version = '1.2.14'
        global.client.timeStart = new Date().getTime(),
            function () {
                const listCommand = readdirSync('./scriptbot/commands').filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));
                for (const command of listCommand) {
                    try {
                        var module = require('./scriptbot/commands/' + command);
                        if (!module.config || !module.run) throw new Error('Command không đúng định dạng!');
                        if (global.client.commands.has(module.config.name || '')) throw new Error('Tên Command bị trùng với một Command mang cùng tên khác!');
                        if (module.config.dependencies && typeof module.config.dependencies == 'object') {
                            for (const reqDependencies in module.config.dependencies) {
                                const reqDependenciesPath = join(__dirname, 'nodemodules', 'node_modules', reqDependencies);
                                try {
                                    if (!global.nodemodule.hasOwnProperty(reqDependencies)) {
                                        if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global.nodemodule[reqDependencies] = require(reqDependencies);
                                        else global.nodemodule[reqDependencies] = require(reqDependenciesPath);
                                    } else '';
                                } catch {
                                    var check = false;
                                    var isError;
                                    logger.loader(`Không tìm thấy package ${reqDependencies} hỗ trợ cho Command ${module.config.name}, tiến hành cài đặt...`, 'warn');
                                    execSync('npm ---package-lock false --save install' + ' ' + reqDependencies + (module.config.dependencies[reqDependencies] == '*' || module.config.dependencies[reqDependencies] == '' ? '' : '@' + module.config.dependencies[reqDependencies]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                    for (let i = 1; i <= 3; i++) {
                                        try {
                                            require['cache'] = {};
                                            if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global['nodemodule'][reqDependencies] = require(reqDependencies);
                                            else global['nodemodule'][reqDependencies] = require(reqDependenciesPath);
                                            check = true;
                                            break;
                                        } catch (error) { isError = error; }
                                        if (check || !isError) break;
                                    }
                                    if (!check || isError) throw new Error(`Không thể cài đặt package ${reqDependencies} cho Command ${module.config.name}, lỗi: ${JSON.stringify(isError)}`);
                                }
                            }
                            logger.loader(`Đã tải thành công toàn bộ package cho Command ${module.config.name}`);
                        }
                        if (module.config.envConfig) try {
                            for (const envConfig in module.config.envConfig) {
                                if (typeof global.configModule[module.config.name] == 'undefined') global.configModule[module.config.name] = {};
                                if (typeof global.config[module.config.name] == 'undefined') global.config[module.config.name] = {};
                                if (typeof global.config[module.config.name][envConfig] !== 'undefined') global['configModule'][module.config.name][envConfig] = global.config[module.config.name][envConfig];
                                else global.configModule[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                                if (typeof global.config[module.config.name][envConfig] == 'undefined') global.config[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                            }
                            logger.loader(`Đã tải thành công config cho Command ${module.config.name}`);
                        } catch (error) {
                            throw new Error(`Không thể tải config của Command ${module.config.name}, lỗi: ${JSON.stringify(error)}`);
                        }
                        if (module.onLoad) {
                            try {
                                const moduleData = {};
                                moduleData.api = loginApiData;
                                moduleData.models = models;
                                module.onLoad(moduleData);
                            } catch (error) {
                                throw new Error(`Không thể khởi chạy setup của Command ${module.config.name}, lỗi: ${JSON.stringify(error)}`);
                            };
                        }
                        if (module.handleEvent) global.client.eventRegistered.push(module.config.name);
                        global.client.commands.set(module.config.name, module);
                        logger.loader(`Đã tải thành công Command ${module.config.name}`);
                    } catch (error) {
                        logger.loader(`Không thể tải thành công Command ${module.config.name}, lỗi: ${JSON.stringify(error)}`, 'error');
                    };
                }
            }(),
            function () {
                const listNoprefix = readdirSync('./scriptbot/noprefix').filter(noprefix => noprefix.endsWith('.js') && !noprefix.includes('example') && !global.config.noprefixDisabled.includes(noprefix));
                for (const noprefix of listNoprefix) {
                    try {
                        var module = require('./scriptbot/noprefix/' + noprefix);
                        if (!module.config || !module.handleNoprefix ) throw new Error('Noprefix không đúng định dạng!');
                        if (global.client.noprefix.has(module.config.name || '')) throw new Error('Tên Noprefix bị trùng với một Noprefix mang cùng tên khác!');
                        if (module.config.dependencies && typeof module.config.dependencies == 'object') {
                            for (const reqDependencies in module.config.dependencies) {
                                const reqDependenciesPath = join(__dirname, 'nodemodules', 'node_modules', reqDependencies);
                                try {
                                    if (!global.nodemodule.hasOwnProperty(reqDependencies)) {
                                        if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global.nodemodule[reqDependencies] = require(reqDependencies);
                                        else global.nodemodule[reqDependencies] = require(reqDependenciesPath);
                                    } else '';
                                } catch {
                                    var check = false;
                                    var isError;
                                    logger.loader(`Không tìm thấy package ${reqDependencies} hỗ trợ cho Command ${module.config.name}, tiến hành cài đặt...`, 'warn');
                                    execSync('npm ---package-lock false --save install' + ' ' + reqDependencies + (module.config.dependencies[reqDependencies] == '*' || module.config.dependencies[reqDependencies] == '' ? '' : '@' + module.config.dependencies[reqDependencies]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                    for (let i = 1; i <= 3; i++) {
                                        try {
                                            require['cache'] = {};
                                            if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global['nodemodule'][reqDependencies] = require(reqDependencies);
                                            else global['nodemodule'][reqDependencies] = require(reqDependenciesPath);
                                            check = true;
                                            break;
                                        } catch (error) { isError = error; }
                                        if (check || !isError) break;
                                    }
                                    if (!check || isError) throw new Error(`Không thể cài đặt package ${reqDependencies} cho Noprefix ${module.config.name}, lỗi: ${JSON.stringify(isError)}`);
                                }
                            }
                            logger.loader(`Đã tải thành công toàn bộ package cho Noprefix ${module.config.name}`);
                        }
                        if (module.config.envConfig) try {
                            for (const envConfig in module.config.envConfig) {
                                if (typeof global.configModule[module.config.name] == 'undefined') global.configModule[module.config.name] = {};
                                if (typeof global.config[module.config.name] == 'undefined') global.config[module.config.name] = {};
                                if (typeof global.config[module.config.name][envConfig] !== 'undefined') global['configModule'][module.config.name][envConfig] = global.config[module.config.name][envConfig];
                                else global.configModule[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                                if (typeof global.config[module.config.name][envConfig] == 'undefined') global.config[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                            }
                            logger.loader(`Đã tải thành công config cho Nopreifx ${module.config.name}`);
                        } catch (error) {
                            throw new Error(`Không thể tải config của Noprefix ${module.config.name}, lỗi: ${JSON.stringify(error)}`);
                        }
                        if (module.onLoad) {
                            try {
                                const moduleData = {};
                                moduleData.api = loginApiData;
                                moduleData.models = models;
                                module.onLoad(moduleData);
                            } catch (error) {
                                throw new Error(`Không thể khởi chạy setup của Noprefix ${module.config.name}, lỗi: ${JSON.stringify(error)}`);
                            };
                        }
                        if (module.handleNoprefix) global.client.noprefixRegistered.push(module.config.name);
                        global.client.noprefix.set(module.config.name, module);
                        logger.loader(`Đã tải thành công Noprefix ${module.config.name}`);
                    } catch (error) {
                        logger.loader(`Không thể tải thành công Noprefix ${module.config.name}, lỗi: ${JSON.stringify(error)}`, 'error');
                    };
                }
            }(),
            function() {
                const events = readdirSync('./scriptbot/events').filter(event => event.endsWith('.js') && !global.config.eventDisabled.includes(event));
                for (const ev of events) {
                    try {
                        var event = require('./scriptbot/events/' + ev);
                        if (!event.config || !event.run) throw new Error(`Event không đúng định dạng!`);
                        if (global.client.events.has(event.config.name) || '') throw new Error(`Tên Event bị trùng với một Event mang cùng tên khác!`);
                        if (event.config.dependencies && typeof event.config.dependencies == 'object') {
                            for (const dependency in event.config.dependencies) {
                                const dependencyPath = join(__dirname, 'nodemodules', 'node_modules', dependency);
                                try {
                                    if (!global.nodemodule.hasOwnProperty(dependency)) {
                                        if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                        else global.nodemodule[dependency] = require(dependencyPath);
                                    } else '';
                                } catch {
                                    let check = false;
                                    let isError;
                                    logger.loader(`Không tìm thấy package ${dependency} hỗ trợ cho Event ${event.config.name}, tiến hành cài đặt...`, 'warn');
                                    execSync('npm --package-lock false --save install' + dependency + (event.config.dependencies[dependency] == '*' || event.config.dependencies[dependency] == '' ? '' : '@' + event.config.dependencies[dependency]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                    for (let i = 1; i <= 3; i++) {
                                        try {
                                            require['cache'] = {};
                                            if (global.nodemodule.includes(dependency)) break;
                                            if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                            else global.nodemodule[dependency] = require(dependencyPath);
                                            check = true;
                                            break;
                                        } catch (error) { isError = error; }
                                        if (check || !isError) break;
                                    }
                                    if (!check || isError) throw new Error(`Không thể cài đặt package ${dependency} cho Event ${event.config.name}, lỗi: ${JSON.stringify(isError)}`);
                                }
                            }
                            logger.loader(`Đã tải thành công toàn bộ package cho Event ${event.config.name}`);
                        }
                        if (event.config.envConfig) try {
                            for (const envConfig in event.config.envConfig) {
                                if (typeof global.configModule[event.config.name] == 'undefined') global.configModule[event.config.name] = {};
                                if (typeof global.config[event.config.name] == 'undefined') global.config[event.config.name] = {};
                                if (typeof global.config[event.config.name][envConfig] !== 'undefined') global.configModule[event.config.name][envConfig] = global.config[event.config.name][envConfig];
                                else global.configModule[event.config.name][envConfig] = event.config.envConfig[envConfig] || '';
                                if (typeof global.config[event.config.name][envConfig] == 'undefined') global.config[event.config.name][envConfig] = event.config.envConfig[envConfig] || '';
                            }
                            logger.loader(`Đã tải thành công config cho Event ${event.config.name}`);
                        } catch (error) {
                            throw new Error(`Không thể tải config của Event ${event.config.name}, lỗi: ${JSON.stringify(error)}`);
                        }
                        if (event.onLoad) try {
                            const eventData = {};
                            eventData.api = loginApiData, eventData.models = models;
                            event.onLoad(eventData);
                        } catch (error) {
                            throw new Error(`Không thể khởi chạy setup của Event ${event.config.name}, lỗi: ${JSON.stringify(error)}`);
                        }
                        global.client.events.set(event.config.name, event);
                        logger.loader(`Đã tải thành công Event ${event.config.name}`);
                    } catch (error) {
                        logger.loader(`Không thể tải thành công Event ${event.config.name}, lỗi: ${JSON.stringify(error)}`, 'error');
                    }
                }
            }()
        logger.loader(`Đã tải thành công toàn bộ modules`) 
        logger(`${global.client.commands.size} module Command`, `[ COMMANDS ]`)
        logger(`${global.client.events.size} module Events`, `[  EVENTS  ]`)
        logger(`${global.client.noprefix.size} module Noprefix`, `[ NOPREFIX ]`)
        logger.loader('=== ' + (Date.now() - global.client.timeStart) + 'ms ===')
        writeFileSync(global.client['configPath'], JSON['stringify'](global.config, null, 4), 'utf8') 
        unlinkSync(global['client']['configPath'] + '.temp');        
        const listenerData = {};
        listenerData.api = loginApiData; 
        listenerData.models = models;
        const listener = require('./main/listen')(listenerData);

        function listenerCallback(error, message) {
            if (error) return logger(`handleListener đã xảy ra một số lỗi không mong muốn, lỗi: ${JSON.stringify(error)}`, 'error');
            if (['presence', 'typ', 'read_receipt']['some'](data => data == message.type)) return;
            if (global.config.DeveloperMode == !![]) console.log(message);
            return listener(message);
        };
        
        global.client.api = loginApiData
        global.handleListen = loginApiData.listenMqtt(listenerCallback);
        // setInterval(async function () {
        //    login
        //     global.config.autoClean && (global.data.threadInfo.clear(), global.client.handleReply = global.client.handleReaction = {});
        //     if (global.config.DeveloperMode == !![]) 
        //         return logger(`Đã làm mới lại handleListener...`, '[ DEV MODE ]');
        // }, 600000);
    });
}
(async() => {
    try {
        await sequelize.authenticate();
        const authentication = {};
        authentication.Sequelize = Sequelize;
        authentication.sequelize = sequelize;
        const models = require('./database/model')(authentication);
        logger(`Kết nối đến cơ sở dữ liệu thành công`, '[ DATABASE ]');
        const botData = {};
        botData.models = models
        onBot(botData);
    } catch (error) { 
      logger(`Kết nối đến cơ sở dữ liệu thất bại, lỗi: ${JSON.stringify(error)}`, '[ DATABASE ]');
      };
})();

})();

        
 
