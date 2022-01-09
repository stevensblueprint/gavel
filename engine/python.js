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

module.exports = {
  runSingleFile,
};
