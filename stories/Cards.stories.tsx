import React from 'react';
// import { MDXProvider } from '@mdx-js/react';
import { HeaderCard, Nest } from '../components/Cards';
import MDXProvider, { mdComponents } from "../components/MDXProvider";

import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { useState, useEffect } from 'react';


// import { mdx } from '@mdx-js/mdx';

// import * as runtime from "react/jsx-runtime";
// import { evaluateSync } from "@mdx-js/mdx";

// import * as provider from "@mdx-js/react";
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from 'remark-unwrap-images';

export default {
  title: 'Components/HeaderCard',
  component: HeaderCard,
};

// const components = {
//   h1: (props) => <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }} {...props} />,
//   h2: (props) => <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }} {...props} />,
//   p: (props) => <p style={{ fontSize: '1rem', lineHeight: '1.5' }} {...props} />,
//   // add any other components that you want to use in your MDX here
// };


const Template = ({ children, ...args }) => {
  const [mdxContent, setMdxContent] = useState(null);


  useEffect(() => {
    console.log('Serialize function called');

    const serializeMdx = async () => {

      const MDXoptions = {
        remarkPlugins: [remarkGfm, remarkUnwrapImages],
        format: 'mdx',
        development: true

      };
      const mdxContent2 = `
      # Header 1
      ## Header 2
      Some more text here
      `;
      try {
        const mdxSource = await serialize(children, { scope: {}, mdxOptions: { ...MDXoptions }, parseFrontmatter: true })
        setMdxContent(mdxSource);

      } catch (error) {
        console.log('Error in serialize : ', error);
      }
    };
    serializeMdx();
  }, [children]);



  if (!mdxContent) {
    return <MDXProvider ><h1>....loading</h1></MDXProvider>;
  } else {
    
    // return <MDXProvider ><HeaderCard {...args}><MDXRemote {...mdxContent} components={mdComponents} /></HeaderCard></MDXProvider>;
    return <MDXProvider><MDXRemote compiledSource={mdxContent.compiledSource} components={mdComponents}/></MDXProvider>;
    // return  <MDXProvider><h1>test</h1></MDXProvider>
  }
};


export const Default = Template.bind({});
Default.args = {
  children: (
    `
      # Header 1
      ## Header 2
      Some more text here
    `
  ),
  color: 'secondary',
};
Default.parameters = {
  docs: {
    source: {
      code: "Disabled for this story, see https://github.com/storybookjs/storybook/issues/11554"
    }
  }
}