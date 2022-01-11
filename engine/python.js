const execute = require('./execCommand').execute;
const fileOp = require('./fileManager');
const aws = require('../data/utilAWS');

const runSingleFile = async(file, file_post_data) => {
  console.log('Running single file...');

  let file_name = file_post_data.file_name;
  let time_limit = parseInt(file_post_data.time_limit);

  //might need to check that there is .py at the end?
  if (file_name.slice(file_name.length - 3) !== '.py') {
      file_name += '.py';
  }
  console.log(file);
  const createFile = fileOp.writeFile(file_name, file);

  if (createFile.error) {
      return createFile;
  }
  
  const command = 'python3 ' + file_name;
  const result = await execute(command, time_limit);
 
  fileOp.removeFile(file_name, result);
  return result;
};


const runFileAndTest = async(file, testFile, postDetails) => {
    console.log('Running single file and test...');

    let fileName = postDetails.file_name;
    let testFileName = postDetails.test_file_name;
    let timeLimit = parseInt(postDetails.time_limit);

        //might need to check that there is .py at the end?
    if (fileName.slice(fileName.length - 3) !== '.py') {
        fileName += '.py';
    }

    const createProgramFile = fileOp.writeFile(fileName, file);
    if (createProgramFile.error) {
        return createProgramFile;
    }

    const createTestFile = fileOp.writeFile(testFileName, testFile);
    if (createTestFile.error) {
        return createTestFile;
    }

    const command = 'python3 ' + testFileName;
    const result = await execute(command, timeLimit);

    fileOp.removeFile(fileName, result);
    fileOp.removeFile(testFileName, result);
    
    return result;
};

const runBatch = async(zipFile, otherFiles, postDetails) => {
    console.log('Running zip files and testing...');

    let timeLimit = parseInt(postDetails.time_limit);
    console.log(otherFiles);
    //let testFileName = otherFiles[0][0];
    const command = 'python3 ' + 'cs115_grader.py';
    otherFiles.forEach((file) => {
        const createFile = fileOp.writeFile(file[0], file[1].file);
        if (createFile.error) {
            return createFile;
        }
    });
    let responses = [];
    let file_removal_errors = {};
    let i = 0;

    // is there a more elegant way for this while loop to happen?
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const getSubmissionFile = await aws.retrieveFileFromZip(zipFile, i, postDetails.desired_file_rename);
        if (getSubmissionFile instanceof Object) {
            console.log('got an object');
            if (getSubmissionFile.noMoreFiles) {
                break;
            } else {
                return {
                    'error': getSubmissionFile.error,
                };
            }
        }
        console.log('executing: ' + i);
        const result = await execute(command, timeLimit);
        responses.push(result);
        fileOp.removeFile(postDetails.desired_file_rename, file_removal_errors);
        i++;
    }

    otherFiles.forEach((file) => {
        fileOp.removeFile(file[0], file_removal_errors);
    });

    if (file_removal_errors.errors) {
        responses.push(file_removal_errors);
    }

    console.log('cleaned up');
    console.log(responses);

    return responses;

};

module.exports = {
  runSingleFile,
  runFileAndTest,
  runBatch,
};
