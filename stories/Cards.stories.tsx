import React from 'react';
import { Meta } from '@storybook/react';
import { HeaderCard, Nest } from '../components/Cards';
import Grid from '@mui/material/Grid';

const components = {
  h1: (props) => <h1 style={{ color: "red" }} {...props} />,
  h2: (props) => <h2 style={{ color: "blue" }} {...props} />,
};

export default {
  component: HeaderCard,
  title: 'Components/HeaderCard',
  argTypes: {
    children: {
      control: { type: 'mdx' },
    },
    color: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'error', 'warning', 'info', 'success'],
      },
    },
    sx: {
      control: { type: 'object' },
    },
  },
} as Meta;

const Template: Story = (args) => (
  <HeaderCard {...args}>
    {args.children}
  </HeaderCard>
);

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      # Hello, world!
      This is a simple example of using the `HeaderCard` component with MDX content.
      
      ## Subheading
      
      Here's some more text to demonstrate how the component handles markdown.
      
      - Item 1
      - Item 2
      - Item 3
    </>
  ),
};

