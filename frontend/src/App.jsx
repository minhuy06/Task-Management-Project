import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import AuthPage from './pages/Auth/AuthPage';
import MyTasksPage from './pages/MyTasks/MyTasksPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<AuthPage/>}/>
                <Route path="/tasks" element={
                    <ProtectedRoute>
                        <MyTasksPage/>
                    </ProtectedRoute>
                }
                />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;