const execute = require('./execCommand').execute;
const fileOp = require('./fileManager');

const runSingleFile = async(file, file_post_data) => {
    console.log('Running single file...');

    let file_name = file_post_data.file_name;
    let time_limit = parseInt(file_post_data.time_limit);
  
    //might need to check that there is .cpp at the end?
    if (file_name.slice(file_name.length - 4) !== '.cpp') {
        file_name += '.cpp';
    }
    const createFile = fileOp.writeFile(file_name, file);
  
    if (createFile.error) {
        return createFile;
    }

    const makeFilePath = file_post_data.compiler === '-03' ? './engine/makefiles/makefile_03' : './engine/makefiles/makefile_g';
    const parentDir = './';

    const moveMakeFileCommand = 'cp ' + makeFilePath + ' ' + parentDir;
    const moveCommandResult = await execute(moveMakeFileCommand, time_limit);

    if (moveCommandResult.error) {
        return moveCommandResult;
    }

    const compileCommand = 'make';
    const compileResult = await execute(compileCommand, time_limit);

    if (compileResult.error.length > 0 || compileResult.stderr.length > 0) {
        return compileResult;
    }

    const executableName = file_name.slice(0, file_name.length - 4);
    const executeFileCommand = './' + executableName + ' ' + file_post_data.cli_args;
    
    fileOp.removeFile(file_name, executeFileCommand);
    return executeFileCommand;
};
  
  
module.exports = {
    runSingleFile,
};