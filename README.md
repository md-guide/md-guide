# MdGuide

Interactive and replayable programming guides in markdown

## How to use
Start the build process

```sh
rush run -s start
```

Go to the example project and start run the command tool

```sh
cd ./libs/example
node ../cli/dist/index.js serve
```

Now you can:
- add content and commands using the web app at [http://localhost:3001](http://localhost:3001)
- update ./example/GUIDE.md and the changes will be synced
- add and modify files under ./example/files and the filetree and changes are synced with GUIDE.md


Based on the work done by
- https://jbook.qiushiyan.dev/ https://github.com/qiushiyan/js-notebook
- https://github.com/codesandbox/sandpack
- https://github.com/akshaykmr/teletype
