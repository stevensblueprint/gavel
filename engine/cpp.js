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

    let makeFileName = makeFilePath.split('/');
    makeFileName = makeFileName[makeFileName.length - 1];
    fileOp.renameFile(makeFileName, 'makefile');

    const compileCommand = 'make';
    const compileResult = await execute(compileCommand, time_limit);

    if (compileResult.error || compileResult.stderr) {
        return compileResult;
    }

    const executableName = file_name.slice(0, file_name.length - 4);
    const executeFileCommand = './' + executableName + ' ' + file_post_data.cli_args;
    let executeResult = await execute(executeFileCommand, time_limit);

    if (executeResult.error) {
        if (executeResult.error.killed === false &&
        executeResult.error.code === 1 &&
        executeResult.error.signal === null &&
        executeResult.error.stdout && !executeResult.error.stderr) {
            executeResult['gavel_message'] = 'It looks like your code executed correctly returned 1 indicating an error. Are you sure you are returning the right thing?';
        }
    }

    if (file_post_data.valgrind_check === 'True') {
        const valgrindCommand = 'valgrind --leak-check=full --show-leak-kinds=all --track-origins=yes --verbose ./' + executableName + ' ' + file_post_data.cli_args;
        const valgrindResult = await execute(valgrindCommand, time_limit);
        executeResult['valgrind'] = valgrindResult;
    }
    
    fileOp.removeFile(file_name, executeResult);
    fileOp.removeFile(executableName, executeResult);
    fileOp.removeFile('makefile', executeResult);
    return executeResult;
};
  
  
module.exports = {
    runSingleFile,
};