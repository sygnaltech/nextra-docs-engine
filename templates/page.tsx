// Consumer's `src/app/[[...slug]]/page.tsx`.
// The `sourceCode` destructure + prop pass is required for the theme's
// built-in Copy Page / ChatGPT / Claude menu to render.
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('slug')

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params
  const { metadata } = await importPage(params.slug)
  return metadata
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params
  const result = await importPage(params.slug)
  const { default: MDXContent, toc, metadata, sourceCode } = result
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
