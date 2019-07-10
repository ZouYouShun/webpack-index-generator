import chalk from 'chalk';
import * as path from 'path';

import { IndexGenerator } from './generator';
import { BaseModel } from './model';


export class App {

  constructor() { this.run(); }

  async run() {
    try {
      const totalModel = this.getArgs();

      switch (totalModel.do) {
        case '-v':
        case '-V':
        case '-vession':
          const pkg = require('./package.json');
          console.log(pkg.version);
          break;
        case '--help':
          break;
        case 'g':
        case 'generate':
          console.log(chalk.green(`from Url: `) + totalModel.targetUrl);

          switch (totalModel.action) {
            case 'i':
            case 'index':
              await new IndexGenerator(totalModel).createFile();
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      console.log(chalk.green('completed!'));
    } catch (err) {
      console.log(chalk.red(err));
    }
    process.exit();
  }

  private getArgs(): BaseModel {
    const args = process.argv.slice(2);

    return {
      do: args[0],
      action: args[1],
      targetUrl: path.resolve(args[2] || ''),
      config: args.slice(3)
    };
  }
}

module.exports = new App();
