import * as React from "react";

export const user1 = {
    username: 'Testje_#1'
};

export const UserContext = React.createContext({
    user: user1, // default value
    setUser: (newUser) => {
        console.log(newUser);
        user1.username = newUser;
    }
});
