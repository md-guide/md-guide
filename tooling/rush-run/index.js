const args = process.argv
const command = args.pop()
const glob = require('glob')
const path = require('path')
const {exec, spawn} = require('child_process')
const cwd = process.cwd()
const rushJSONPath = path.join(cwd, 'rush.json');
const requireJSON5 = require('require-json5');
const rushJSON = requireJSON5(rushJSONPath);
const projects = rushJSON.projects.map(project=>`${project.projectFolder}/package.json`).forEach((pkgjson) => {
  const pkg = require(path.join(cwd, pkgjson))
  if(pkg.scripts && pkg.scripts[command]){
    console.log(`running command ${command} in ${pkg.name}`)
    spawn(`npm run ${command}`, {
      cwd: path.dirname(pkgjson),
      shell: true,
      stdio: 'inherit'
    })
  }
});