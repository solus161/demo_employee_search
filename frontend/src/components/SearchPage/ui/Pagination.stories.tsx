import type { Meta, StoryObj } from '@storybook/react'
import { PageList } from './Pagination'
import { useState } from 'react'

const metaPageList: Meta<typeof PageList> = {
  title: 'Search/PageList',
  component: PageList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export default metaPageList

type Story = StoryObj<typeof metaPageList>

export const Default: Story = {
  render: () => {
    const totalPage = 10
    const [currentPage, setCurrentPage] = useState(5)
    
    return (
      <PageList 
        totalPage={totalPage} 
        currentPage={currentPage}
        onClickPrevious={() => {setCurrentPage(currentPage - 1)}}
        onClickNext={() => {setCurrentPage(currentPage + 1)}}
        onClickPage={setCurrentPage}/>
    )}}
