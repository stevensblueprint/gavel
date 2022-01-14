const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawnSync;

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

  function waitForEventWithTimeout(socket, event, t) {
    return new Promise(function(resolve, reject) {
        var timer;

        function listener(data) {
            clearTimeout(timer);
            socket.removeListener(event, listener);
            resolve(data);
        }

        socket.on(event, listener);
        timer = setTimeout(function() {
            socket.removeListener(event, listener);
            reject(new Error('timeout'));
        }, t);
    });
}

const executeWithStdin = (command, timeLimit, stdinArgs) => {
    try {
        const executeStdinProgram = spawn(command, {input: stdinArgs}, {timeout: timeLimit});
        return executeStdinProgram;
    } catch (e) {
        return e;
    }
};

module.exports = {
    execute,
    executeWithStdin,
};