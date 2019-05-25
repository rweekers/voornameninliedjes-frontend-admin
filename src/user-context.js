import * as React from "react";

export const users = {
    test1: {
        username: 'Testje_#1'
    },
    test2: {
        username: 'Testje_#2'
    },
};

export const UserContext = React.createContext({
    user: users.test1, // default value
    setUser: (newUser) => { console.log(newUser) }
});
