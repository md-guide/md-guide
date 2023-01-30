const args = process.argv
const command = args.pop()
const glob = require('glob')
const path = require('path')
const {exec, spawn} = require('child_process')
const cwd = process.cwd()
const projects = glob.sync('!(common)/*/package.json', {
}).forEach((pkgjson) => {
  const pkg = require(path.join(cwd, pkgjson))
  if(pkg.scripts[command]){
    console.log(`running command ${command} in ${pkg.name}`)
    spawn(`npm run ${command}`, {
      cwd: path.dirname(pkgjson),
      shell: true,
      stdio: 'inherit'
    })
  }
});