import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";
import Button from '@mui/material/Button'
import MomentUtils from "@date-io/moment";
import moment from "moment";



export default function ValidationTextFields({ onNewTask }: any) {
    const [selectedDate, setDate] = useState(moment());
    const [selectedDateValue, setSelectedDateValue] = useState(moment().format("DD MMMM YYYY"));
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [isValidInput, setIsValidInput] = useState(true);

    useEffect(() => {
        if (taskTitle.length && taskDescription.length && selectedDateValue?.length) {
            setIsValidInput(false)
        } else {
            setIsValidInput(true);
        }
    }, [taskTitle, taskDescription, selectedDate])

    const onDateChange = (date: any, value: any) => {
        console.log(value);
        setDate(date);
        setSelectedDateValue(value);
    };

    const dateFormatter = (str: any) => {
        return str;
    };

    const handlenewTask = () => {
        onNewTask(taskTitle, taskDescription, selectedDateValue);
    }

    return (
        <Box
            component="form"
            display="flex"
            flexDirection="column"

            noValidate
            autoComplete="off"
        >
            <TextField
                id="taskTitle"
                label="Task title"
                onChange={e => setTaskTitle(e.target.value)}
            />
            <TextField
                id="taskDescription"
                label="Task description"
                onChange={e => setTaskDescription(e.target.value)}
            />
            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                <KeyboardDatePicker
                    autoOk={true}
                    label="Deadline"
                    showTodayButton={true}
                    value={selectedDate}
                    format="DD MMMM YYYY"
                    inputValue={selectedDateValue}
                    onChange={onDateChange}
                    rifmFormatter={dateFormatter}
                />
            </MuiPickersUtilsProvider>
            <Button disabled={isValidInput} onClick={handlenewTask}>Create Task</Button>
        </Box >
    );
}