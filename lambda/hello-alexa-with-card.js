'use strict';
exports.handler = (event, context) => {
    var request = event.request;
    if(request.type === "LaunchRequest") {
        let response = getResponse({
            output: "Welcome to Hello App. Would you like to say Hello to someone?",
            reprompt: true,
            endSession: false
        });
        context.succeed(response);

    }
    else if(request.type === "IntentRequest") {
        if(request.intent.name === "helloIntent") {
            let name = request.intent.slots.fname.value;
            let output = "Hello "+name+ ". Welcome to Women who compute!";
            let response = getResponse({
                output: output,
                reprompt: false,
                cardTitle: name,
                endSession: true
            });
            context.succeed(response);
        } else {
            context.fail("Unknown intent name");
        }
    }
    else {
        context.fail("Unknown intent type");
    }

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
    }

    if(opts.cardTitle) {
        let cardTitle = "Hello " + opts.cardTitle;
        response.response.card = {
            type: "Standard",
            title: cardTitle,
            text: "Welcome to Women who compute",
            image : {
                smallImageUrl: "https://www.serendipitystamps.com/mm5/pics/stamps/619hellosmall.gif",
                largeImageUrl: "https://www.serendipitystamps.com/mm5/pics/stamps/619hellosmall.gif"
            }
        }
    }
    return response;
}
