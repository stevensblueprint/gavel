const execute = require('./execCommand').execute;
const fileOp = require('./fileManager');

const runSingleFile = async(file, file_post_data) => {
  console.log('Running single file...');

  let file_name = file_post_data.file_name;
  let time_limit = parseInt(file_post_data.time_limit);

  //might need to check that there is .py at the end?
  if (file_name.slice(file_name.length - 3) !== '.py') {
      file_name += '.py';
  }

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

module.exports = {
  runSingleFile,
  runFileAndTest,
};
