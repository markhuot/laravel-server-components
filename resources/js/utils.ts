import React, {useTransition, useState, MutableRefObject} from 'react';
import axios from 'axios';

export function useLaravelAction(uri: string) {
    const callbacks = [];
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, any>>({});
    const [old, setOld] = useState<Record<string, any>>({});

    const action = (formData: FormData) => {
        var object = {};
        formData.forEach((value, key) => object[key] = value);
        setOld(object);

        startTransition(async () => {
            try {
                const response = await axios.post(uri, object);

                setErrors({});
                setOld({});
                callbacks.forEach(callback => callback(response.data.result));
            }
            catch (error) {
                if (error.response && error.response.data) {
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
        after: function responseHandler(callback) {
            callbacks.push(callback);
        },
        old,
        errors,
    };
}
