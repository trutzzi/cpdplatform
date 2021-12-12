
import Checkbox from '@mui/material/Checkbox';
import { DataGrid } from '@mui/x-data-grid';
import Moment from 'moment';
import Button from '@mui/material/Button';

const TaskComponents = (props: any) => {
    const formatDate = (({ value }: any) => Moment(value).format('DD MMMM YYYY'));
    const customDoneFormat = ((customDoneProps: any) => {
        const taskId = customDoneProps.row.id;
        const isDone = Boolean(customDoneProps.value);
        return <Checkbox onClick={() => props.onDone(taskId, !isDone)} checked={isDone} />
    });

    let resultRow: any = []
    let uniqureId = 0;
    for (const property in props.onResults) {
        const row: any = props.onResults[property];
        resultRow.push({ ...row, id: property })
    }

    return (
        <DataGrid
            columns={[
                { field: 'isDone', width: 150, headerName: 'Is Done', renderCell: customDoneFormat },
                { field: 'taskTitle', width: 150, headerName: 'Task' },
                { field: 'taskDescription', width: 150, headerName: 'Description' },
                { field: 'selectedDate', width: 150, headerName: 'Deadline', valueFormatter: formatDate },
                { field: 'timestamp', width: 150, headerName: 'Created', valueFormatter: formatDate },
            ]}
            rows={resultRow}
            components={{
                // ColumnMenu: CustomColumnMenuComponent,
            }}
            componentsProps={{
                // columnMenu: { color },
            }}
        />
    )
}

export default TaskComponents