import { useRoutes } from "react-router-dom";

import clientRoutes from "./ClientRouter/routing";
import adminRoutes from "./AdminRouter/AdminRouter";
export default function RoutesManager() {
    return useRoutes([...clientRoutes, ...adminRoutes]);
}