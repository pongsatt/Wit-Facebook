const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const interactive = (fn) => {
    rl.setPrompt('> ');

    const prompt = () => {
        rl.prompt();
        rl.write(null, { ctrl: true, name: 'e' });
    };

    prompt();

    rl.on('line', (line) => {
        line = line.trim();

        if (!line) {
            return prompt();
        }

        console.log("Command: ", line);
        return fn(line)
            .then(() => {
                return prompt();
            });
    });
}

module.exports = interactive