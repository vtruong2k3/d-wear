import { useRoutes } from "react-router-dom";
import AdminRouter from '../routes/AdminRouter'
import ClientRouter from './ClientRouter'
export default function RoutesManager() {
    return useRoutes([AdminRouter, ClientRouter]);
}