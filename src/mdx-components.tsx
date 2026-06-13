import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { ImageZoom } from 'nextra/components'
import type { MDXComponents } from 'mdx/types'
import type { ComponentProps, ComponentType } from 'react'
import { Callout as DefaultCallout } from './components/Callout.js'
import { DataTable } from './components/DataTable.js'
import { Embed } from './components/Embed.js'
import { PageBreadcrumb, type MetaShape } from './components/PageBreadcrumb.js'
import { Video } from './components/Video.js'
import { YouTube } from './components/YouTube.js'

interface CreateUseMDXComponentsOptions {
  /** The consumer's `_meta.js` default export. Drives the PageBreadcrumb's group prefix. */
  meta: MetaShape
  /**
   * Optional override for the Callout component. Defaults to the engine's
   * house-style Callout (7 variants: default, info, tip, success, warning,
   * error, important). Pass your own if you need different variants or
   * styling.
   */
  Callout?: ComponentType<any>
}

/**
 * Factory: returns a `useMDXComponents` function with all engine components
 * registered globally and the custom PageBreadcrumb injected via the wrapper.
 *
 * Usage in the consumer's `src/mdx-components.tsx`:
 * ```ts
 * import { createUseMDXComponents } from '@sygnal/nextra-docs-engine'
 * import meta from './content/_meta.js'
 *
 * export const useMDXComponents = createUseMDXComponents({ meta })
 * ```
 */
export function createUseMDXComponents(options: CreateUseMDXComponentsOptions) {
  const { meta, Callout = DefaultCallout } = options
  const docsComponents = getDocsMDXComponents()
  const NextraWrapper = docsComponents.wrapper!

  function Wrapper(props: ComponentProps<typeof NextraWrapper>) {
    return (
      <NextraWrapper {...props}>
        <PageBreadcrumb meta={meta} />
        {props.children}
      </NextraWrapper>
    )
  }

  return function useMDXComponents(components: MDXComponents = {}): MDXComponents {
    return {
      ...docsComponents,
      wrapper: Wrapper,
      img: ImageZoom,
      Callout,
      DataTable,
      Embed,
      Video,
      YouTube,
      ...components
    }
  }
}
