import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import AuthPage from './pages/Auth/AuthPage';
import MyTasksPage from './pages/MyTasks/MyTasksPage'
import ProtectedRoute from './components/ProtectedRoute'
import TagManagementPage from './pages/Tag/TagManagementPage'
import CategoryManagementPage from './pages/Category/CategoryManagementPage'
import MainLayout from './components/MainLayout'

function App() {
    return (
            <Routes>
                <Route path="/login" element={<AuthPage/>}/>
                <Route element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    <Route path="/tasks" element={<MyTasksPage />} />
                    <Route path="/categories" element={<CategoryManagementPage />} />
                    <Route path="/tags" element={<TagManagementPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
    );
}

export default App;