import React from 'react';
import { HeaderCard, Nest } from '../components/Cards';
import MDXProvider, { mdComponents } from "../components/MDXProvider";

import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { useState, useEffect } from 'react';

import remarkGfm from "remark-gfm";
import remarkUnwrapImages from 'remark-unwrap-images';

export default {
  title: 'Components/HeaderCard',
  component: HeaderCard,
};

const Template = ({ children, ...args }) => {
  const [mdxContent, setMdxContent] = useState(null);


  useEffect(() => {
    const serializeMdx = async () => {

      const MDXoptions = {
        remarkPlugins: [remarkGfm, remarkUnwrapImages],
        format: 'mdx',
        development: true

      };
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