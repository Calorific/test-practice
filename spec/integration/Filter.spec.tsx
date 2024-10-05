import { render, screen } from '@testing-library/react';
import { JestStoreProvider } from '../utils/JestStoreProvider';
import { TaskList } from 'src/modules/TaskList';
import * as taskSliceModule from 'src/store/taskSlice';
import ue from '@testing-library/user-event';

const userEvent = ue.setup({
  advanceTimers: jest.advanceTimersByTime,
});

describe('Список задач', () => {
  // не содержит выполненные задачи
  it('Фильтр по невыполненным', async () => {
    jest
      .spyOn(taskSliceModule, 'tasksSelector')
      .mockReturnValue([
        { id: '1', header: 'Completed task', done: true },
        { id: '2', header: 'Not completed', done: false },
        { id: '3', header: 'Done', done: true },
      ] as Task[]);

    render(<TaskList />, {
      wrapper: JestStoreProvider,
    });

    const selectElement = screen.getByRole('combobox');
    const btnElement = screen.getByRole('submit');

    await userEvent.selectOptions(selectElement, 'notDone');
    await userEvent.click(btnElement);

    screen.debug();

    expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
    expect(screen.queryByText('Not completed')).toBeInTheDocument();
    expect(screen.queryByText('Done')).not.toBeInTheDocument();
  });

  // как выполненные, так и не выполненные задачи
  it('Отключенный фильтр', async () => {
    jest
      .spyOn(taskSliceModule, 'tasksSelector')
      .mockReturnValue(
        [
          { id: '1', header: 'Completed task', done: true },
          { id: '2', header: 'Not completed', done: false },
          { id: '3', header: 'Done', done: true },
        ] as Task[]
      );

    render(<TaskList />, {
      wrapper: JestStoreProvider,
    });

    const selectElement = screen.getByRole('combobox');
    const btnElement = screen.getByRole('submit');

    await userEvent.selectOptions(selectElement, "all");
    await userEvent.click(btnElement);

    screen.debug();

    expect(screen.queryByText('Completed task')).toBeInTheDocument();
    expect(screen.queryByText('Not completed')).toBeInTheDocument();
    expect(screen.queryByText('Done')).toBeInTheDocument();
  });

  it('Фильтр по выполненным', async () => {
    jest
      .spyOn(taskSliceModule, 'tasksSelector')
      .mockReturnValue(
        [
          { id: '1', header: 'Completed task', done: true },
          { id: '2', header: 'Not completed', done: false },
          { id: '3', header: 'Done', done: true },
        ] as Task[]
      );

    render(<TaskList />, {
      wrapper: JestStoreProvider,
    });

    const selectElement = screen.getByRole('combobox');
    const btnElement = screen.getByRole('submit');

    await userEvent.selectOptions(selectElement, "done");
    await userEvent.click(btnElement);

    screen.debug();

    expect(screen.queryByText('Completed task')).toBeInTheDocument();
    expect(screen.queryByText('Not completed')).not.toBeInTheDocument();
    expect(screen.queryByText('Done')).toBeInTheDocument();
  });
});
