import chalk from 'chalk';
import * as chokidar from 'chokidar';
import * as path from 'path';
import * as shell from 'shelljs';

import { bindDebonce } from './libs';

interface IndexGeneratorOptions {
  // the path of watch dir
  dir?: string[] | string;
}

class IndexGenerator {

  debonce = bindDebonce(this, 50);
  chunkVersions = {};
  watcher: chokidar.FSWatcher;
  watchers: chokidar.FSWatcher[];

  targetUrl: string[] | string;

  skip = true;

  notExportTemp = [];

  constructor(private options: IndexGeneratorOptions = {}) { }

  fileWrite = (type: string, url: string, ignore: string) => {

    if (this.skip) {
      return;
    }

    const ext = 'js';

    if (
      !new RegExp(`\.${ext}$`, 'gi').test(url) ||
      new RegExp(`\.spec\.${ext}$`, 'gi').test(url) ||
      new RegExp(`\.test\.${ext}$`, 'gi').test(url) ||
      new RegExp(`^index\.${ext}$`, 'gi').test(url)
    ) {
      return;
    }

    this.debonce(() => {
      console.log(chalk.blue(`${type} file: `) + url);
      const target = path.dirname(path.resolve(url));
      //  --color always` https://github.com/shelljs/shelljs/issues/86
      const cmd = `alang g i ${target} --js --force --ignore=${ignore} --color=always`;
      // console.log(cmd);
      shell.exec(cmd);
    });
  }

  apply(compiler) {
    compiler.hooks.entryOption.tap('IndexGenerator', (context, entry) => {

      this.targetUrl = this.options.dir || path.dirname(entry);


      if (!(this.targetUrl instanceof Array)) {
        this.bindWatcher(this.targetUrl);

      } else {
        this.targetUrl.forEach(url => {
          this.bindWatcher(url);
        })
      }

    });


    compiler.hooks.done.tap('IndexGenerator', (stats) => {
      this.skip = false;
    });

  }

  private bindWatcher(targetUrl: string) {
    const ignore = path.join(path.resolve(targetUrl), 'index.ignore.json');

    const watcher = chokidar
      .watch(targetUrl, {
        ignored: /^\./,
        persistent: true,
      })
      .on('add', (url) => this.fileWrite('add', url, ignore))
      // .on('change', (url) => this.fileWrite('change', url))
      .on('unlink', (url) => this.fileWrite('unlink', url, ignore))
      .on('error', (error) => { console.error('Error happened', error); });
    return watcher;
  }
}

module.exports = IndexGenerator;