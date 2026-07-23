import type { Meta, StoryObj } from '@storybook/react';
import VolvoCatalogue from './volvo-catalogue';

const meta = {
  title: 'Html/Experiences/Volvo2020',
  component: VolvoCatalogue,
} satisfies Meta<typeof VolvoCatalogue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Volvo2020: Story = {};

Volvo2020.parameters = {
  layout: 'fullscreen',
  options: { showPanel: false },
  backgrounds: { disable: true },
};
