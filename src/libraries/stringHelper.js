export function ucfirst(string) {
    return string
        .split(' ')
        .map((n) => {
            return n.charAt(0).toUpperCase() + n.substring(1);
        })
        .join(' ');
}

export function trimName(string) {
    return (string || '').trim().toLowerCase();
}
