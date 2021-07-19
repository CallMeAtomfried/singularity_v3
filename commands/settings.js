const fs = require("fs")
function idToRole(roleId) {
  return roleId?`<@&${roleId}>`:"None"
}
function idToChannel(channelId) {
  return channelId?`<#${channelId}>`:"None"
}
module.exports = {
  name: "settings",
  description: "Change the bot settings",
  help: "Usage: <pre>settings <setting> <value>\n or: <pre>settings help",
  category: "Admin",
  execute(message, args, client) {
    // args = message.content.substring(message.content.split(" ")[0].length).trim().split(" ");
    
    //Get Message author as MEMBER!
    var member = client.guilds.cache.find(u => u.id === message.guild.id).members.cache.find(u => u.id === message.author.id);
    if(member.hasPermission(["ADMINISTRATOR"])) {
      if(args[1] == undefined || args[1] == "help") {
        var settingsTemplate = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`).toString()).settings;
        var dummy = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`).toString()).dummy;
        var settingsNames = ""
          
        var subkey = Object.keys(settingsTemplate)
        
        for(var y in subkey) {
          settingsNames += (`${subkey[y]}: ${dummy[subkey[y]]}\n`)
          
        }
        
        message.channel.send({
          "embed": {
          "title": "Guild Settings",
          "description": `**The available guild settings are**\n\n${settingsNames}\n\nTo remove settings, type ${settingsTemplate.prefix}settings remove <setting>.\n\nTo view your current setting, type ${settingsTemplate.prefix}settings get <setting>`,
          "color": 5380730
          }
        })
                  
      } else if(args[1] == "get") {
        var settings = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`).toString()).settings;
        var dummy = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`).toString()).dummy;
        
        switch(dummy[args[2]]) {
          case "all":
            var settingsNames = ""
            var subkey = Object.keys(settings)
            for(var y in subkey) {
              if(dummy[subkey[y]]=="Role ID") {
                settingsNames += (`${subkey[y]}: ${idToRole(settings[subkey[y]])}\n`)
              } else if(dummy[subkey[y]] == "Channel ID") {
                settingsNames += (`${subkey[y]}: ${idToChannel(settings[subkey[y]])}\n`)
              } else if(dummy[subkey[y]] == "String"){
                settingsNames += (`${subkey[y]}: ${settings[subkey[y]]}\n`)
              } else if(dummy[subkey[y]] == "Boolean"){
                settingsNames += (`${subkey[y]}: ${settings[subkey[y]]}\n`)
              } else if(dummy[subkey[y]] == "Float") {
				  settingsNames += (`${subkey[y]}: ${settings[subkey[y]]}\n`)
			  }
              
            }
            message.channel.send({
              "embed": {
              "title": "Guild Settings",
              "description": `**The guild settings are**\n\n${settingsNames}`,
              "color": 5380730
              }
            })
            break
            
          case "Role ID":
            let setr = idToRole(settings[args[2]])
            message.channel.send(`${args[2]} = ${setr}`)
            break
            
          case "Channel ID":
            let setc = idToChannel(settings[args[2]]);
            message.channel.send(`${args[2]} = ${setc}`)
            break
          case "String":
            let sets = settings[args[2]]
            message.channel.send(`${args[2]} = ${sets}`)
            break
          default:
          message.channel.send(`ERROR! Setting ${args[2]} not found`)
        }
      } else if(args[1] == "remove") {
        var settings = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`).toString()).settings;
        var dummy = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`).toString()).dummy;
        
        if(args[2] == "prefix") {
            message.channel.send("ERROR! Cannot remove the prefix");
          } else {
            if(Object.keys(dummy).includes(args[2])) {
              let settings = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`))
              settings.settings[args[2]] = "";
              fs.writeFile(`./guilds/${message.guild.id}/settings.json`, JSON.stringify(settings), function(){console.log('done')});
              message.channel.send(`Successfully removed setting ${args[1]}!`);
            }
          }
        
      } else {
        
        let dummy = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`).toString()).dummy;
        if(Object.keys(dummy).includes(args[1])) {
          switch (dummy[args[1]]) {
            case "Role ID":
              
              if(message.mentions.roles.first()) {
                let settings = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`))
                settings.settings[args[1]] = args[2].replace(/<@&|>/g, "");
                fs.writeFile(`./guilds/${message.guild.id}/settings.json`, JSON.stringify(settings), function(){console.log('done')});
                message.channel.send(`Successfully set ${args[1]} to ${args[2]}`);
              } else {
                message.channel.send(`ERROR! You can't set ${args[1]} to ${args[2]}`);
              }
              break
              
            case "Channel ID": 
              
              if(message.mentions.channels.first()) {
                let settings = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`))
                settings.settings[args[1]] = args[2].replace(/<#|>/g, "");
                fs.writeFile(`./guilds/${message.guild.id}/settings.json`, JSON.stringify(settings), function(){console.log('done')});
                message.channel.send(`Successfully set ${args[1]} to ${args[2]}!`);
              } else {
                message.channel.send(`ERROR! You can't set ${args[1]} to ${args[2]}!`);
              }
              break
            case "Float": 
				if (isNaN(parseFloat(args[2]))) break;
            case "String":
              console.log(args[1], args[2])
              if(args[2]) {
                let settings = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`))
                settings.settings[args[1]] = args[2];
                fs.writeFile(`./guilds/${message.guild.id}/settings.json`, JSON.stringify(settings), function(){console.log('done')});
                message.channel.send(`Successfully set ${args[1]} to ${args[2]}!`);
              } else {
                message.channel.send(`ERROR! You can't set ${args[1]} to ${args[2]}!`);
              }
              break
			case "Boolean":
			  console.log(args[1], args[2])
              if(args[2]) {
                let settings = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`))
                settings.settings[args[1]] = (args[2].toLowerCase()=="true");
                fs.writeFile(`./guilds/${message.guild.id}/settings.json`, JSON.stringify(settings), function(){console.log('done')});
                message.channel.send(`Successfully set ${args[1]} to ${args[2]}!`);
              } else {
                message.channel.send(`ERROR! You can't set ${args[1]} to ${args[2]}!`);
              }
			  break
			
            default:
              message.channel.send("Invalid setting :c");
          }
        } else {
          message.channel.send("Invalid setting :c");
        }
      }
    }
  }
}