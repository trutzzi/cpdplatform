import { FC } from 'react';
import { Breadcrumbs, Container, Typography } from "@mui/material"
import { Link } from 'react-router-dom';

type MybreadcrumbsProps = {
    links: { text: string, link: string }[];
    selectedPage: string;
};
const Mybreadcrumbs: FC<MybreadcrumbsProps> = ({ links, selectedPage }) => (
    <Container>
        <Breadcrumbs style={{ marginTop: '10px', marginBottom: '10px' }} aria-label="breadcrumb">
            {links.map(item => {
                if (item.text === selectedPage) {
                    return <Link
                        style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}
                        to={item.link}
                    >
                        {item.text}
                    </Link>
                }
            })}
        </Breadcrumbs>
    </Container>
);

export default Mybreadcrumbs;