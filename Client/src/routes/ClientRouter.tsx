
import ClientLayout from '../layouts/ClientLayout'
import Home from '../pages/client/Home'


const clientLayout = {
    path: "/",
    element: <ClientLayout />,
    children: [
        { path: "home", element: <Home /> }
    ]
}
export default clientLayout