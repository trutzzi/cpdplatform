import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { AutocompleteValue, Grid, Typography, InputLabel, Button, Autocomplete } from '@mui/material';

type AssignedValue = AutocompleteValue<{ assigned: React.SetStateAction<string> } | unknown, undefined, undefined, undefined>;

export default function ValidationTextFields({ onNewTask, onUsersSearch }: any) {
    const [selectedDate, setDate] = useState<MaterialUiPickersDate | null>(null);
    const [selectedDateValue, setSelectedDateValue] = useState(moment().format("DD MMMM YYYY"));
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [isValidInput, setIsValidInput] = useState(true);
    const [personAssigned, setPersonsAssigned] = useState<string>('');
    const [assignedOptions, setAssignedOptions] = useState<readonly unknown[]>([])

    useEffect(() => {
        if (taskTitle.length && taskDescription.length && selectedDateValue?.length) {
            setIsValidInput(false)
        } else {
            setIsValidInput(true);
        }
    }, [taskTitle, taskDescription, selectedDate])

    const onDateChange = (date: MaterialUiPickersDate, value: string | null | undefined) => {
        setDate(date);
        if (value) {
            setSelectedDateValue(value);
        }
    };

    const dateFormatter = (str: string) => {
        return str;
    };

    const handlenewTask = () => {
        onNewTask(taskTitle, taskDescription, selectedDateValue, personAssigned);
    }

    useEffect(() => {
        const newUsers = [];
        for (const property in onUsersSearch) {
            const user = onUsersSearch[property];
            newUsers.push({ label: user?.name, assigned: user?.uid });
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
                <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                    <KeyboardDatePicker
                        autoOk={true}
                        disablePast={true}
                        label="Deadline"
                        showTodayButton={true}
                        value={selectedDate}
                        format="DD MMMM YYYY"
                        inputValue={selectedDateValue}
                        onChange={onDateChange}
                        rifmFormatter={dateFormatter}
                    />
                </MuiPickersUtilsProvider>
            </Grid>
            <Grid item>
                <InputLabel id="usersAssignedLabel">Assign taks</InputLabel>
                <Autocomplete
                    disablePortal
                    id="assigned"
                    options={assignedOptions}
                    onChange={(event) => {
                        // TODO: Change event 
                        // setPersonsAssigned(assigned);
                        console.log(event);
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