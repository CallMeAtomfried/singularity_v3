### 0.4.2 - Current version (09.08.2021)
- Bugfixes
- Renamed "Reproduce" to "generate"
- Bot now interactable via DMs (you still need to share a server with the bot AND have DMs enabled for at least one of these servers)
	- The bot will not learn from DM messages for
	- Some functionality is disabled in DMs for a number of reasons
	- The bot will always respond to DMs and turning it off is not possible. If you dont want it to respond, using it via DMs is not obligatory.
	- DM responses use a new way of determining how to respond. Instead of ALWAYS using a random word from the message as seed, the chance of the bot doing so increases with longer messages, at 10 words or more it will always use a random word.

### 0.4.1 - Current version (19.07.2021)
- Bugfixes
- Random chance of bot responding to messages
- Chance settable on a per channel bases

### 0.4.0 - Current version (11/07/2021)
- Fully implemented watchdog system:
  - Divided bot in 4 Subprocesses
  - Added watchdog process
  - Communication between processes possible
- Bot restart now possible for bot owners
- Fixed issues with new discord.js version
- Markov now using words

### b_0.3.1

- Mastermind game added
- Slowly starting to use child processes

### b_0.3 - (07/05/2021)

- First release of the new rewrite, now with commands neatly filed away as node modules instead of being run via eval() on plain text. 
- Added most commands of the previous versions.
- Hopefully the last rewrite
- Switched markov related stuff from small snippets dotted everywhere to the newly finished markov js module.
- Outsourced command handling to a separate module
- Added "Guild" module to handle guild specific tasks
- Added "User" module to handle user specific tasks
- Added "Rollout" to apply updates to the guild settings globally.
- Added various repetitive functions in the "Utility" module.
- Added active opt-in approach for markov learning
- Added "superadmin" commands


### b_0.2 - No longer available (never released, rather)

Previous versions of the bot using a completely different approach to basically everything. Horribly inefficient and frankly disgusting to read.
