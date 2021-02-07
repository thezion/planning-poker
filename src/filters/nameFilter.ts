export default function nameFilter(name: string): string {
  return name
    .split(' ')
    .map(n => {
      return n.charAt(0).toUpperCase() + n.substring(1);
    })
    .join(' ');
}
