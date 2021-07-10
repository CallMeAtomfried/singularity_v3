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
