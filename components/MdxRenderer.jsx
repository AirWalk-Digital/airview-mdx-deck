import React, { useState, useMemo, createElement, memo, useEffect, useCallback } from 'react'
import { useDebounceFn } from 'ahooks'
import * as runtime from 'react/jsx-runtime'
import { VFile } from 'vfile'
import { VFileMessage } from 'vfile-message'
// import {statistics} from 'vfile-statistics'
// import {reporter} from 'vfile-reporter'
import { evaluate } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
// import remarkMath from 'remark-math'
import remarkUnwrapImages from 'remark-unwrap-images';
import { ErrorBoundary } from 'react-error-boundary'
import dynamic from 'next/dynamic'



async function useMdx(mdx) {
      const file = new VFile({ basename: 'example.mdx', value: mdx })

      const capture = (name) => () => (tree) => {
        file.data[name] = tree
      }


      const remarkPlugins = [];

      remarkPlugins.push(remarkUnwrapImages)
      remarkPlugins.push(remarkGfm)
      remarkPlugins.push(remarkFrontmatter)
      // if (config.math) remarkPlugins.push(remarkMath)
      // remarkPlugins.push(capture('mdast'))
      try {
        file.result = (
          await evaluate(file, {
            ...runtime,
            useDynamicImport: true,
            remarkPlugins,
            // rehypePlugins: [capture('hast')],
            // recmaPlugins: [capture('esast')]
          })
        ).default
      } catch (error) {
        console.log('useMdx:Error: ', error)
        const message =
          error instanceof VFileMessage ? error : new VFileMessage(error)

        if (!file.messages.includes(message)) {
          file.messages.push(message)
        }

        message.fatal = true
      }
  return (file)
}


function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  )
}

function FallbackComponent({ error }) {
  const message = new VFileMessage(error)
  message.fatal = true
  return (
    <pre>
      <code>{String(message)}</code>
    </pre>
  )
}
export default dynamic(() => Promise.resolve(Viewer), {
  ssr: false,
});

function Viewer({ children }) {
  // console.log('Viewer:children: ', children)
  const [mdx, setMdx] = useState(null);

  // const [state, setConfig] = useMdx({
  //   gfm: true,
  //   unwrapimages: true,
  //   frontmatter: true,
  //   math: false,
  //   value: children
  // })

  useEffect(() => {
    const file = useMdx(children);
    console.log('Viewer:useEffect')

    if (file) {setMdx(file.result)};
  });

  // console.log('Viewer:mdx: ', mdx)

  // const onUpdate = useCallback(
  //   (v) => {
  //     if (v.docChanged) {
  //       setConfig({...state, value: String(v.state.doc)})
  //     }
  //   },
  //   [state, setConfig]
  // )
  // const stats = state.file ? statistics(state.file) : {}

  // Create a preview component that can handle errors with try-catch block; for catching invalid JS expressions errors that ErrorBoundary cannot catch.
  const Preview = useCallback(() => {
    try {
      return state.file.result()
    } catch (error) {
      return <FallbackComponent error={error} />
    }
  }, [state])

  return (
    <div>
      <noscript>Enable JavaScript for the rendered result.</noscript>
      <div className="frame-body frame-body-box-fixed-height frame-body-box">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {mdx ? <Preview /> : null}
        </ErrorBoundary>
      </div></div>

  )
}