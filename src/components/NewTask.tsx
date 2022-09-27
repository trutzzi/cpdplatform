import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
// import {
//     MuiPickersUtilsProvider,
//     KeyboardDatePicker
// } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
// import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { AutocompleteValue, Grid, Typography, InputLabel, Button, Autocomplete } from '@mui/material';

type OptionsAssign = { label: string, value: string };

export default function ValidationTextFields({ onNewTask, onUsersSearch }: any) {
    const [selectedDate, setDate] = useState(null);
    const [selectedDateValue, setSelectedDateValue] = useState(moment().format("DD MMMM YYYY"));
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [isValidInput, setIsValidInput] = useState(true);
    const [personAssigned, setPersonsAssigned] = useState<string>('');
    const [assignedOptions, setAssignedOptions] = useState<OptionsAssign[]>([])

    useEffect(() => {
        if (taskTitle.length && taskDescription.length && selectedDateValue?.length) {
            setIsValidInput(false)
        } else {
            setIsValidInput(true);
        }
    }, [taskTitle, taskDescription, selectedDate])

    const dateFormatter = (str: string) => {
        return str;
    };

    const handlenewTask = () => {
        onNewTask(taskTitle, taskDescription, selectedDateValue, personAssigned);
    }

    useEffect(() => {
        const newUsers: OptionsAssign[] = [];
        for (const property in onUsersSearch) {
            const user = onUsersSearch[property];
            newUsers.push({ label: user?.name, value: user?.uid });
        }
        setAssignedOptions(newUsers);
    }, [onUsersSearch]);


    return (
        <Grid container flexDirection="column" spacing={1} padding={2}>
            <Typography>Create new task</Typography>
            <Grid item>
                <TextField
                    id="taskTitle"
                    label="Task title"
                    onChange={e => setTaskTitle(e.target.value)}
                />
            </Grid>
            <Grid item>
                <TextField
                    id="taskDescription"
                    label="Task description"
                    onChange={e => setTaskDescription(e.target.value)}
                />
            </Grid>
            <Grid item>
                <TextField label='Deadline time' />
            </Grid>
            <Grid item>
                <InputLabel id="usersAssignedLabel">Assign taks</InputLabel>
                <Autocomplete
                    disablePortal
                    id="assigned"
                    options={assignedOptions}
                    onChange={(event, newValue) => {
                        console.log(newValue)
                        setPersonsAssigned(newValue?.value || '')
                    }}
                    renderInput={(params) => {
                        return <TextField {...params} />
                    }}
                />
            </Grid>
            <Grid item>
                <Button disabled={isValidInput} onClick={handlenewTask}>Create Task</Button>
            </Grid>
        </Grid>
    );
}