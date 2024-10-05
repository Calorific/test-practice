import { useDispatch, useSelector } from 'react-redux';
import { Empty } from 'src/components/Empty';
import { List } from 'src/components/List';
import { deleteTask, tasksSelector, toggleTask } from 'src/store/taskSlice';
import { FormEvent, useState } from 'react';

export const TaskList = () => {
  const items = useSelector(tasksSelector);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<'all' | 'done' | 'notDone'>('all');

  const handleDelete = (id: Task['id']) => {
    dispatch(deleteTask(id));
  };

  const handleToggle = (id: Task['id']) => {
    dispatch(toggleTask(id));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filterValue = new FormData(e.target as HTMLFormElement).entries().next().value[1];
    setFilter(filterValue);
  }

  const filteredItems = items.filter(item => {
    if (filter === 'all') {
      return true;
    }

    if (filter === 'done') {
      return item.done;
    }

    return !item.done;
  })

  if (!filteredItems.length) {
    return <Empty />
  }

  return (
    <>
      <div style={{ width: '100%' }}>
        <form onSubmit={onSubmit} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <select name="filter" id="filter">
            <option value="all">
              Все задачи
            </option>
            <option value="done">
              Выполненные
            </option>
            <option value="notDone">
              Незавершенные
            </option>
          </select>

          <button type="submit" role="submit">
            Подтвердить
          </button>
        </form>

      </div>

      <List items={filteredItems} onDelete={handleDelete} onToggle={handleToggle} />
    </>
  )
};
