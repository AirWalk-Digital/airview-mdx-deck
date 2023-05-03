import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import { mdComponents } from "../../../components/MDXProvider";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from 'remark-unwrap-images';
import { theme } from '../../../constants/theme';
import fs from 'fs'
import path from 'path'
import Viewer from '../../../components/MdxRenderer'

const glob = require('glob')




function removeSection(pad, tagName) {
  const re = new RegExp("<" + tagName + "\\s+[^>]*>(.*?)</" + tagName + ">", "gs");
  return (pad.replace(re, ""));
}

export async function getStaticPaths() {
  let paths = [];

  const targetDir = path.join(process.cwd(), 'markdown', '/')
  // grab all markdown files
  const docPaths = glob.sync(path.join(targetDir, '**/*.{md,mdx}'))

  docPaths.forEach(element => {
    paths.push({
      params: {
        format: 'pdf',
        file: element.replace(targetDir, ""),
      },
    })
    paths.push({
      params: {
        format: 'ppt',
        file: element.replace(targetDir, ""),
      },
    })
    paths.push({
      params: {
        format: 'mdx',
        file: element.replace(targetDir, ""),
      },
    })
    return paths;
  });
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  let pad = null;
  try {
    const filePath = path.join(process.cwd(), 'markdown', context.params.file)
    const fileData = fs.readFileSync(filePath, "utf8")
    pad = fileData
    if (context.params.format === 'ppt') {
      pad = '<SlidePage>\n' + pad + '\n</SlidePage>'
    } else if (context.params.format === 'pdf') {
      pad = '<PrintSlide>\n' + pad + '\n</PrintSlide>'
    } else {
      pad = removeSection(pad, 'TitleSlide');
      pad = '<MDXViewer>\n' + pad.replace('---', '') + '\n</MDXViewer>'
    }
  } catch (error) {
    console.log(error)
  }
  pad = `Hello, world!
Below is an example of markdown in JSX.

<div style={{padding: '1rem', backgroundColor: 'violet'}}>
  Try and change the background color to \`tomato\`.
</div>`
  return { props: { pad: pad, file: context.params.file, format: context.params.format } }
}

export default function Pad(props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <h1>test</h1>
      {props.pad && <Viewer children={props.pad} />}
    </ThemeProvider>
  )
}