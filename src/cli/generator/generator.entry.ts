import * as program from 'commander';
import { IndexGenerator } from './index.generator';

export class GeneratorEntry {
  static init() {
    program
      .command('g')
      .description('deploy the given env')
      .option('-f, --force [force]', 'Is run update force')
      .option('-i, --ignore [ignorePath]', 'Is run update force')
      .option('-p, --perttier-config [perttierConfig]', 'perttier config path')
      .option('-js, --js', 'Is js mode')
      .action((action, target, options) => {
        switch (action) {
          case 'i':
          case 'index':
            new IndexGenerator(target, options).createFile();

            break;

          default:
            break;
        }
      });
  }
}
