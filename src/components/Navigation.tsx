import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useContext } from 'react';
import { AuthProvider } from '../contexts/UserContext';
import { Link } from "react-router-dom";
import Mybreadcrumbs from './Mybreadcrumbs';
import { getPages } from '../routes/navigation';


type NavigationProps = {
    onSignOut: () => void;
    onNewTaskHandler: () => void;
};

const Navigation: React.FC<NavigationProps> = ({ onSignOut, onNewTaskHandler }) => {
    const [currentPage, setCurrentPage] = useState('home');
    const [pages, setPages] = useState<{ text: string, link: string }[]>([])
    const context = useContext(AuthProvider)

    useEffect(() => {
        setPages(getPages(context?.admin));
    }, [context])

    const settings = [{ text: 'Logout', action: onSignOut }];

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (text: string | null) => {
        text && setCurrentPage(text);
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };



    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        >
                            CPD Platform
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={() => handleCloseNavMenu(null)}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {pages.map(({ text, link }) => (
                                    <MenuItem key={text} to={link} component={Link} onClick={() => handleCloseNavMenu(text)}  >
                                        {text}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                        >
                            CPD Platform
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map(({ text, link }) => (
                                <Button
                                    key={text}
                                    to={link} component={Link}
                                    onClick={() => handleCloseNavMenu(text)}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {text}
                                </Button>
                            ))}
                            {context?.admin && <Button
                                onClick={onNewTaskHandler}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                New Task
                            </Button>}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={context.name ?? "Guest"} src={context?.avatar ?? '/'} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting.text} onClick={() => handleCloseNavMenu(null)}>
                                        <Typography onClick={setting.action} textAlign="center">{setting.text}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar >
            <Mybreadcrumbs selectedPage={currentPage} links={pages} />
        </>
    );
};
export default Navigation;