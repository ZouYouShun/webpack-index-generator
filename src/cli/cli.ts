import * as program from 'commander';

import { GeneratorEntry } from './generator/generator.entry';

export class Cli {
  action: string;
  targetUrl: string;

  constructor() {
    this.setVersion();
    GeneratorEntry.init();
    program.parse(process.argv);
  }

  private setVersion() {
    const pkg = require('../../package.json');
    program.version(pkg.version, '-v, --version').usage('<command> [options]');
  }
}
