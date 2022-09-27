import { DataGrid, GridColumns } from '@mui/x-data-grid';
import { FC } from 'react';
import CircleIcon from '@mui/icons-material/Circle';

import Moment from 'moment';
type UserComponentsProps = {
    onResults: never[];
};

const UserComponent: FC<UserComponentsProps> = ({ onResults }) => {
    let resultRow = []
    let uniqureId = 0;
    const formatDate = (({ value }: any) => Moment(value).format('DD MMMM YYYY'));

    for (const property in onResults) {
        uniqureId++;
        const row: any = onResults[property];
        resultRow.push({ ...row, id: uniqureId })
    }
    const customAvatarColumn = ({ value }: { value: string }) => (
        <img width="50px" alt="avatar" src={value} />
    )

    // const customAdminColumn = ({ value }: { value: string }) => {
    //     let isAdmin = Boolean(value);
    //     return isAdmin ? <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "row" }}><CircleIcon fontSize="small" color="success" /> Yes</span> : <span><CircleIcon fontSize="small" color="disabled" />No</span>;
    // }

    const colDefinition: GridColumns = [
        { field: 'photoURL', width: 70, headerName: 'Avatar', renderCell: () => customAvatarColumn },
        { field: 'name', width: 100, headerName: 'Name' },
        { field: 'email', width: 160, headerName: 'E-mail' },
        { field: 'timestamp', width: 150, headerName: 'Created', valueFormatter: formatDate },
    ];

    return (
        <div style={{ height: 800 }}>
            <DataGrid
                columns={colDefinition}
                rows={resultRow}
            />
        </div>);
}

export default UserComponent;