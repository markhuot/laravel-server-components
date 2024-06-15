import React, {createContext, useContext, useRef, useState} from 'react';
import {ControllerDataContext, useControllerData, useLaravelAction} from "./utils";
import Layout from "./layout";
import {flushSync} from "react-dom";
import classnames from 'classnames';

export default function Dashboard() {
    const { tasks } = useControllerData();
    const { action, before, old, errors, pending } = useLaravelAction('/tasks');
    before(({ title }, state) => {
        state.tasks.push({id:`pending${title}`, title, pending: true});
    });
    const initialFocusRef = useRef();

    return (
        <Layout>
            <div className="overflow-hidden max-h-full w-80 border-slate-400 rounded-xl shadow-sm shadow-slate-400 bg-slate-100 ">
                <ul className="space-y-4 px-2">
                    {tasks.map(task => (
                        <Task key={task.id} task={task}/>
                    ))}
                </ul>
                <AddTask initialFocusRef={initialFocusRef}>
                    <form action={action} className="px-2 py-2">
                        <div>
                            <input name="title"
                                   defaultValue={old.title}
                                   ref={initialFocusRef}
                                   required
                                   placeholder="Card title..."
                                   className="bg-white shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 relative"
                            />
                            {errors.title && <p>{errors.title}</p>}
                        </div>
                        <p className="flex justify-between">
                            <button type="submit" disabled={pending} className="bg-blue-400">Save</button>
                            <AddTask.Cancel/>
                        </p>
                    </form>
                </AddTask>
            </div>
        </Layout>
    );
}

function Task({task}) {
    const {action, pending: actionIsPending, before} = useLaravelAction(`/tasks/${task.id}`, 'delete');
    // before((_, state) => {
    //     state.tasks = state.tasks.filter(t => t.id != task.id);
    // });

    return (
        <li className={classnames({
            "bg-white shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 relative": true,
            "opacity-50": actionIsPending || task.pending,
        })}>
            <a href={`/tasks/${task.id}`} className="text-blue-500 underline hover:no-underline">{task.title}</a> ({task.created_at})
            {! task.pending && (
                <form action={action}>
                    {task.id && <button disabled={actionIsPending}>delete</button>}
                </form>
            )}
        </li>
    );
}

const AddTaskContext = createContext({});
function AddTask({initialFocusRef, children}) {
    const [showAdd, setShowAdd] = useState(false);
    const addButtonRef = useRef<HTMLButtonElement>();

    return (
        <AddTaskContext.Provider value={{
            cancel: () => {
                flushSync(() => {
                    setShowAdd(false);
                });
                addButtonRef.current?.focus();
            },
        }}>
            <div>
                {! showAdd && (
                    <button ref={addButtonRef} onClick={() => {
                        flushSync(() => {
                            setShowAdd(true);
                        });
                        initialFocusRef.current?.focus();
                    }}
                            type="button"
                            className="flex items-center gap-2 rounded-lg text-left w-full p-2 font-medium text-slate-500 hover:bg-slate-200 focus:bg-slate-200">
                        + Add a card
                    </button>
                )}
            </div>
            {showAdd && children}
        </AddTaskContext.Provider>
    )
}

AddTask.Cancel = function () {
    const { cancel } = useContext(AddTaskContext);

    return (
        <button onClick={cancel} type="button" className="bg-red-400">Cancel</button>
    );
}
