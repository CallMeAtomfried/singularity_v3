# Singularity Bot

Current version: 0.4.0

The hopefully last rewrite of the bot that went nowhere. Not to be taken seriously this is mainly for me to see whats possible. Of course you can go ahead and host it yourself, all you need is a Discord token.
Its fully functional in theory, so far it has not been hit with a significant load yet.

## Requirements

- [Node.js](https://nodejs.org/en/) v14.x or higher
- [Discord.js](https://discord.js.org/#/) v12.x or higher
- A [Discord API token](https://discord.com/developers/applications) and everything that entails
- A Discord guild, else you won't be able to enjoy the glory that is this bot
- [ooer-markov](https://www.npmjs.com/package/ooer-markov) module, see below
- [Ability to read](https://en.wikipedia.org/wiki/Reading_comprehension)
- (Optional) Willingness to dive into the code for additional customisation

## Installation

With Node installed, navigate to the main bot folder, open your terminal and run 
```npm install discord.js```
and 
```npm install ooer-markov```

This should automatically install the newest version of both. ooer-markov is the npm version of the notmarkov repo, the source code is identical. 

## Setup

1. Set up your Discord Application via the [Discord Developer Portal](https://discord.com/developers/applications) by clicking "New Application". You will be prompted to give your application a name. This one is up to you, I trust you to do the right thing, although you might want to consider changing a few bits in the code.
1. You will be met with a page with general information about your application. Here you can give it a fancy new name or a profile picture. Doesn't really matter.
1. The public key you see at the bottom is NOT the token. On the left hand side you see a menu, go to the "Bot" section.
1. Add the bot.
1. Congratulations, you now have a bot for your application. If you want to change the bots "username" or its profile picture, this is where you do it. But more importantly, beneath the textbox for the name just to the right of the profile picture, you can see the "token". Go copy that and paste it in the `config.json` under token.
1. !! DO NOT PUBLISH YOUR TOKEN !! If you do accidentally put it on something like Github, Discord will notify you and invalidate that token. How they do it, no idea. In that case you need to regenerate it. Just dont publish your token ok?
1. Your `config.json` should now look like this: 
```json
{
  "blacklistguilds": [],
  "token": "pretty long string of random characters",
  "prefix": "$",
  "logchannel": "601108134014091265",
  "coinsPerMessage":1
}
```
8. Open your terminal of choice, navigate to the main folder and run `node watchdog.js`
8. If you get any errors, something went wrong during the installation process.
8. If you see a message saying "I am ready!" then you're done, congratulations, your bot is live, go buy some candy or w/e.
8. It still cant join your server on its own. So go back to the developer portal, this time under "Application". Get the "Application ID". 
8. Paste it in this link where it says [ID]
https://discord.com/oauth2/authorize?client_id=[ID]&permissions=8&scope=bot

13. Note that this will give the bot admin privileges. Thats just for convenience, for more granularity, you can get the permissions number under the "Bot" page in the Developer Portal. I need you to understand tho that some existing functionality and especially upcoming functionality require certain permissions like manage messages, manage roles, manage members, that sort of stuff. So, i suggest you just leave it as is, if you dont trust me, the code is literally run by you and you alone. 

## Updates

The plan is to update the bot regularly. It is usable in its current form, just not very useful. See below. 
When an update is released there is so far no way of notifying you if you host the bot yourself, and I do not know how i would accomplish that while keeping a clear separation between me and my instance of the bot and yours. 
Updates usually are quite simple. Commands are simply dragged and dropped into the commands folder as they are. There will be further detail in the `changelog.md`.

For more fundamental updates like new commands or even updates to the backbone (very likely) or the markov module (unlikely), the bot needs to be restarted manually.
From time to time, new settings are added to the bot. There is a file in the `/util/template/` folder called `guildsettings.json`. You are of course free to make changes to that, if you know what youre doing - documentation will be added - but i advise against it as these may interfere with future updates and require quite a bit more fiddling to update.

Settings do not require a restart of the bot, you as the bot owner need to run the command `--rollout`, however. Only you can do that. More on that in the Advanced users section

## Commands
### ADMIN COMMANDS
#### Settings

Requires the user to have Admin permissions.
Change the bots guild specific setting. Most of them don't do anything yet. In fact, the only one that has a use as of now is prefix, with which you can change the command prefix.

Now, you might have heard that Discord is rolling out the slash commands, but... no. Simple as that. You can set the prefix to whatever you want, but make sure it does not have a space in it. In fact, you cant. Just doesnt work and thats intentional. In short, it renders the bot useless for the guild.

Examples: 
```
$settings prefix >
```
> Sucessfully set prefix to >
```
>settings get all
```
> A list of all available settings and their value. Get only specific values by replacing "all" with the setting name.
```
>setting remove mute_role
```
> Removes the role the bot assigns to muted users. This will "deactivate" the mute command. "settings remove" can be run with everything but prefix, you may be able to imagine why.

### MODERATION COMMANDS

(nothing, yet.)

### UTILITY COMMANDS

#### Help
Do `$help` for a general overview. If you want further details, do `$help <command name>`

#### Ping
Returns the time it takes for the bot to respond.

#### XP
View your own or someone elses XP and level. 

### FUN COMMANDS
#### Avatar

Returns you a larger version of the profile picture of either a user you mention or yourself.

#### E
Converts a text to the emote letters.

#### Say
Just makes the bot say something.


### MARKOV COMMANDS

#### Gibberish
Generates gibberish from either the previous message or the text you give it. 

Example: 
```
$gibberish a big brown fox jumps off the cliff.
```
> the ox fox ox big the clig ff.

#### Reproduce
Reproduces more or less coherent text. More on that in the markov section.

#### Scatterbrain

Takes no argument. It looks at the past 500 messages, learns their contents and starts generating a quick burst of philosophical wisdom.

### ECONOMY

#### Balance
Show your or someone elses accounts balance in Atom Coins, the best currency there is. You earn Atom Coin by being active, they are not guild specific.


## Markov

In the previous section I mentioned markov. If you know what it is, ok. If you dont, google is your friend.
I wrote a Node Module for markov based text generation, it's probably not the usual approach, but it works decently fast. You can find it [here](https://github.com/CallMeAtomfried/markov.js), it even works on its own.
Basically what it does is constantly listen for messages. It adds these messages to a database. The messages are fully anonymised and the process which converts the message text into data that the module can use is non-reversible, meaning once there is a bunch of data in the database, it would be near impossible to reverse engineer more than a few words with absolute certainty.
If you dont believe me, the bot comes preloaded with a bit of pretrained text. Go into `/markovdata/messages.js` and see for yourself. With a bit of effort you may be able to read the text, but that quickly changes once you unleash a bunch of users onto the bot. It should thus not violate TOS, there is however the setting `learn`
By default it is set to false, meaning you need to actively opt in. 
The larger the dataset the more interesting and longer the results become. 

## Games

Added the mastermind game. 

## Upcoming features

- Moderation tools: mute, kick, ban, tempban, tickets <High priority> E.T.A. version b_0.3.1
- Economy: Inventory, Shops, Transferring money, betting <medium priority> E.T.A. version b_0.3.2
- Fun: daily weekly and monthly guesses. <low priority> E.T.A. version b_0.3.3
- detailed logs for all kinds of shenanigans you might want to have. <low-ish priority> E.T.A. b_0.4

- Splitting the bot into multiple processes. Right now only I/O is handled separately.
- Easier customisation E.T.A. b_0.4
- Update notifier E.T.A. probably never

## Advanced users

Welcome to the shadowlands. To use this stuff, you have to - and definietly should - go into the source code of the `main.js`. I advise notepad++.
In line 80, theres an array containing one long number. Replace that number you see there with your own user id. IT MUST BE YOUR OWN! You can also add more, separated with commas, but do not forget this: each user whose ID is listed in this has full control over your bot far beyond just changing the prefix.
Sadly, you kinda have to. Else `--rollout` doesnt work. If you dont plan on updating the bot via "official" releases, you dont have to. Maybe consider removing ME from the list, or dont, dont really care. It is perfectly possible to add new commands without ever touching the settings.
Why?
Well, most superadmin commands are pretty harmless. 
- `--rollout` simply applies all changes to the guildsettings template to the individual guild setting files. Preexisting settings are not touched.
- `--blacklist` is a command with which you can prevent guilds from writing to the global markov model regardless of their setting. Simply do `--blacklist [add|remove] [guild_id]`
- `--systeminfo` gives you broad info about the current condition of the system, CPU speeds, RAM usage. 
- `--eval` This is where the danger lies.`--eval` allows you to run any node compatible javascript code directly in chat. This feature exists for debugging or more detailed analysis. In the wrong hands however it can do actual damage. Best case scenario if someone with malicious intent gets access to the bot is they just shut it down. In theory however, it is even possible to change the code. Everything you can make node do in 1995 characters is possible with this. Yes, it is a security risk, but it is manageable. Make sure you only add your own accounts and enable 2FA on all of them. 
