import React, {useEffect, useState} from 'react';

import {useNavigate} from "@tanstack/react-router";

// Constants
import {AUTH_KEY} from "@/constants";

const PrivateRoute = ({
                          children,
                      }: {
    children: React.ReactNode
}) => {

    const navigate = useNavigate();

    const [auth, setAuth] = useState({});


    useEffect(() => {
        const stringData = localStorage.getItem(AUTH_KEY);

        const parsedData = JSON.stringify(stringData);

        if (parsedData?.email) {
            setAuth(parsedData)

            return;
        }


        navigate({
            to: "/",
            replace: true,
        })
    }, [auth]);


    return (
        <div>
            {children}
        </div>
    );
};

export default PrivateRoute;