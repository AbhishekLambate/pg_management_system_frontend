import api_helper from './api_helper';

/* ── Auth ── */
export const authLogin = async (data) => {
    return await api_helper.post('/auth/login', { username: data.username, password: data.password });
};
export const authRegister = async (data) => api_helper.post('/auth/register', data);

/* ── Locations ── */
export const createLocation = (data) => api_helper.post('/locations/', data);
export const getLocations = () => api_helper.get('/locations/');
export const getLocation = (id) => api_helper.get(`/locations/${id}`);
export const updateLocation = (id, data) => api_helper.put(`/locations/${id}`, data);
export const deleteLocation = (id) => api_helper.delete(`/locations/${id}`);

/* ── Buildings ── */
export const createBuilding = (data) => api_helper.post('/buildings/', data);
export const getBuildings = () => api_helper.get('/buildings/');
export const getBuildingsByLocation = (locationId) => api_helper.get(`/buildings/by-location/${locationId}`);
export const getBuilding = (id) => api_helper.get(`/buildings/${id}`);
export const updateBuilding = (id, data) => api_helper.put(`/buildings/${id}`, data);
export const deleteBuilding = (id) => api_helper.delete(`/buildings/${id}`);

/* ── Rooms ── */
export const createRoom = (data) => api_helper.post('/rooms/', data);
export const getRooms = () => api_helper.get('/rooms/');
export const getVacantRooms = () => api_helper.get('/rooms/vacant');
export const getRoomsByBuilding = (buildingId) => api_helper.get(`/rooms/by-building/${buildingId}`);
export const getRoom = (id) => api_helper.get(`/rooms/${id}`);
export const updateRoom = (id, data) => api_helper.put(`/rooms/${id}`, data);
export const deleteRoom = (id) => api_helper.delete(`/rooms/${id}`);

/* ── Tenants ── */
export const createTenant = (data) => api_helper.post('/tenants/', data);
export const getTenants = () => api_helper.get('/tenants/');
export const getMyProfile = () => api_helper.get('/tenants/me');
export const getTenantsByRoom = (roomId) => api_helper.get(`/tenants/by-room/${roomId}`);
export const getTenant = (id) => api_helper.get(`/tenants/${id}`);
export const updateTenant = (id, data) => api_helper.put(`/tenants/${id}`, data);
export const deleteTenant = (id) => api_helper.delete(`/tenants/${id}`);
export const assignRoom = (id, data) => api_helper.post(`/tenants/${id}/assign-room`, data);
export const checkoutTenant = (id, data) => api_helper.post(`/tenants/${id}/checkout`, data);

/* ── Staff ── */
export const getStaff = () => api_helper.get('/staff/');
export const createStaff = (data) => api_helper.post('/staff/', data);

/* ── Complaints ── */
export const getComplaints = () => api_helper.get('/complaints/');
export const createComplaint = (data) => api_helper.post('/complaints/', data);

/* ── Expenses ── */
export const getExpenses = () => api_helper.get('/expenses/');
export const createExpense = (data) => api_helper.post('/expenses/', data);

/* ── Visitors ── */
export const getVisitors = () => api_helper.get('/visitors/');
export const createVisitor = (data) => api_helper.post('/visitors/', data);

/* ── Notices ── */
export const getNotices = () => api_helper.get('/notices/');
export const createNotice = (data) => api_helper.post('/notices/', data);

/* ── Payments & Dashboard ── */
export const getPayments = () => api_helper.get('/payments/');
export const getDashboardStats = () => api_helper.get('/dashboard/stats');
