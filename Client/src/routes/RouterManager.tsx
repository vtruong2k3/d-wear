import { useRoutes } from "react-router-dom";

import clientRouter from "./ClientRouter";
import adminRoutes from "../routes/AdminRouter";
export default function RoutesManager() {
    return useRoutes([...clientRouter, ...adminRoutes]);
}