import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import { VFile } from "vfile";
import { VFileMessage } from "vfile-message";
import * as provider from "@mdx-js/react";
import * as runtime from "react/jsx-runtime";
// import {statistics} from 'vfile-statistics'
// import {reporter} from 'vfile-reporter'
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkUnwrapImages from "remark-unwrap-images";

// import remarkMath from 'remark-math'
import { ErrorBoundary } from "react-error-boundary";
import { useDebounceFn } from "ahooks";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { theme } from "../../constants/theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { mdComponents } from "../../components/MDXProvider";

import { Previewer } from "pagedjs";

function removeSection(pad, tagName) {
  const re = new RegExp(
    "<" + tagName + "\\s+[^>]*>(.*?)</" + tagName + ">",
    "gs"
  );
  return pad.replace(re, "");
}

function useMdx(defaults) {
  const [state, setState] = useState({ ...defaults, file: null });
  const { run: setConfig } = useDebounceFn(
    async (config) => {
      const file = new VFile({ basename: "example.mdx", value: config.value });

      const capture = (name) => () => (tree) => {
        file.data[name] = tree;
      };

      const remarkPlugins = [];

      if (config.gfm) remarkPlugins.push(remarkGfm);
      if (config.frontmatter) remarkPlugins.push(remarkFrontmatter);
      if (config.unwrapImages) remarkPlugins.push(remarkUnwrapImages);
      // remarkPlugins.push(capture('mdast'))

      try {
        file.result = (
          await evaluate(file, {
            ...provider,
            ...runtime,
            useDynamicImport: true,
            remarkPlugins,
            // useMDXComponents: true,
            // rehypePlugins: [capture('hast')],
            // recmaPlugins: [capture('esast')],
          })
        ).default;
      } catch (error) {
        console.log("output:evalutate:Error: ", error);
        const message =
          error instanceof VFileMessage ? error : new VFileMessage(error);

        if (!file.messages.includes(message)) {
          file.messages.push(message);
        }

        message.fatal = true;
      }
      console.log("output:evalutate:Success: ", file);
      setState({ ...config, file });
    },
    { leading: true, trailing: true, wait: 500 }
  );

  return [state, setConfig];
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
  );
}

function FallbackComponent({ error }) {
  const message = new VFileMessage(error);
  message.fatal = true;
  return (
    <pre>
      <code>{String(message)}</code>
    </pre>
  );
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: true,
});

const fetchFileContent = async (fileType, fileName) => {
  return await fetch(
    `http://localhost:3000/api/files/file?fileType=${fileType}&fileName=${fileName}`
  ).then((res) => res.json());
};

export async function getServerSideProps(context) {
  const { query } = context;
  const { parms, format: formatFile } = query; //formatFile = pdf / ppt

  // file test.mdx
  const sourceFile = parms[0]; //get value 'file'
  const fileType = parms[1]; // get type file 'markdown'
  const mdxFileName = parms[2]; // name file 'test.mdx'

  if (sourceFile === "file") {
    try {
      const resultFileContent = await fetchFileContent(fileType, mdxFileName);
      return {
        props: {
          content: resultFileContent.content,
          format: formatFile,
        }, // will be passed to the page component as props
      };
    } catch (error) {
      console.error(error);
    }
  }
  return {
    props: {
      content: "hai",
    }, // will be passed to the page component as props
  };
}

export function Page({ content, format }) {
  const defaultValue = `# No Content Loaded`;
  const [state, setConfig] = useMdx({
    gfm: true,
    frontmatter: true,
    math: false,
    unwrapImages: true,
    value: defaultValue,
  });

  const mdxContent = (formatFile, mdx) => {
    if (formatFile === "ppt") {
      mdx = "<SlidePage>\n" + mdx + "\n</SlidePage>";
    } else if (formatFile === "pdf") {
      mdx = "<div>" + mdx.replace(/---/g, "") + "</div>";
    } else if (formatFile === "print") {
      mdx = "<PrintSlide>\n" + mdx + "\n</PrintSlide>";
    } else {
      mdx = removeSection(mdx, "TitleSlide");
      mdx = "<MDXViewer>\n" + mdx.replace(/---/g, "") + "\n</MDXViewer>";
    }
    return mdx;
  };

  useEffect(() => {
    setConfig({ ...state, value: String(mdxContent(format, content)) });
  }, [format]);

  const Preview = useCallback(() => {
    try {
      return state.file.result();
    } catch (error) {
      return <FallbackComponent error={error} />;
    }
  }, [state]);

  if (format === "pdf") {
    return (
      <>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {state.file && state.file.result ? (
            <PrintView>
              <Preview components={mdComponents} />
            </PrintView>
          ) : null}
        </ErrorBoundary>
      </>
    );
  } else {
    if (state.file && state.file.result) {
      console.log("output:state.file.result: ", state.file.result);
    }
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {state.file && state.file.result ? (
          <DefaultView>
            <Preview components={mdComponents} />
          </DefaultView>
        ) : null}
      </ErrorBoundary>
    );
  }
}

// PDF Print View component
function PrintView({ children }) {
  const mdxContainer = useRef(null);
  const previewContainer = useRef(null);

  let contentMdx = ``;
  useEffect(() => {
    if (mdxContainer.current !== null && previewContainer.current !== null) {
      const paged = new Previewer();
      contentMdx = `${mdxContainer.current?.innerHTML}`;
      paged
        .preview(contentMdx, ["/pdf.css"], previewContainer.current)
        .then((flow) => {
          console.log("====flow====");
          console.log(flow);
        });
      return () => {
        document.head
          .querySelectorAll("[data-pagedjs-inserted-styles]")
          .forEach((e) => e.parentNode?.removeChild(e));
      };
    }
  }, []);

  return (
    <>
      <div ref={mdxContainer} style={{ display: "none" }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children && children}
        </ThemeProvider>
      </div>
      <div className="pagedjs_page" ref={previewContainer}></div>
    </>
  );
}
// Normal View component
function DefaultView({ children }) {
  console.log("DefaultView:children: ", children);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <MDXProvider components={mdComponents}> */}
      <h1>test</h1>
      {children && children}
      {/* </MDXProvider> */}
    </ThemeProvider>
  );
}
