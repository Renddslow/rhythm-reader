import fs from 'fs/promises';
import path from 'path';

const getStringFromFile = async (p) =>
  (await fs.readFile(path.join(process.cwd(), p)).catch(() => '[]')).toString();

const compileHyperlinks = async () => {
  const assets = JSON.parse(await getStringFromFile('hyperlinks.json'));

  await Promise.all(
    Object.keys(assets).map(async (key) => {
      const asset = {
        ...assets[key],
        id: key,
      };

      if (asset.readings && asset.readings.length) {
        asset.readings = await Promise.all(
          asset.readings.map(async (reading) => ({
            ...reading,
            content: JSON.parse(await getStringFromFile(`data/final/${reading.ref}.json`)),
          })),
        );
      }

      await fs.writeFile(
        path.join(process.cwd(), `public/assets/hyperlink.${asset.id}.json`),
        JSON.stringify(asset),
      );
    }),
  );
};

compileHyperlinks().then(() => console.log('Hyperlinks compiled!'));
