import chalk from 'chalk';
import * as chokidar from 'chokidar';
import * as path from 'path';
import * as fs from 'fs';

import * as shell from 'shelljs';

import { bindDebonce } from './libs';

interface IndexGeneratorOptions {
  // the path of watch dir
  dir?: string[] | string;
}

export class IndexGenerator {

  debonce = bindDebonce(this, 50);
  chunkVersions = {};

  targetUrl: string[] | string;

  skip = true;

  notExportTemp = [];

  constructor(private options: IndexGeneratorOptions = {}) { }

  apply(compiler) {
    compiler.hooks.entryOption.tap(this.constructor.name, (context, entry) => {

      this.targetUrl = this.options.dir || path.dirname(entry);


      if (!(this.targetUrl instanceof Array)) {
        this.bindWatcher(this.targetUrl);

      } else {
        this.targetUrl.forEach(url => {
          this.bindWatcher(url);
        })
      }

    });

    compiler.hooks.done.tap(this.constructor.name, (stats) => {
      this.skip = false;
    });

  }

  private bindWatcher(targetUrl: string) {
    const ignore = path.join(path.resolve(targetUrl), 'index.ignore.json');

    const watcher = chokidar
      .watch(targetUrl, {
        ignored: /^\./,
        persistent: true,
      });

    const handler = this.handler(ignore, watcher, targetUrl);

    watcher
      .on('add', (url) => handler('add', url))
      .on('change', (url) => handler('change', url))
      .on('unlink', (url) => handler('unlink', url))
      .on('error', (error) => { console.error('Error happened', error); });

    return watcher;
  }

  private handler(ignore: string, watcher: chokidar.FSWatcher, targetUrl: string) {
    const ext = 'js';

    return (type: string, url: string) => {
      if (this.skip) { return; }

      if (
        !new RegExp(`\.${ext}$`, 'gi').test(url) ||
        new RegExp(`\.spec\.${ext}$`, 'gi').test(url) ||
        new RegExp(`\.test\.${ext}$`, 'gi').test(url) ||
        new RegExp(`^index\.${ext}$`, 'gi').test(url)
      ) {
        return;
      }

      const targetDir = path.dirname(path.resolve(url));
      const fileName = path.basename(url, `.${ext}`);

      switch (type) {
        // check the file content has export in that
        case 'add': {
          const content = fs.readFileSync(url).toString();

          if (!content.includes('export')) { return; }
        }
        case 'change': {
          const indexUrl = path.join(targetDir, 'index.js');
          if (fs.existsSync(indexUrl)) {
            const content = fs.readFileSync(indexUrl).toString();
            if (content.includes(fileName)) { return; }
          }
        }
      }

      this.debonce(() => {
        // remove watch to current path, because that will change file and re occur the change event loop
        watcher.unwatch(targetUrl);

        console.log(chalk.blue(`${type} file: `) + url);
        //  --color always` https://github.com/shelljs/shelljs/issues/86
        const cmd = `alang g i ${targetDir} --js --force --ignore=${ignore} --color=always`;
        // console.log(cmd);
        shell.exec(cmd);
        // reconnect the path with current targetUrl
        watcher.add(targetUrl);
      });
    };
  }

}
