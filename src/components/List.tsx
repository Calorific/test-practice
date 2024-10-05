import { Item } from './Item';

type Props = {
  items: Task[];
  onDelete: (id: Task['id']) => void;
  onToggle: (id: Task['id']) => void;
};

export const List = ({ items, onDelete, onToggle }: Props) => {
  if (items.filter(item => !item.done).length > 10) {
    return <p>В списке не должно быть больше 10 невыполненных задач</p>
  }

  return (
    <ul className="task-list tasks">
      {items.map((item) => (
        <Item
          {...item}
          key={item.id}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
};
