const util = require('util');
const exec = util.promisify(require('child_process').exec);

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
            }
            if (stderr) {
                errors.push({
                    'stderr': stderr,
                });
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

module.exports = {
    execute,
};