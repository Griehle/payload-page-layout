# payload-page-layout

Page-layout blocks for [Payload CMS](https://payloadcms.com): a column row, button, Vimeo video, image slider, PDF flipbook, and raw HTML. Drop the plugin into a Payload app and render the blocks on the page.

This folder is the whole package. It can be the root of its own repository.

## Install

```bash
pnpm add payload-page-layout
```

From GitHub, before it is on npm:

```bash
pnpm add github:YOUR_USER/payload-page-layout
```

Peer dependencies: `payload`, `next`, `react`, `react-dom`, `@payloadcms/ui`, `@payloadcms/richtext-lexical`.

The package is TypeScript source. Compile it with Next:

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ['payload-page-layout'],
}
```

Tailwind does not scan `node_modules`. Point it at the package from your global CSS:

```css
@source "../node_modules/payload-page-layout/src";
```

## Plugin

```ts
import { layoutPlugin } from 'payload-page-layout'
import { CallToAction } from './blocks/CallToAction/config'
import { MediaBlock } from './blocks/MediaBlock/config'

export default buildConfig({
  plugins: [
    layoutPlugin({
      collections: ['pages'],
      // Internal links. Use the collections this site actually has.
      linkRelationTo: ['pages', 'posts'],
      // Your own blocks, included in the layout and inside columns.
      extraBlocks: [CallToAction, MediaBlock],
    }),
  ],
})
```

The plugin adds a `sliders` collection and a `flipbooks` upload collection. On each collection in `collections`, it fills a blocks field named `layout` (including one nested in tabs). If that field already exists, these blocks are added to it. If it does not exist, the field is created.

`createLayout()` returns the same blocks and collections if you would rather place them yourself.

## Render

```tsx
import { RenderBlocks } from 'payload-page-layout/rsc'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

<RenderBlocks
  blocks={page.layout}
  renderLink={CMSLink}
  renderRichText={RichText}
  blockComponents={{
    cta: CallToActionBlock,
    mediaBlock: MediaBlock,
  }}
/>
```

`renderLink` and `renderRichText` are optional. Without them, links are plain anchors and rich text uses Payload's default renderer. Pass your own so internal links and embedded blocks match the rest of the site.

Client components must not import the package root. That entry loads the plugin, which pulls in Payload's server code. Width and alignment classes are available from `payload-page-layout/sizing`.

Sliders run on the client and need your media and link components. Wrap the frontend once:

```tsx
'use client'
import { LayoutClientProvider } from 'payload-page-layout/client'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export function LayoutSlots({ children }: { children: React.ReactNode }) {
  return (
    <LayoutClientProvider link={CMSLink} media={Media}>
      {children}
    </LayoutClientProvider>
  )
}
```

After adding the plugin, run `payload generate:importmap` and `payload generate:types`. The color picker is an admin field, and the import map has to include `payload-page-layout/client#ColorPickerField`.

## Flipbooks

Flipbooks render PDFs with PDF.js. Copy the PDF.js assets into `public/pdfjs` (wasm, cmaps, standard fonts, and icc profiles). Uploaded PDFs are stored in `public/flipbooks` unless you set `flipbooksDir`.

## Blocks

| Slug | What it is |
| --- | --- |
| `content` | A row of columns. Each column has rich text, nested blocks, and an optional link. |
| `contentRow` | A row that can sit inside a column. It does not contain another row. |
| `button` | A link styled as a button, with optional colors, size, and padding. |
| `video` | A Vimeo embed, including unlisted links. |
| `slider` | A carousel. Slides live in the `sliders` collection. |
| `flipbook` | A page-flip PDF. Files live in the `flipbooks` collection. |
| `html` | HTML pasted onto the page. |

## Publish this repository

From this directory:

```bash
git init -b main
git add .
git commit -m "Initial commit"
gh repo create payload-page-layout --public --source=. --remote=origin --push
```
