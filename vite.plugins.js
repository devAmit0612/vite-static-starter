// Modules
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { globSync } from 'glob';

/**
 * Replaces a regex with an async function
 */
async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const results = await Promise.all(promises);
  return str.replace(regex, () => results.shift());
}

/**
 * Converts images to webp, generates srcset, and adds lazy loading
 */
export function responsiveImages() {
  const sizes = [320, 768, 1024, 1440];

  return {
    name: 'responsive-images',

    async closeBundle() {
      const htmlFiles = globSync('dist/**/*.html');

      for (const file of htmlFiles) {
        let html = await fs.promises.readFile(file, 'utf-8');
        const imgRegex = /<img([^>]+)data-image-responsive([^>]*)>/g;

        html = await replaceAsync(html, imgRegex, async (match, before, after) => {
          const srcMatch = match.match(/src="([^"]+)"/);
          if (!srcMatch) return match;

          const src = srcMatch[1];
          const ext = path.extname(src);
          const baseName = path.basename(src, ext);
          const dir = path.dirname(src);
          const srcset = [];

          for (const size of sizes) {
            const outputName = `${baseName}-${size}.webp`;
            const inputPath = path.resolve(process.cwd(), `dist${src}`);
            const outputPath = path.resolve(process.cwd(), `dist${dir}/${outputName}`);

            try {
              await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
              await sharp(inputPath).resize(size).webp({ quality: 75 }).toFile(outputPath);
              srcset.push(`${dir}/${outputName} ${size}w`);
            } catch (err) {
              console.error('[responsiveImages] Error processing image:', inputPath, err);
            }
          }

          const hasLoading = /loading=/i.test(before) || /loading=/i.test(after);
          const hasDecoding = /decoding=/i.test(before) || /decoding=/i.test(after);

          let performanceAttrs = '';
          if (!hasLoading) performanceAttrs += ' loading="lazy"';
          if (!hasDecoding) performanceAttrs += ' decoding="async"';

          let cleanBefore = before.replace(/src="[^"]*"/gi, '');
          let cleanAfter = after.replace(/src="[^"]*"/gi, '');

          cleanBefore = cleanBefore.replace(/\s+/g, ' ').trim();
          cleanAfter = cleanAfter.replace(/\s+/g, ' ').trim();

          return `<img src="${dir}/${baseName}.webp" srcset="${srcset.join(', ')}" sizes="100vw"${performanceAttrs} ${cleanBefore} ${cleanAfter}>`
            .replace(/\s+/g, ' ')
            .trim();
        });

        await fs.promises.writeFile(file, html, 'utf-8');
      }
    },
  };
}

/**
 * SVG injector
 * Replaces <img src="./path/icon.svg" data-svg /> with inline <svg> code
 */
export function injectInlineSvg() {
  return {
    name: 'inject-inline-svg',

    transformIndexHtml: {
      order: 'pre',
      handler: async (html) => {
        const svgRegex = /<img[^>]*?src="([^"]+\.svg)"[^>]*?data-svg[^>]*?>/gi;

        html = await replaceAsync(html, svgRegex, async (match, src) => {
          try {
            const filePath = src.startsWith('@/')
              ? path.resolve(process.cwd(), './src/assets', src.replace('@/', ''))
              : path.resolve(process.cwd(), 'src', src.startsWith('/') ? `.${src}` : src);
            const svgContent = await fs.promises.readFile(filePath, 'utf-8');

            const cleanSvg = svgContent
              .replace(/<\?xml.*?\?>/gi, '')
              .replace(/<!DOCTYPE.*?>/gi, '')
              .trim();

            return cleanSvg;
          } catch (err) {
            console.error(`[SVG Inject] Error reading file ${src}:`, err);
            return match;
          }
        });

        return html;
      },
    },
  };
}
