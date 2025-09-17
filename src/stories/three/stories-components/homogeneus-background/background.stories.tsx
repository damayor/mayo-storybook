import type { Meta, StoryObj } from "@storybook/react";
import type FiberCanvas from "../../FiberCanvas";
import Background from "./background";


const meta = {
  title: 'Three/Components/Background',
  component: Background,

  argTypes: {
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof Background>;


export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    args: {
        backgroundColor: '#f0fff0'
    }
};
