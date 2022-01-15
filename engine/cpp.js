const execute = require('./execCommand').execute;
const execStdIn = require('./execCommand').executeWithStdin;
const fileOp = require('./fileManager');

const runSingleFile = async(files, file_post_data) => {
    console.log('Running single file...');

    let file_name = file_post_data.file_name;
    let time_limit = parseInt(file_post_data.time_limit);

    //might need to check that there is .cpp at the end?
    if (file_name.slice(file_name.length - 4) !== '.cpp') {
        file_name += '.cpp';
    }

    files.forEach((nameAndFile) => {
        const createFile = fileOp.writeFile(nameAndFile[0], nameAndFile[1]);
        if (createFile.error) {
            return createFile;
        }
    });

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

    if (file_post_data.stdin_args.length > 0) {
        const executable = './' + executableName;
        let executeStdIn = {};
        const exec = execStdIn(executable, time_limit, file_post_data.stdin_args);
        executeStdIn['stdout'] = Buffer.from(exec.stdout).toString();
        executeStdIn['stderr'] = Buffer.from(exec.stderr).toString();
        
        if (file_post_data.valgrind_check === 'True') {
            executeStdIn['gavel_message'] = 'Valgrind unsupported for CPP files that have stdin.';
        }

        fileOp.removeFile(file_name, executeStdIn);
        fileOp.removeFile(executableName, executeStdIn);
        fileOp.removeFile('makefile', executeStdIn);

        return executeStdIn;
    } else {
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
    }
};

const runFileAndTest = async(file, testFile, postDetails) => {
    console.log('Running single file and test C++...');

    let fileName = postDetails.file_name;
    let testFileName = postDetails.test_file_name;
    let timeLimit = parseInt(postDetails.time_limit);

    const makeFilePath = postDetails.compiler === '-03' ? './engine/makefiles/makefile_03' : './engine/makefiles/makefile_g';
    const parentDir = './';

    const moveMakeFileCommand = 'cp ' + makeFilePath + ' ' + parentDir;
    const moveCommandResult = await execute(moveMakeFileCommand, timeLimit);

    if (moveCommandResult.error) {
        return moveCommandResult;
    }
    let makeFileName = makeFilePath.split('/');
    makeFileName = makeFileName[makeFileName.length - 1];
    fileOp.renameFile(makeFileName, 'makefile');
    
    //might need to check that there is .cpp at the end?
    if (fileName.slice(fileName.length - 4) !== '.cpp') {
        fileName += '.cpp';
    }
    const createProgramFile = fileOp.writeFile(fileName, file);
    if (createProgramFile.error) {
        return createProgramFile;
    }

    const createTestFile = fileOp.writeFile(testFileName, testFile);
    if (createTestFile.error) {
        return createTestFile;
    }
    
    const command = 'bash ' + testFileName;
    const result = await execute(command, timeLimit);
    fileOp.removeFile(fileName, result);
    fileOp.removeFile(testFileName, result);
    
    return result;
};


module.exports = {
    runSingleFile,
    runFileAndTest,
};