import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function App() {
  const schoolRef = React.useRef();
  const [schoolTasks, setSchoolTasks] = React.useState([]);
  const handleRemove = (t) => {
    setSchoolTasks(schoolTasks.filter((task) => task !== t));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (schoolRef.current.value === "") return;
    setSchoolTasks((d) => [schoolRef.current.value, ...d]);
  };
  React.useEffect(() => {
    schoolRef.current.value = "";
    if (schoolTasks.length !== 0) {
      localStorage.setItem("school tasks", JSON.stringify(schoolTasks));
    }
  }, [schoolTasks]);

  React.useEffect(() => {
    setSchoolTasks(JSON.parse(localStorage.getItem("school tasks")));
  }, []);

  return (
    <>
      <main className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSubmit}>
            <label className="label">
              {/* <span className="label-text">School</span> */}
            </label>
            <input
              ref={schoolRef}
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full max-w-xs"
            />
          </form>
          {schoolTasks.length > 0 && (
            <ul className="menu bg-base-100 ring-2 ring-primary/30 w-56 rounded-box">
              {schoolTasks.map((task) => {
                return (
                  <li className="overflow-hidden">
                    <span className="group overflow-hidden">
                      <XMarkIcon
                        onClick={() => handleRemove(task)}
                        className="h-6 w-6 hover:bg-red-500 hover:text-white rounded-md p-1 group-hover:translate-x-0 -translate-x-10 transition"
                      />
                      <span className="-translate-x-8 group-hover:translate-x-0 transition">
                        {task}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
      <p className="absolute bottom-4 right-4">
        Source code:{" "}
        <a
          className="underline"
          href="https://github.com/elliott-chong/todo-list-daisy"
        >
          Elliott Chong
        </a>
      </p>
    </>
  );
}

export default App;
