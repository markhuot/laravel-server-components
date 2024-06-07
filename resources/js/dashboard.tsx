import React from 'react';
import {useLaravelAction} from "./utils";
import Layout from "./layout";

export default function Dashboard({tasks}: {tasks: Array<{id: number, title: string}>}) {
    const { action, old, errors, pending } = useLaravelAction('/tasks');

    return (
        <Layout>
            <h1>Hello World!</h1>
            <form action={action}>
                <p>
                    <input name="title" defaultValue={old.title}/>
                    <button type="submit" disabled={pending}>Save</button>
                </p>
                {errors.title && <p>{errors.title}</p>}
            </form>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </Layout>
    );
}
