
export function getPages(isAdmin: boolean | null | undefined) {
    const pages = [{ text: 'Home', link: '/' }];
    if (isAdmin) {
        pages.push({ text: 'Employees', link: '/users' }, { text: 'Tasks', link: '/tasks' });
    } else {
        pages.push({ text: 'My tasks', link: '/mytask' });
    }
    return pages;
}