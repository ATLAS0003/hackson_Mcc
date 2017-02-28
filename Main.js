//Mcc_hackason slackおしゃべりbot
//最初にtokenセットしなくても行けるように

var tokene = "eG94Yi0xNDY2ODA0MTk2MzUtY05pRm5SaTlmeU8yZnZNck9uSHVJaHV5";
var tokend = new Buffer(tokene, 'base64').toString('utf8');
process.env.token = tokend;

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./botkit/lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});
//var ti = "xoxb-146680419635-cNiFnRi9fyO2fvMrOnHuIhuy";

//環境変数process.env.tokenを代入

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

//文字コード変換
//var encoding = require('./encoding.js/encoding.js');
//文字コード変換は使わないかもです
//->使わないです
//あとはpython待ち
var controller = Botkit.slackbot({
    debug: false
});
controller.spawn({
    token: process.env.token
}).startRTM();

//すべての発言に反応する
//直前にリプライ飛ばした人に対して@リアクション
controller.hears(['REACTION'], 'direct_message,direct_mention,mention',function(bot,message){

    controller.storage.users.get(message.user, function (err, user_info)
    {
        //@リアクション
        //bot.reply(message, "<@" + message.user + ">");

        //emojiReaction
        bot.api.reactions.add({
            timestamp: message.ts,
            channel: message.channel,
            name: '+1',
        }, function (err, res) {
            if (err) {
                bot.botkit.log('Failed to add emoji reaction ', JSON.stringify(err));
            }
        });
    });

   });
//直前にリプライ飛ばした人に対して画像を送る
controller.hears(['IMAGE'], 'direct_message,direct_mention,mention', function (bot, message) {

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
});
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


