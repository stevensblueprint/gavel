const fs = require('fs');
const execute = require('./execCommand').execute;

const runSingleFile = async(file, file_post_data) => {
  console.log('Running single file...');

  let file_name = file_post_data.file_name;
  let time_limit = parseInt(file_post_data.time_limit);

  //might need to check that there is .py at the end?
  if (file_name.slice(file_name.length - 3) !== '.py') {
      file_name += '.py';
  }

  fs.writeFile(file_name, file, function(err) {
      if (err) {
          return {
              'error': 'File creation failed.',
          };
      }
  });

  const command = 'python3 ' + file_name;
  const result = await execute(command, time_limit);
  
  fs.unlink(file_name, (err) => {
      if (err) {
          if (result.errors) {
              result.errors.push('Error in removing file');
          } else {
              result.error = 'Error in removing file.';
          }
      }
  });

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

    fs.writeFile(fileName, file, function(err) {
        if (err) {
            return {
                'error': 'Program file creation failed.',
            };
        }
    });

    fs.writeFile(testFileName, testFile, function(err) {
        if (err) {
            return {
                'error': 'Test program file creation failed.',
            };
        }
    });

    const command = 'python3 ' + testFileName;
    const result = await execute(command, timeLimit);

    fs.unlink(fileName, (err) => {
        if (err) {
            if (result.errors) {
                result.errors.push('Error in removing program file');
            } else {
                result.error = 'Error in removing program file.';
            }
        }
    });

    fs.unlink(testFileName, (err) => {
        if (err) {
            if (result.errors) {
                result.errors.push('Error in removing test program file');
            } else {
                result.error = 'Error in removing test program file.';
            }
        }
    });

    return result;
};

module.exports = {
  runSingleFile,
  runFileAndTest,
};
