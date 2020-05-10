import * as React from "react";
import { useFlip, FlipProvider, AnimateInOut } from "react-easy-flip";

export { FlipProvider };

const TrashCan = () => (
  <svg
    className="w-5"
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="white"
  >
    <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" />
  </svg>
);

const ids = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

const todos = [
  "Wash dishes",
  "Feed the cat",
  "Read a book",
  "Do laundry",
  "Learn Russian",
  "Cook pasta",
  "Buy coffee beans",
  "Do a quick workout",
  "Fix some bugs",
  "Buy fresh bread",
];

const _items2 = Array(10)
  .fill(0)
  .map((_, i) => {
    const id = ids[i];
    return {
      id: id,
      done: i === 0,
      nid: i + 1,
      text: todos[i],
    };
  });

const RemoveButton = ({ onClick }) => (
  <button
    className="hover:bg-red-600 hover:border-transparent w-9 h-9 p-2 ml-2 cursor-pointer border-dotted border-2 border-pink-400 rounded-full"
    onClick={onClick}
  >
    <TrashCan />
  </button>
);

const Checkbox = ({ onChange, item }) => {
  const { id, done, text } = item;
  return (
    <label
      className="flex items-center flex-grow p-4 rounded-lg cursor-pointer"
      htmlFor={id}
    >
      {text}
      <input
        className="absolute right-0 mr-2"
        type="checkbox"
        id={id}
        checked={done}
        onChange={() => onChange(item, id)}
      />
    </label>
  );
};

const Li = React.forwardRef<any, any>(
  ({ onChange, removeFromItems, item }, ref) => {
    const doneStyle = { backgroundColor: "#5209d5" };
    return (
      <li
        key={item.id}
        data-flip-id={`flip-id-${item.id}`}
        className="w-64 text-white relative flex items-center mb-2 rounded-lg text-lg select-none bg-gray-700"
        ref={ref}
        style={item.done ? doneStyle : {}}
      >
        <RemoveButton onClick={() => removeFromItems(item.id)} />
        <Checkbox onChange={onChange} item={item} />
      </li>
    );
  }
);

function TodoApp() {
  const [todoItems, setTodoItems] = React.useState(_items2);
  const [t, setT] = React.useState("");

  const todoItemsId = "flip-todo-items";

  useFlip(todoItemsId, { duration: 700 }, todoItems.length);

  const removeFromItems = (id) =>
    setTodoItems(todoItems.filter((i) => i.id !== id));

  const changeToDone = (item, id) =>
    setTodoItems(
      [...todoItems.filter((i) => i.id !== id), { ...item, done: true }].sort(
        (a, b) => a.nid - b.nid
      )
    );

  const undo = (item, id) =>
    setTodoItems(
      [...todoItems.filter((i) => i.id !== id), { ...item, done: false }].sort(
        (a, b) => a.nid - b.nid
      )
    );

  return (
    <>
      <input
        value={t}
        type="text"
        onChange={(e) => setT(e.target.value)}
      ></input>
      <button
        onClick={() =>
          setTodoItems([
            ...todoItems,
            {
              id: "k",
              done: false,
              nid: todoItems.length + 1,
              text: t,
            },
          ])
        }
      >
        add
      </button>
      <div className="flex justify-center">
        <div className="p-4">
          <h2 className="text-center">TODO</h2>
          <ul data-flip-root-id={todoItemsId} className="flex flex-col p-0">
            <AnimateInOut itemAmount={todoItems.length}>
              {todoItems
                .filter((i) => !i.done)
                .map((item) => (
                  <Li
                    key={item.id}
                    item={item}
                    data-flip-id={`flip-id-${item.id}`}
                    onChange={changeToDone}
                    removeFromItems={removeFromItems}
                  />
                ))}
            </AnimateInOut>
          </ul>
        </div>

        <div className="p-4">
          <h2 className="text-center">DONE</h2>
          <ul data-flip-root-id={todoItemsId} className="flex flex-col p-0">
            <AnimateInOut itemAmount={todoItems.length}>
              {todoItems
                .filter((i) => i.done)
                .map((item) => (
                  <Li
                    item={item}
                    key={item.id}
                    data-flip-id={`flip-id-${item.id}`}
                    removeFromItems={removeFromItems}
                    onChange={undo}
                  ></Li>
                ))}
            </AnimateInOut>
          </ul>
        </div>
      </div>
    </>
  );
}

export default TodoApp;
