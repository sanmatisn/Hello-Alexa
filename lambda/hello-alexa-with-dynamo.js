'use strict';
let AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1"
});

exports.handler = (event, context) => {
    var request = event.request;
    if(request.type === "LaunchRequest") {
        let response = getResponse({
            output: "Welcome to Hello App. Would you like to say Hello to someone?",
            reprompt: true,
            endSession: false
        });
        context.succeed(response);
    } else if(request.type === "IntentRequest") {
        if(request.intent.name === "helloIntent") {
            let name = request.intent.slots.fname.value;
            getNickName(name.toLowerCase(), function (data) {
                var finalOutput ="Hello "+ data +". Welcome to Women who compute";
                    let response = getResponse({
                    output: finalOutput,
                    reprompt: false,
                    cardTitle: name,
                    endSession: true
                });
                context.succeed(response);
            });
        } else {
            context.fail("Unknown intent name");
        }
    } else {
        context.fail("Unknown intent type");
    }
}

 function getNickName(name, callback) {
   var params = {
      AttributesToGet: [
        "nickname"
      ],
      TableName : 'HelloAlexa',
      Key : { 
        "nameId" : {
          "S" : name
        }
      }
   }
    var dynamo = new AWS.DynamoDB();
    dynamo.getItem(params, function(err, data) {
        if (err) {
            console.log ("Encountered an error: "+err)
            callback(err);
        } else {
            callback(data.Item.nickname.S);
            console.log("Success in fetching the nickname: "+data.Item.nickname.S);
        }
    });
} 


function getResponse (opts) {
    var response = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "PlainText",
                text: opts.output
            },
            shouldEndSession: opts.endSession
        }
    };
    if(opts.reprompt) {
        response.response.reprompt = {
            outputSpeech: {
                type: "PlainText",
                text: "Would you like to wish someone?"
            }
        };
    } if(opts.cardTitle) {
        let cardTitle = "Hello " + opts.cardTitle;
        response.response.card = {
            type: "Standard",
            title: cardTitle,
            text: "Welcome to Developer Week at Austin",
            image : {
                smallImageUrl: "https://www.serendipitystamps.com/mm5/pics/stamps/619hellosmall.gif",
                largeImageUrl: "https://www.serendipitystamps.com/mm5/pics/stamps/619hellosmall.gif"
            }
        }
    }
    return response;
}
