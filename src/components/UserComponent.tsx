import { DataGrid } from '@mui/x-data-grid';
import CircleIcon from '@mui/icons-material/Circle';

import Moment from 'moment';

const UserComponent = (props: any) => {
    let resultRow: any = []
    console.log(props)
    let uniqureId = 0;
    const formatDate = (({ value }: any) => Moment(value).format('DD MMMM YYYY'));

    for (const property in props.onResults) {
        uniqureId++;
        const row: any = props.onResults[property];
        resultRow.push({ ...row, id: uniqureId })
    }
    const customAvatarColumn = ({ value }: { value: string }) => (
        value.length ? <img width="50px" src={value} /> : ''
    )

    const customAdminColumn = ({ value }: { value: string }) => {
        let isAdmin = Boolean(value);
        return isAdmin ? <span><CircleIcon fontSize="small" color="success" /> Yes</span> : <span><CircleIcon fontSize="small" color="disabled" />No</span>;
    }
    
    console.log(resultRow)

    return (
        <DataGrid
            columns={[
                { field: 'photoURL', width: 70, headerName: 'Avatar', renderCell: customAvatarColumn },
                { field: 'name', width: 100, headerName: 'Name' },
                { field: 'email', width: 160, headerName: 'E-mail' },
                { field: 'timestamp', width: 150, headerName: 'Timestamp', valueFormatter: formatDate },
                { field: 'admin', width: 85, headerName: 'Is admin', renderCell: customAdminColumn },
                { field: 'uid', width: 150, headerName: 'UID' },
            ]}
            rows={resultRow}
            components={{
                // ColumnMenu: CustomColumnMenuComponent,
            }}
            componentsProps={{
                // columnMenu: { color },
            }}
        />);
}

export default UserComponent;