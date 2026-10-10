export type LayoutSlugs = {
  sliders: string
  flipbooks: string
}

let slugs: LayoutSlugs = {
  sliders: 'sliders',
  flipbooks: 'flipbooks',
}

export function setLayoutSlugs(next: LayoutSlugs) {
  slugs = next
}

export function getLayoutSlugs(): LayoutSlugs {
  return slugs
}
