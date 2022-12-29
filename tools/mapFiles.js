import fs from 'fs/promises';
import path from 'path';
import { globby } from 'globby';
import makeDir from 'make-dir';

const mapFiles = async (
  src,
  srcType,
  dest,
  destType,
  cb,
  stringify = true,
  formatter = (i) => i,
) => {
  const paths = await globby(path.join(process.cwd(), 'data', src, `*.${srcType}`));
  await Promise.all(
    paths.map(async (p) => {
      const file = await fs.readFile(p);
      const content = stringify ? file.toString() : file;
      const out = await Promise.resolve(cb(content, p));

      const filename = path.basename(p, `.${srcType}`);
      const outDir = path.dirname(p).replace(src, dest);
      const outFilePath = path.join(outDir, `${filename}.${destType}`);

      await makeDir(outDir);
      return fs.writeFile(outFilePath, formatter(out));
    }),
  );
};

export default mapFiles;
