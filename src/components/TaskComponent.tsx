
import { Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { DataGrid } from '@mui/x-data-grid';
import Moment from 'moment';
import { FC, useContext } from 'react';
import { AuthProvider } from '../contexts/UserContext';


type TaskComponentsProps = {
    onDone: Function,
    onResults: never[]
};

const TaskComponents: FC<TaskComponentsProps> = ({ onDone, onResults }) => {
    const context = useContext(AuthProvider)
    const isAdmin = context?.admin;
    const formatDate = (({ value }: any) => Moment(value).format('DD MMMM YYYY'));

    const customDoneFormat = ((customDoneProps: any) => {
        const taskId = customDoneProps.row.id;
        const isDone = Boolean(customDoneProps.value);
        const personsAssigned = Boolean(customDoneProps.value);

        return <Checkbox onClick={() => onDone(taskId, !isDone)} checked={isDone} />
    });
    const customAssignedFormat = ((person: { id: string }) => person.id);

    let resultRow: any = []
    for (const property in onResults) {
        const row: any = onResults[property];
        resultRow.push({ ...row, id: property })
    }
    const columnsDefintition = [
        { field: 'isDone', width: 75, headerName: 'Status', renderCell: customDoneFormat },
        { field: 'taskTitle', width: 150, headerName: 'Task' },
        { field: 'taskDescription', width: 150, headerName: 'Description' },
        { field: 'selectedDate', width: 150, headerName: 'Deadline', valueFormatter: formatDate },
        { field: 'timestamp', width: 150, headerName: 'Created', valueFormatter: formatDate },
    ];

    if (isAdmin) {
        columnsDefintition.push({ field: 'personsAssigned', width: 350, headerName: 'Assigned', valueFormatter: customAssignedFormat },
        )
    }

    return (
        <div style={{ height: 600 }}>
            <Typography variant='h4'>{context.name}'s tasks</Typography>
            <DataGrid
                columns={columnsDefintition}
                rows={resultRow}
            />
        </div>
    )
}

export default TaskComponents