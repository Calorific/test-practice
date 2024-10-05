import * as taskSliceModule from 'src/store/taskSlice';
import { render, screen } from '@testing-library/react';
import { TaskList } from 'src/modules/TaskList';
import ue from '@testing-library/user-event';
import { JestStoreProvider } from '../utils/JestStoreProvider';
import { NotifierContainer } from 'src/modules/NotifierContainer';

const userEvent = ue.setup({
  advanceTimers: jest.advanceTimersByTime,
});

describe('Оповещение при вополнении задачи', () => {
  it('появляется и содержит заголовок задачи', async () => {
    const fn = jest.spyOn(taskSliceModule, 'toggleTask');
    jest
      .spyOn(taskSliceModule, 'tasksSelector')
      .mockReturnValue([
        { id: '1', header: 'Task', done: false },
        { id: '2', header: 'Not completed', done: false },
      ] as Task[]);

    render(<TaskList />, {
      wrapper: JestStoreProvider,
    });

    const toggleBtn = screen.getAllByRole('checkbox')[0];
    await userEvent.click(toggleBtn);

    expect(fn).toBeCalledTimes(1);
  });

  it('одновременно может отображаться только одно', async () => {
    jest
      .spyOn(taskSliceModule, 'getNotification')
      .mockReturnValueOnce('Task 1')
      .mockReturnValueOnce('Task 2');

    const { rerender } = render(<NotifierContainer />, {
      wrapper: JestStoreProvider,
    });

    rerender(<NotifierContainer />);

    const text = screen.queryByText('Task 2');
    expect(text).not.toBeInTheDocument();
  });
});