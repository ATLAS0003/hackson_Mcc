//Mcc_hackason slackおしゃべりbot

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./botkit/lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();
//文字コード変換
//var encoding = require('./encoding.js/encoding.js');
//文字コード変換は使わないかもです
var controller = Botkit.slackbot({
    debug: false
});
controller.spawn({
    token: process.env.token
}).startRTM();
//すべての発言に反応する
controller.hears('REACTION', 'direct_message,direct_mention,mention',function(bot,message){
    
    //at reply
    controller.storage.users.get(message.user, function (err, user_info)
    {
        bot.reply(message, "<@" + message.user + ">");
    });

   });

controller.hears('IMAGE', 'direct_message,direct_mention,mention', function (bot, message) {

    //at reply
    /*controller.storage.users.get(message.user, function (err, user_info)
    {
        bot.reply(message, "<@" + message.user + ">");
    });*/
    var fs = require('fs');
    bot.api.files.upload(
        {
            file: fs.createReadStream('./hoge.png'),
            filename: 'hoge.png',
            channels: message.channel
        }, function (err, res) {
            if (err) console.log(err)
        });
});

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


