//Mcc_hackason slackおしゃべりbot
//最初にtokenセットしなくても行けるように
//ここにbase64化したtokenを
var tokene = "eG94Yi0xNDc5ODI4NDEzODMtbFZXZGdMQmNiRjhzTm9lNHp6UFRFM3hx";
var tokend = new Buffer(tokene, 'base64').toString('utf8');
process.env.token = tokend;

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./botkit/lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false,
});
//環境変数process.env.tokenを代入

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

var controller = Botkit.slackbot({
    debug: false
});
controller.spawn({
    token: process.env.token
}).startRTM();
var  message1;
//すべての発言に反応する
//直前にリプライ飛ばした人に対して@リアクション

controller.hears('', 'direct_message,direct_mention,mention',function(bot,message){

    controller.storage.users.get(message.user, function (err, user_info)
    {
        message1 = message;
        //@リアクション
        //bot.reply(message, "<@" + message.user + ">");

        //emojiReaction
        /*bot.api.reactions.add({
            timestamp: message.ts,
            channel: message.channel,
            name: '+1',
        }, function (err, res) {
            if (err) {
                bot.botkit.log('Failed to add emoji reaction ', JSON.stringify(err));
            }
        });*/
    });

});
//標準入力の準備
var lines = [];
var reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
var missedFlag = 0;
//REACTIONという入力があると前のユーザーに:+1:する
function feelings(objf) {
        console.log(message1);
        bot.reply(message1, "<@" + message1.user + ">" + objf);
        lines = [];
        missedFlag = 0;
}
function picfeelings(pobjf) {
        console.log(message1);
        //画像読み込み
        var fs = require('fs');
        bot.api.files.upload(
            {
                file: fs.createReadStream(pobjf),
                filename: 'okimoti.png',
                channels: message1.channel
            }, function (err, res) {
                if (err) console.log(err)
            });
        lines = [];
        missedFlag = 0;
}
//いつでも読み込む
reader.on('line', function (line) {
    lines.push(line);
    console.log(lines[0], lines[1]);
    if (lines[1] != null) {
        if (lines[0] == 'REACTION') {
            feelings(lines[1]);
        } else if (lines[0] == 'IMAGE')
            picfeelings(lines[1]);
    } else {
        missedFlag = 1;
    }
});

//直前にリプライ飛ばした人に対して画像を送る
/*controller.hears(['IMAGE'], 'direct_message,direct_mention,mention', function (bot, message) {

    //at reply
    controller.storage.users.get(message.user, function (err, user_info)
    {
        bot.reply(message, "<@" + message.user + ">");
    });
    //画像読み込み
    var fs = require('fs');
    bot.api.files.upload(
        {
            file: fs.createReadStream('./image/hoge.png'),
            filename: 'hoge.png',
            channels: message.channel
        }, function (err, res) {
            if (err) console.log(err)
        });
});*/
//bot終了コマンド
controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function (bot, message) {

    bot.startConversation(message, function (err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [
            {
                pattern: bot.utterances.yes,
                callback: function (response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function () {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function (response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}


