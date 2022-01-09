const fs = require('fs');
//const exec = require('child_process').exec;

const runSingleFile = (file, file_name) => {
  console.log('Running single file...');

  fs.writeFile(file_name, file, function(err) {
      if (err) {
          return {
              'error': 'File creation failed.',
          };
      }
  });

  return {
      'message': 'Success',
  };


};

module.exports = {
  runSingleFile,
};
