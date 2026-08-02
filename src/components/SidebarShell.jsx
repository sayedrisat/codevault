import Rail from "./Rail.jsx";
import TreePanel from "./TreePanel.jsx";

export default function SidebarShell(props) {
  return (
    <>
      <Rail />
      <TreePanel {...props} />
    </>
  );
}
