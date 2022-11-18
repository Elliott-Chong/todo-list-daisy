import React from "react";
import produce from "immer";
import { XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function App() {
  const schoolRef = React.useRef();
  const [theme, setTheme] = React.useState("");
  const [tasks, setTasks] = React.useState({ primary: [] });
  const [isEditing, setIsEditing] = React.useState(false);
  const [editInfo, setEditInfo] = React.useState({ id: null, category: null });

  const handleRemove = (id, category) => {
    setTasks(
      produce(tasks, (draft) => {
        draft[category] = draft[category].filter((task) => task.id !== id);
        return draft;
      })
    );
  };

  const changeTheme = () => {
    const themes = [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
    ];
    let theme = themes[Math.floor(Math.random() * themes.length)];
    setTheme(theme);
  };

  React.useEffect(() => {
    document.querySelector("html").dataset.theme = theme;
    if (theme !== "") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (schoolRef.current.value === "") return;
    if (isEditing) {
      setTasks(
        produce(tasks, (draft) => {
          for (let task of draft[editInfo.category]) {
            if (task.id === editInfo.id) {
              task.task = schoolRef.current.value;
              break;
            }
          }
          return draft;
        })
      );
      setIsEditing(false);
      setEditInfo({ id: null, category: null });
      return;
    }
    let task = schoolRef.current.value;
    let category = task.split(" ")[0];
    if (category.includes("#")) {
      category = category.replace("#", "");
      task = task.split(" ").slice(1).join(" ");
    } else category = "primary";

    setTasks(
      produce(tasks, (draft) => {
        if (draft.hasOwnProperty(category)) {
          draft[category].push({ task, id: uuid() });
        } else {
          draft[category] = [{ task, id: uuid() }];
        }

        return draft;
      })
    );
  };
  React.useEffect(() => {
    window.tasks = tasks;
    if (Object.entries(tasks).length !== 1)
      localStorage.setItem("tasks", JSON.stringify(tasks));
    schoolRef.current.value = "";
  }, [tasks]);

  React.useEffect(() => {
    let school_tasks = localStorage.getItem("tasks");
    let theme = localStorage.getItem("theme");
    if (school_tasks) {
      setTasks(JSON.parse(school_tasks));
    }
    if (theme) {
      setTheme(theme);
    }
  }, []);

  return (
    <>
      <main className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-10">
          <form onSubmit={handleSubmit} className="mx-auto">
            <input
              ref={schoolRef}
              type="text"
              placeholder="Type here..."
              className="input input-bordered w-48 md:w-[300px]"
            />
          </form>
          <div className="grid grid-cols-2 gap-8">
            {Object.entries(tasks).map(([category, tasks]) => {
              return (
                tasks.length > 0 && (
                  <>
                    <div
                      key={category}
                      className="flex items-center gap-4 flex-col"
                    >
                      <h1>{category}</h1>
                      <ul
                        key={category}
                        className="menu bg-base-100 max-w-lg ring-2 ring-primary/30 w-full rounded-box"
                      >
                        {tasks.map((task) => {
                          return (
                            <li
                              key={task.id}
                              className="overflow-scroll w-full"
                            >
                              <div className="flex group">
                                <span className="overflow-hidden">
                                  <div className="flex gap-1">
                                    <XMarkIcon
                                      onClick={() =>
                                        handleRemove(task.id, category)
                                      }
                                      className="h-6 w-6 hover:bg-red-500 hover:text-white rounded-md p-1 group-hover:translate-x-0 -translate-x-10 transition"
                                    />
                                    <PencilIcon
                                      onClick={() => {
                                        schoolRef.current.focus();
                                        setEditInfo(
                                          produce(editInfo, (draft) => {
                                            draft.id = task.id;
                                            draft.category = category;
                                            return draft;
                                          })
                                        );
                                        setIsEditing(true);
                                        schoolRef.current.value = task.task;
                                      }}
                                      className="h-6 w-6 hover:bg-orange-400 hover:text-white rounded-md p-1 group-hover:translate-x-0 -translate-x-14 transition"
                                    />
                                  </div>
                                </span>
                                <span className="-translate-x-16 group-hover:translate-x-0 transition">
                                  {task.task}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )
              );
            })}
          </div>
        </div>
      </main>
      <div className="absolute bottom-4 right-4 flex gap-2 items-center flex-col">
        <button className="btn" onClick={changeTheme}>
          Theme: {theme}
        </button>
        <p>
          <a
            target="_blank"
            rel="noreferrer"
            className="underline"
            href="https://github.com/elliott-chong/todo-list-daisy"
          >
            Elliott Chong
          </a>
        </p>
      </div>
    </>
  );
}

export default App;
