import { FC } from 'react';
import { Breadcrumbs, Typography } from "@mui/material"
import { Link } from 'react-router-dom';

type MybreadcrumbsProps = {
    links: { text: string, link: string }[];
    selectedPage: string;
};
const Mybreadcrumbs: FC<MybreadcrumbsProps> = ({ links, selectedPage }) => (
    <Breadcrumbs style={{ margin: '10px' }} aria-label="breadcrumb">
        {links.map(item => {
            if (item.text === selectedPage) {
                return <Link

                    color="inherit"
                    to={item.link}
                >
                    {item.text}
                </Link>
            }
        })}
    </Breadcrumbs>
);

export default Mybreadcrumbs;