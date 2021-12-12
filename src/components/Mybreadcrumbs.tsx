import { FC } from 'react';
import { Breadcrumbs, Typography } from "@mui/material"
import { Link } from 'react-router-dom';

type MybreadcrumbsProps = {

};
const Mybreadcrumbs: FC<MybreadcrumbsProps> = () => (
    <Breadcrumbs style={{ margin: '10px' }} aria-label="breadcrumb">
        <Link color="inherit" to="/">
            Home
        </Link>
        <Link

            color="inherit"
            to="/getting-started/installation/"
        >
            Core
        </Link>
        <Typography color="text.primary">Breadcrumbs</Typography>
    </Breadcrumbs>
);

export default Mybreadcrumbs;