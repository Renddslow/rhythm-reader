import path from 'path';
import cv from 'chapter-and-verse';
import { parse } from '@saibotsivad/blockdown';

import mapFiles from './mapFiles.js';
import tokenize from './tokenize.js';

const convertTokenToItem = (token, chapterVerse) => {
  const verseRegexp = /{(\d*)}/;
  if (verseRegexp.test(token)) {
    const [, verse] = verseRegexp.exec(token);
    return {
      type: 'verse',
      reference: {
        id: `${chapterVerse.book.id.toUpperCase()}${chapterVerse.chapter}:${verse}`,
        chapter: chapterVerse.chapter,
        book: chapterVerse.book.id,
        verse: parseInt(verse, 10),
        readable: `${chapterVerse.book.name} ${chapterVerse.chapter}:${verse}`,
      },
    };
  }

  const italicsRegexp = /_(.*)_/;
  if (italicsRegexp.test(token)) {
    const [, text] = italicsRegexp.exec(token);
    return {
      type: 'char',
      style: 'italic',
      content: text,
    };
  }

  const boldRegexp = /\*\*(.*)\*\*/;
  if (boldRegexp.test(token)) {
    const [, text] = boldRegexp.exec(token);
    return {
      type: 'char',
      style: 'bold',
      content: text,
    };
  }

  const linkRegexp = /\[\[(.*)]]/;
  if (linkRegexp.test(token)) {
    const [, text] = linkRegexp.exec(token);
    const [link, label, id] = text.split('|').map((t) => t.trim());
    return {
      id: id ?? link,
      type: 'hyperlink',
      link,
      content: label ?? link,
    };
  }

  return {
    type: '_text', // will be cleaned up after intermediate
    content: token,
  };
};

const mergeText = (content) => {
  return content.reduce((acc, node, idx) => {
    if (node.type === '_text') {
      if (idx !== 0 && acc[acc.length - 1].type === 'char' && !acc[acc.length - 1].style) {
        acc[acc.length - 1].content += ` ${node.content}`;
      } else {
        acc.push({
          type: 'char',
          content: node.content,
        });
      }
      return acc;
    }

    return [...acc, node];
  }, []);
};

const getIndent = (line) => {
  if (!line.startsWith('>')) return 1;
  const [, indent] = /^(>+)/.exec(line);
  return indent.trim().length;
};

const convertVerseToEndVerse = (verse) => {
  return { ...verse, type: 'verse_end' };
};

const parseMarkdown = async (content, pathname) => {
  const [ref] = path
    .basename(pathname, '.md')
    .replace(/(\d*)$/, ' $1')
    .split('.');
  const chapterVerse = cv(ref);
  if (!chapterVerse?.book?.id) {
    console.log(chapterVerse, ref);
  }
  const value = content.trim();

  let lastVerse;

  const items = parse(value).blocks.reduce((acc, block) => {
    if (block.name === 'p') {
      const tokens = tokenize(block.content.trim());
      const items = tokens.reduce((acc, token) => {
        const item = convertTokenToItem(token, chapterVerse);

        if (item.type === 'verse') {
          if (lastVerse) {
            acc.push(convertVerseToEndVerse(lastVerse));
          }
          lastVerse = item;
        }

        return [...acc, item];
      }, []);
      const children = mergeText(items);

      return [
        ...acc,
        {
          type: 'paragraph',
          children,
        },
      ];
    }

    const node = {
      type: 'poetry',
      children: block.content
        .trim()
        .split('\n')
        .map((line) => ({
          type: 'poetry_line',
          indent: getIndent(line),
          children: (() => {
            const cleanedLine = line
              .trim()
              .replace(/^(>+) /, '')
              .trim();
            const tokens = tokenize(cleanedLine);
            const items = tokens.reduce((acc, token) => {
              const item = convertTokenToItem(token, chapterVerse);

              if (item.type === 'verse') {
                if (lastVerse) {
                  acc.push(convertVerseToEndVerse(lastVerse));
                }
                lastVerse = item;
              }

              return [...acc, item];
            }, []);

            return mergeText(items);
          })(),
        })),
    };

    return [...acc, node];
  }, []);

  items[items.length - 1].children.push(convertVerseToEndVerse(lastVerse));

  return JSON.stringify(items);
};

(async () => {
  await mapFiles('raw', 'md', 'final', 'json', parseMarkdown);
})();
