import {Github, Home, User, FileText} from "lucide-react";

export const NAVBAR = {
    main: [
        {
            label: 'Home',
            href: '/',
            icon: <Home />
        },
        {
            label: 'About',
            href: '/about',
            icon: <User />
        },
        {
            label: 'CV',
            href: '/cv',
            icon: <FileText />
        }
    ],
    social: [
        {
            name: 'GitHub',
            href: '/',
            icon: <Github />
        }
    ]
}
