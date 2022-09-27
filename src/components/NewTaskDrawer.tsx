import * as React from 'react';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import NewTask from './NewTask';

const drawerBleeding = 56;

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
    onOpen: boolean;
    onToggleDrawer: Function;
    onWriteNewTask: Function;
    onUsersSearch: never[];
}

const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

export default function NewTaskDrawerComponent(props: Props) {
    const { window } = props;

    // This is used only for the example
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <SwipeableDrawer
            container={container}
            anchor="right"
            open={props.onOpen}
            onClose={props.onToggleDrawer(false)}
            onOpen={props.onToggleDrawer(true)}
            swipeAreaWidth={drawerBleeding}
            disableSwipeToOpen={false}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <Puller />
            <NewTask onUsersSearch={props.onUsersSearch} onNewTask={props.onWriteNewTask} />
        </SwipeableDrawer>
    );
}