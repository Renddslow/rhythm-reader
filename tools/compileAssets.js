import fs from 'fs/promises';
import path from 'path';
import makeDir from 'make-dir';
import snarkdown from 'snarkdown';
import kleur from 'kleur';

const enhancedSnarkdown = (markdown) =>
  markdown
    .split(/(?:\r?\n){2,}/)
    .map((l) =>
      [' ', '\t', '#', '-', '*', '>'].some((char) => l.startsWith(char))
        ? snarkdown(l)
        : `<p>${snarkdown(l)}</p>`,
    )
    .join('\n');

const outputJson = (o, movement, item) => {
  const filepath = path.join(process.cwd(), 'public/assets', `movement.${movement}.${item}.json`);
  return fs
    .writeFile(filepath, JSON.stringify(o))
    .then(() => console.log(`${kleur.gray('Created JSON asset at')} ${filepath}`));
};

const chapterRefToInt = (ref) => {
  const [, ch] = /([\d]+)$/.exec(ref);
  return parseInt(ch, 10);
};

const findVerse =
  (ref, type = 'verse') =>
  (block) =>
    block.children.some(
      (c) =>
        c.type === type &&
        c.reference.chapter === chapterRefToInt(ref.chapter) &&
        c.reference.verse === ref.verse,
    );

const trim = (asset, start, end) => {
  const blockStartIdx = asset.content.findIndex(findVerse(start));

  const blockEndIdx = asset.content.findIndex(findVerse(end, 'verse_end'));
  const verseEndIdx = asset.content[blockEndIdx].children.findIndex(
    (c) => c.type === 'verse_end' && c.reference.verse === end.verse,
  );

  asset.content[blockEndIdx].children = asset.content[blockEndIdx].children.slice(
    0,
    verseEndIdx + 1,
  );

  asset.content = asset.content.slice(blockStartIdx, blockEndIdx + 1);
  return asset;
};

const getStringFromFile = async (p) => (await fs.readFile(path.join(process.cwd(), p))).toString();

const compileAssets = async () => {
  await makeDir(path.join(process.cwd(), 'public/assets'));

  const assets = JSON.parse(await getStringFromFile('asset-plan.json'));

  await Promise.all(
    assets.map(async (asset) => {
      if (asset.type === 'video') {
        asset.src = asset.src.replace('watch?v=', 'embed/');
        if (asset.descriptionSrc) {
          asset.description = enhancedSnarkdown(await getStringFromFile(asset.descriptionSrc));
        }

        return outputJson(asset, asset.movement, asset.item);
      }

      if (asset.type === 'markdown') {
        asset.content = enhancedSnarkdown(await getStringFromFile(asset.src)).replace(
          '---',
          '<hr />',
        );
        return outputJson(asset, asset.movement, asset.item);
      }

      if (asset.type === 'scripture') {
        const [, startCh] = /(\d+)$/.exec(asset.start.chapter);
        const [, endCh] = /(\d+)$/.exec(asset.end.chapter);
        const chapters = Array(parseInt(endCh) - parseInt(startCh) + 1)
          .fill()
          .map((_, i) => parseInt(startCh) + i);

        asset.content = (
          await Promise.all(
            chapters.map(async (ch) =>
              JSON.parse(await getStringFromFile(`data/final/${ch}.json`)),
            ),
          )
        ).reduce((acc, ch) => [...acc, ...ch], []);

        await outputJson(trim(asset, asset.start, asset.end), asset.movement, asset.item);
      }
    }),
  );
};

compileAssets().then(() => console.log('Assets compiled'));
