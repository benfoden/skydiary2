export function pathHelper(pathname: string): string {
  switch (pathname) {
    case "/":
      return "/home";
    case "/home":
      return "/topics";
    case "/today":
      return "/home";
    default:
      return pathname;
  }
}
