import React, {useTransition, useState, MutableRefObject, useContext, useEffect, createElement} from 'react';
import axios from 'axios';
import {useSnapshot} from "valtio/react";
import {subscribe} from "valtio";

export const ControllerDataContext = React.createContext<Record<string, any>>();

export function useControllerData(selector=undefined): Record<string, any> {
    const { props } = useContext(ControllerDataContext);
    const snap = useSnapshot(props);

    return snap;
}

export function useLaravelAction(url: string, method: string='post') {
    const beforeCallbacks = [];
    const afterCallbacks = [];
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, any>>({});
    const [old, setOld] = useState<Record<string, any>>({});
    const {props, refresh} = useContext(ControllerDataContext);

    const action = (formData: FormData, placeholders=[]) => {
        var formDataJson = {};
        formData.forEach((value, key) => formDataJson[key] = value);
        setOld(formDataJson);

        startTransition(async () => {
            try {
                beforeCallbacks.forEach(callback => callback(formDataJson, props));
                const response = await axios.request({
                    method,
                    url,
                    params: formDataJson,
                    headers: {
                        'X-CSRF-TOKEN': window.CSRF_TOKEN
                    }
                });

                setErrors({});
                setOld({});
                afterCallbacks.forEach(callback => callback(response.data.result));
                refresh();
            }
            catch (error) {
                if (error?.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                }
                else {
                    throw error;
                }
            }

        })
    };

    return {
        pending: isPending,
        action,
        before: function optimisticHandler(callback) {
            beforeCallbacks.push(callback);
        },
        after: function responseHandler(callback) {
            afterCallbacks.push(callback);
        },
        old,
        errors,
    };
}
