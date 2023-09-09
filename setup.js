const { exec, spawn } = require('child_process');
const path = require('path');

//Checks if the user has already installed Angular CLI
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

//Goes to the backend
const backendPath = path.join(__dirname, 'backend');
//Checks if the user has installed sqlite
if (!isSqlite3Installed(backendPath)) {
  console.log('Installing sqlite3...');
  
  //Installs sqlite3
  const installSqlite3Process = exec('npm install sqlite3', { cwd: backendPath });
  installSqlite3Process.stdout.pipe(process.stdout);
  installSqlite3Process.stderr.pipe(process.stderr);

  installSqlite3Process.on('exit', (code) => {
    if (code === 0) {
      console.log('sqlite3 has been successfully installed.');
    } else {
      console.error('Error installing sqlite3.');
    }
  });
}

//Starts the backend
process.chdir(backendPath);

const backendProcess = exec('npm start');
backendProcess.stdout.pipe(process.stdout);
backendProcess.stderr.pipe(process.stderr);

//Checks if npm is already installed
const frontendPath = path.join(__dirname, 'frontend');
exec(`npm -v`, (error, stdout, stderr) => {
  if (!error) {
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

function isSqlite3Installed(backendPath) {
  const packageJsonPath = path.join(backendPath, 'package.json');
  try {
    const packageJson = require(packageJsonPath);
    return packageJson.dependencies && packageJson.dependencies.sqlite3;
  } catch (error) {
    return false;
  }
}