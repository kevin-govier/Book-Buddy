const { exec, spawn } = require('child_process');
const path = require('path');


// Check if the user already has Angular CLI installed
exec('ng version', (error, stdout, stderr) => {
  if (error) {
    console.log('Installing Angular CLI...');
    // Installs Angular CLI globally for the user
    exec('npm install -g @angular/cli', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error installing Angular CLI: ${error.message}`);
        return;
      }
      console.log('Angular CLI installed successfully.');
    });
  }
});
// Navigate to the backend and start the backend
const backendPath = path.join(__dirname, 'backend');
process.chdir(backendPath);

const childProcess = exec('npm start');
childProcess.stdout.pipe(process.stdout);
childProcess.stderr.pipe(process.stderr);

const frontendPath = path.join(__dirname, 'frontend');
exec(`npm -v`, (error, stdout, stderr) => {
  if (!error) {
    // Continue with npm start for the frontend
    startFrontend(frontendPath);
  } else {
    installNpm(frontendPath);
  }
});


function installNpm(frontendPath) {
  exec(`start cmd.exe /K "cd ${frontendPath} && npm install && npm start && pause"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting frontend server: ${error.message}`);
      return;
    }
  });
}

function startFrontend(frontendPath) {
  exec(`start cmd.exe /K "cd ${frontendPath} && npm start && pause"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting frontend server: ${error.message}`);
      return;
    }
  });
}