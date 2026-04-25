import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SearchBar from '../search-bar';

const meta = {
  title: 'Common/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
} satisfies Meta<typeof SearchBar>;

export default meta;

export const Default: StoryObj = {
  render: () => {
    const [val, setVal] = useState('');
    return <SearchBar value={val} onChange={setVal} placeholder="Search here..." />;
  },
};

export const WithValue: StoryObj = {
  render: () => {
    const [val, setVal] = useState('Acme');
    return <SearchBar value={val} onChange={setVal} placeholder="Search clients..." />;
  },
};

export const AutoFocused: StoryObj = {
  render: () => {
    const [val, setVal] = useState('');
    return <SearchBar value={val} onChange={setVal} placeholder="Type to search..." autoFocus />;
  },
};
