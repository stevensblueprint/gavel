const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawn;

const execute = async(command, time_limit) => {
    let errors = [];
    let output = {};

    try {
        const { err, stdout, stderr } = await exec(command, { timeout: time_limit });
        if (err) {
            if (err.signal === 'SIGTERM') {
                errors.push({
                    'raw_error' : err.toString(),
                    'explanation': 'Recieved the SIGTERM signal from program.',
                });
            }
            else if (err.toString().includes('ERR_CHILD_PROCESS_STDIO_MAXBUFFER')) {
                errors.push({
                    'raw_error' : err.toString(),
                    'explanation': 'Max buffer exceeded. Infinite loop detected.',
                });
            }
        } else {
            output['message'] = 'Successfully executed file.';
            output['stdout'] = stdout;
            output['stderr'] = stderr;

            if (!stdout) {
                output['Gavel message'] = 'Hmm, there is nothing in stdout. Did you make sure you printed something?';
            }
        }
        output['errors'] = errors;
        return output;
    } catch (e) {
        return {
            'error': e,
        };
    }
};

// function onExit (childProcess) {
//     console.log(childProcess);
//     console.log('stdout...');
//     console.log(childProcess.stdout);
//     return new Promise((resolve, reject) => {
//       childProcess.once('exit', (code, signal) => {
//         if (code === 0) {
//           console.log('signal: ' + signal);
//           resolve(undefined);
//         } else {
//           reject(new Error('Exit with error code: '+code));
//         }
//       });
//       childProcess.once('error', (err) => {
//         reject(err);
//       });
//     });
//   }

const executeWithStdin = (command, timeLimit, stdinArgs, out, err, fail) => {
    console.log('hit this function');
    try {
        const executeStdinProgram = spawn(command, {timeout: timeLimit});
        executeStdinProgram.stdin.write(stdinArgs);
        executeStdinProgram.stdin.end();
        executeStdinProgram.stdout.on('data', (data) => {
            // console.log(Buffer.from(data).toString());
            console.log('hit this event');
            out += Buffer.from(data).toString();
        });
        executeStdinProgram.stderr.on('data', (data) => {
            err += data;
        });
    } catch (e) {
        // eslint-disable-next-line no-unused-vars
        fail += e;
    }
};

module.exports = {
    execute,
    executeWithStdin,
};