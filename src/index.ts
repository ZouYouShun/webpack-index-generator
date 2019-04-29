import chalk from 'chalk';
import * as chokidar from 'chokidar';
import * as path from 'path';
import * as shell from 'shelljs';

import { bindDebonce } from './libs';

// import * as fs from 'fs';
class App {

  debonce = bindDebonce(this, 50);
  chunkVersions = {};
  watcher: chokidar.FSWatcher;

  targetUrl = '';

  notExportTemp = [];

  constructor() { }

  fileWrite = (type: string, url: string) => {

    const ext = 'js';

    if (
      !new RegExp(`\.${ext}$`, 'gi').test(url) ||
      new RegExp(`\.spec\.${ext}$`, 'gi').test(url) ||
      new RegExp(`\.test\.${ext}$`, 'gi').test(url) ||
      new RegExp(`^index\.${ext}$`, 'gi').test(url)
    ) {
      return;
    }


    // if (type === 'add') {
    //   if (!fs.readFileSync(url).toString().includes('export default')) {
    //     this.notExportTemp.push(url);
    //     return;
    //   }
    // }

    this.debonce(() => {
      // this.watcher.unwatch(this.targetUrl);
      console.log(chalk.blue(`${type} file: `) + url);
      const target = path.dirname(path.resolve(url));
      //  --color always` https://github.com/shelljs/shelljs/issues/86
      const cmd = `alang g i ${target} --js --force --color=always`;
      shell.exec(cmd);
      // this.watcher.add(this.targetUrl);
    });
  }

  apply(compiler) {
    compiler.hooks.entryOption.tap('IndexGenerator', (context, entry) => {

      this.targetUrl = path.dirname(entry);

      // console.log(this.targetUrl);

      this.watcher = chokidar.watch(this.targetUrl, {
        ignored: /^\./,
        persistent: true,
      });

      this.watcher
        .on('add', (url) => this.fileWrite('add', url))
        // .on('change', (url) => this.fileWrite('change', url))
        .on('unlink', (url) => this.fileWrite('unlink', url))
        .on('error', (error) => { console.error('Error happened', error); })
    });

    // compiler.hooks.beforeCompile.tapAsync('IndexGenerator', (params, callback) => {
    //   callback();
    // });


  }

}

module.exports = App;