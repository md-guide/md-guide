#!/usr/bin/env node

const glob = require('glob');
const path = require('path');
const cwd = process.cwd()
const rushJSONPath = path.join(cwd, 'rush.json')
const requireJSON5 = require('require-json5');
const fs = require('fs')
const rushJSON = requireJSON5(rushJSONPath)
const ignoreRules = fs.readFileSync('.gitignore').toString().split('\n')
const projects = glob.sync('!(common)/*/package.json', {
}).map((pkg)=>{
  return {
    "packageName": require(path.join(cwd, pkg)).name,
    "projectFolder": path.dirname(pkg),
  }
})
rushJSON.projects = projects
fs.writeFileSync(rushJSONPath, JSON.stringify(rushJSON, null, 2))
console.log(`
Successfully added 
${
  projects.map(p=>`  ${p.projectFolder} --> ${p.packageName}`).join('\n')
}
`)