
module.exports = {
	name: "e",
	description: "Return text as emotes",
	help: "Usage: <pre>e [text]",
	category: "Utility",
	execute(message, args) {
		var textIn = message.content.substring(message.content.split(" ")[0].length)
		if(textIn) {
			var out = "";
			if(textIn.length<=95){
			for(var c in textIn){
				if(textIn[c].charCodeAt(0)>=97&&textIn[c].charCodeAt(0)<=122){
					out += ":regional_indicator_" + textIn[c] + ":\u200b";
				} else {
					out += textIn[c];
				}
			}
			} else {
				out = "Message to long";
			}
			var num = [":zero:",":one:",":two:",":three:",":four:",":five:",":six:",":seven:",":eight:",":nine:"];
			for(var i = 0; i<10; i++){
				out = out.replace(i.toString(), num[i]);
				
			}
			message.channel.send(out);
		} else {
			message.channel.send("Missing argument!");
		}
	}
}


