import { Divider } from "primereact/divider";

function NotFound() {
  return (
    <main className="flex-1 flex align-items-center justify-content-center h-full">
      <div className="flex align-items-center">
        <p className="text-lg">404</p>
        <Divider layout="vertical" />
        <p className="text-lg">Page not found</p>
      </div>
    </main>
  );
}

export default NotFound;
