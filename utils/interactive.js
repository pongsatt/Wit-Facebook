const readline = require('readline');

const interactive = (fn) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

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

        console.log("Message: ", line);
        return fn(line)
            .then(() => {
                return prompt();
            }, (error) => {
                console.error(error);
                return prompt();
            });
    });
}

module.exports = interactive