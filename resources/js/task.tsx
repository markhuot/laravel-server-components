import React from 'react';
import {useControllerData} from "./utils";
import Layout from "./layout";

export default function Task() {
    const { task } = useControllerData();

    return (
        <Layout>
            <a href="/">&larr; back</a>
            <h1>{task.title}</h1>
        </Layout>
    )
}
