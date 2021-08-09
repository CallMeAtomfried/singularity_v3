# Singularity Bot

Current version: 0.4.3

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

All syntax examples use the default prefix of *$* - obviously it will be whatever you set it to.
### Admin commands

#### Settings
Users with Administrator permissions can change the guilds settings. These settings are:
- mute_role
  - The role which is assigned to users that are muted. Not setting this role causes mutes to simply be disabled. (Mutes aren't available yet anyway)
- join_logs
  - The channel where the bot logs joining users. Not setting this causes the bot to not log any joining users. (Logs in general aren't implemented either)
- leave_logs
  - Same as join_logs but, you guessed it, it will log the players that left as well as their roles and their strikes and warns, once those are implemented
- message_logs
  - Message edits and deletions will be logged in this channel
- mod_logs
  - Moderation activity will be logged here in searcheable form for easy access later down the line
- prefix
  - The prefix determines what the bot will listen to when determining when a command has been sent. Change this setting if the default value of *$* could cause issues with other bots in your guild. The prefix must not contain spaces but otherwise can have any arbitrary length less than 2000, but remember: if you want people to be able to use the bot, maybe consider picking something short and easily typable.
- automod
  - This will hold all the words you want the bot to automatically delete. This will also trigger a mod_logs entry, so consider if that is maybe worth it. Eventually, you will be able to sort words into different groups of severity: DELETE, WARN and STRIKE, causing the bot to take the according action. The automod command itself will be unaffected by the auto moderation, so you dont get any strikes yourself for changing the settings.
- learn
  - Guild-wide setting. Set it to true if you want the bot to read the messages and learn the speech pattern for later reproduction. Doing so is equivalent to agreeing, that the bot may do so. Messages are not saved and only the message contents are exposed to the markov module which you can find [here](https://github.com/CallMeAtomfried/markov.js). A more detailed explaination of its inner workings can also be found in that repository. 

To get the current value of a setting, do `$settings get <setting name>`. `$settings get all` returns all settings and their values.
To set a setting, do `$settings set <setting name> <value>`

Some settings have their own commands for better usability. These are:
- response_chance
  - Defines the chance of the bot responding to a message in a channel on a per channel basis
- role_permissions
  - Will be implemented once the bot has enough functionality to warrant more granular control over who can do what. Administrators will not be affected.



#### Response

The aforementioned command to set the chances to respond to a message on a per channel basis.

Usage: `$response <Channel Mention> <value>`
Where Channel Mention is simply the name of the Channel with a # in front of it, discord should automatically convert it into the right format, and the value is a floating point number between 0.0 and 1.0 inclusive. This will be the chance of the bot responding, meaning on average for every 100 messages it will respond to chance * 100 of them. For example, if the chance is set to 0.2, it will respond to 20 out of 100 (or 1 out of 5) messages, on average. Note that it will not respond to every fifth message in this case. It is still random. It might respond to several messages in a row, it might not respond for an entire day, thats just randomness. Exceptions are of course 0.0, where it will not respond at all, and 1.0, where it will respond every time. 

#### User

The `$user` command is reserved for bot owners. It allows direct modification of a users balance or XP, but i kindly ask to only do that in "emergencies". If you want to reward players money as a bot owner (meaning you host the bot with your own token), you can also use the `$give` command, which is the preferred option.

### Moderation commands

#### Mute

The only command to exist in theory, it is however unfinished and thus disabled. Dont worry about it, there are plenty more bots that you can use temporarily until I find the motivation to do so. You are, however, free to write the mute stuff yourself or even contribute. More info in the contribute section.

Future moderation functionality will include warns, strikes, kicks, bans and tickets. 
Warns are less "bad" than strikes, although how you deal out these things is up to you. You will be able to set a number of warns required for an automatic strike as well as the number of strikes required for an automatic kick and / or ban. 

Tickets will function as a sort of modmail for users to notify the moderation team of your Guild with complaints, requests, suggestions or reports. The format will probably be up to you, as well as the punishment for abuse.

### Utilities

#### Ping
Simply measures the bots latency

#### XP
View your own or somebody else's XP and level. The current level is calculated mathematically, meaning theres no upper bound on XP, but the downside is that i cannot tell you when you will receive the next level. ![The formula used to calculate the level](https://github.com/CallMeAtomfried/singularity_v3/blob/main/images/levels.png)

Currently, there is no working spam protection, meaning users could just spam and get XP for it, meaning message XP is currently disabled. 

To get your own XP, simply run `$xp`. If you want to see another users XP, do `$xp <userping>`. 

### Fun commands

#### Avatar

Return the avatar of any arbitrary user in your guild as a full format embedded image. 
`$avatar` for your own avatar, `$avatar <userping>` to get that users picture.

#### E

Short for "Emoji", it takes a text and returns it as "big text" using the *regional_indicator* emotes. Kinda like yelling, but in blue.

Usage: `$e <Text>`

#### Say

Simply makes the bot say something. Kinda pointless, but can maybe be used for memes or whatever, i don't know. It mostly exists because it was the first thing I ever added to see if the bot was working as intended.

#### Daily, Weekly and Monthly

Guess the correct number between 0 and 100 inclusive and win 500, 5000 or 50000 Atomcoin respectively. Accordingly, you can only guess once every 24 hours, 7 days or 30 days depending on which command you run, however the individual guesses do not influence each other. 

Usage:

`$daily <number>`, `$weekly <number>`, `$monthly <number>`

#### Games

Or game, rather. So far, I only wrote one game, an implementation of the famous 1972 Game of the Year winning board game "Mastermind" using the rules I know. The aim of the game is to decipher the computers secret code. You start the game using `$mastermind`, it will ask you to make a guess. Make your first guess by sending 4 and exactly 4 of the colored circle emotes, nothing else except spaces. The bot will evaluate your guess and return clues. It will tell you which colors you placed in the correct spot and it will tell you which colors are in the wrong spot. Your goal is to try to guess the sequence in as few turns as possible. You receive points for every correct guess - you get more points the earlier you made that guess - and starting from turn 2, you will lose points for every color you guessed that is not in the code - the later in the game, the more points you lose. If you win, you will get additional points according to how quickly you finished. The score is translated 1 to 1 into AtomCoin, which is kinda only for showing off, as of now.

### Markov commands

#### Coinword

This command will use a pre-trained markov model to generate an english looking word that usually doesn't exist. If you give it nothing to go off of, it will simply generate something random. You can however give it any number of character sequences to start with (up to 20), separated by spaces, and it will generate a word for each one of them starting with the seed you gave it.

Usage: `$coinword [seeds]`, example: `$coinword a b c d` returns `amalisheelist biddener cently ded`. Note that it is random and that was just an example. Also, for some reason it does sometimes send actual existing words, that should in theory just not happen and im unsure how that is a thing, but if it happens, simply run it again. 

#### Generate

Formerly known as Reproduce, this command returns a markov generated sentence. Similar to coinword, you can give it something to go off of, but note that this is word based markov, unlike the letter based markov that coinword uses, meaning keymashing, typos that are bad enough or simply phrases that the bot has never seen may sometimes generate nothing new. It is a learning based method after all, but its not a neural network that can make some "assumptions". It is merely a stochastic model of the speech patters.

#### Gibberish

It either takes the previous message or the text you give it and turns it into nonsense. 

Example: `$gibberish the big brown fox jumps over the lazy dog` 
returns
`ig fox br br the jumps the the ox big down the jumps dog ther jumps big the fown jumps down big br lazy the brown lazy dove big ove dove brox the the the fox fox dove big big do`
(Actual result. Note that this too is random, another result simply said `he b` 

#### Scatterbrain

Similar to gibberish, but it looks at the past couple of messages and jumbles these up. Note that in order for both gibberish and scatterbrain to be able to grab past messages, the messages need to be cached, in other words, the bot only sees past messages from the point it last went online. It doesnt store anything meaning if the bot stops, the messages are gone and if you try to run either of these commands immediately after starting the bot, the bot simply sends an error.


### Economy commands

#### Balance

Works the same as the XP command, use `$balance` to see your own balance, use `$balance <userping>` to see another users balance

#### Give

Send a user money. You can only send up to 75% of your total balance and the money is subtracted from your own account. An inventory system is planned where users can have and trade items either against other items or via a market place or person to person trading, maybe rewards for freqent activity in the form of crates which you can open for an amount of atomcoins, or another reward system. 




## Markov

In the previous section I mentioned markov. If you know what it is, ok. If you dont, google is your friend.
I wrote a Node Module for markov based text generation, it's probably not the usual approach, but it works decently fast*. You can find it [here](https://github.com/CallMeAtomfried/markov.js), it even works on its own.
Basically what it does is constantly listen for messages. It adds these messages to a database. The messages are fully anonymised and the process which converts the message text into data that the module can use is non-reversible, meaning once there is a bunch of data in the database, it would be near impossible to reverse engineer more than a few words with absolute certainty.
If you dont believe me, the bot comes preloaded with a bit of pretrained text. Go into `/markovdata/messages.js` and see for yourself. With a bit of effort you may be able to read the text, but that quickly changes once you unleash a bunch of users onto the bot. It should thus not violate TOS, there is however the setting `learn`
By default it is set to false, meaning you need to actively opt in. 
The larger the dataset the more interesting and longer the results become. 

* Testing and timing came up with a speed of roughly 50,000 tokens per second on an AMD Ryzen 7 4700U and 4166MHz RAM, times on an i5 9400F were faster.
  One token is either one word (A string of characters separated by spaces, eg "xnopyt") or one character, depending on whether or not its a word or letter based model.
  

## Games

Added the mastermind game. 

## Upcoming features

- Moderation tools: mute, kick, ban, tempban, tickets <High priority> E.T.A. version 0.5
- Economy: Inventory, Shops, Transferring money, betting <medium priority> E.T.A. version 0.6
- Fun: daily weekly and monthly guesses. <low priority> E.T.A. unknown
- detailed logs for all kinds of shenanigans you might want to have. <low-ish priority> E.T.A. unknown

- Easier customisation E.T.A. b_0.4
- Update notifier E.T.A. probably never

## Advanced users

Welcome to the shadowlands. To use this stuff, you have to - and definietly should - go into the source code of the `admin.js`. I advise notepad++.
In line 9, theres an array called globalAdmins. Replace that number you see there with your own user id. IT MUST BE YOUR OWN! You can also add more, separated with commas, but do not forget this: each user whose ID is listed in this has full control over your bot far beyond just changing the prefix.
Sadly, you kinda have to. Else `--rollout` doesnt work. If you dont plan on updating the bot via "official" releases, you dont have to. Maybe consider removing ME from the list, or dont, dont really care. It is perfectly possible to add new commands without ever touching the settings.
Why?
Well, most superadmin commands are pretty harmless. 
- `--rollout` simply applies all changes to the guildsettings template to the individual guild setting files. Preexisting settings are not touched.
- `--blacklist` is a command with which you can prevent guilds from writing to the global markov model regardless of their setting. Simply do `--blacklist [add|remove] [guild_id]`
- `--systeminfo` gives you broad info about the current condition of the system, CPU speeds, RAM usage. 
- `--restart` restarts the bot
- `--reload reloads the commands, useful if you want to make changes to the code without downtime. It reads the commands from disk so it wont be instant, but it should not be noticable on a modern drive.` 
- `--eval` This is where the danger lies.`--eval` allows you to run any node compatible javascript code directly in chat. This feature exists for debugging or more detailed analysis. In the wrong hands however it can do actual damage. Best case scenario if someone with malicious intent gets access to the bot is they just shut it down. In theory however, it is even possible to change the code. Everything you can make node do in 1993 characters is possible with this. Yes, it is a security risk, but it is manageable. Make sure you only add your own accounts and enable 2FA on all of them. 
