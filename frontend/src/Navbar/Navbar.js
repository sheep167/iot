import { React } from "react";
import { PrivateNavbar } from "./PrivateNavbar";
import { PublicNavbar } from "./PublicNavbar";
import { useAuth } from "../useAuth"
import './Navbar.css'

export const Navbar = () => {
    const isAuth = useAuth();
    return (
        <>
            {isAuth ? <PrivateNavbar/> : <PublicNavbar/>}
        </>
    )
}
