import { render, screen } from '@testing-library/react';
import { Item } from 'src/components/Item';
import { headerFieldOptions } from 'src/utils/helpers';
import ue from '@testing-library/user-event';

const userEvent = ue.setup({
  advanceTimers: jest.advanceTimersByTime,
});

describe('Элемент списка задач', () => {
  it('название не должно быть больше 32 символов', () => {
    const onDelete = jest.fn();
    const onToggle = jest.fn();

    render(<Item header={new Array(33).fill('1').join('')} id="1" done onDelete={onDelete} onToggle={onToggle} />);

    const error = screen.getByText(headerFieldOptions.message);
    expect(error).toBeInTheDocument();
  });

  it('название не должно быть пустым', () => {
    const onDelete = jest.fn();
    const onToggle = jest.fn();

    render(<Item header="" id="1" done onDelete={onDelete} onToggle={onToggle} />);

    const error = screen.getByText(headerFieldOptions.minLength);
    expect(error).toBeInTheDocument();
  });

  it('нельзя удалять невыполненные задачи', () => {
    const onDelete = jest.fn();
    const onToggle = jest.fn();

    render(<Item header="valid" id="1" done={false} onDelete={onDelete} onToggle={onToggle} />);

    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('выполненную задачу можно удалить', () => {
    const onDelete = jest.fn();
    const onToggle = jest.fn();

    render(<Item header="valid" id="1" done={true} onDelete={onDelete} onToggle={onToggle} />);

    const btn = screen.getByRole('button');
    expect(btn).not.toBeDisabled();
  });

  it('на каждый клик должен вызываться onToggle', async () => {
    const onDelete = jest.fn();
    const onToggle = jest.fn();

    render(<Item header="valid" id="1" done={true} onDelete={onDelete} onToggle={onToggle} />);

    const btn = screen.getByRole('checkbox');
    await userEvent.click(btn);
    await userEvent.click(btn);
    await userEvent.click(btn);

    expect(onToggle).toBeCalledTimes(3);
  });
});