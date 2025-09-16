import {type StoryObj, type Meta } from '@storybook/react'
import TerrainLegacyManager from './terrain-legacy-manager';

const meta = {
  title: 'Three/Components/TerrainLegacy',
  component: TerrainLegacyManager,
} satisfies Meta<typeof TerrainLegacyManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TerrainLegacy: Story = {

};