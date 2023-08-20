import React from 'react';
import {get, post} from "../../utils/requests";

export const authUser = async ({name, password}) => {
    return await post({name, password}, 'auth', (data) => {
        if (data.ok) {
            return data.data
        }
        return null;
    }, null)
}

export const refreshToken = async (token) => {
    return await post({}, 'refresh', (data) => {
        return data.data?.token ?? null;
    }, null, token)
}