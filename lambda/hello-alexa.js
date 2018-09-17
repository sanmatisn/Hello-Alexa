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
    } else if(request.type === "IntentRequest") {
        if(request.intent.name === "helloIntent") {
            let name = request.intent.slots.fname.value;
            let output = "Hello "+name+ ". Welcome to Grace Hopper!";
            let response = getResponse({
                output: output,
                reprompt: false,
                endSession: true
            });
            context.succeed(response);
        } else {
            context.fail("Unknown intent name");
        }
    } else if(request.type === "SessionEndedRequest") {

    } else {
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
    return response;
}