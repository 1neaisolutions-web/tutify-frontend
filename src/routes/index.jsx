// Library Imports
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Local Imports
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import {
  authRoutes,
  commonRoutes,
  superAdminRoutes,
  orgAdminRoutes,
  schoolAdminRoutes,
  teacherRoutes,
  studentRoutes,
  parentRoutes,
} from './config';
import DashboardLayout from '../components/DashboardLayout';
import { UnknownRouteRedirect } from './routeHelpers';
import { ContentPackDetail } from '../pages/features/ContentPackDetail';
import { DocumentUpload } from '../pages/features/DocumentUpload';
import { DocumentDetails } from '../pages/features/DocumentDetails';


export const Router = () => {
  // Check if Redux is rehydrated before accessing state
  const isRehydrated = useSelector((state) => state?._persist?.rehydrated) ?? false;
  const user = useSelector((state) => state?.auth?.user);

  // Debug logging
  console.log('[Router] isRehydrated:', isRehydrated, 'user:', user);

  // Show loading state while Redux is rehydrating
  if (!isRehydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const dynamicDashboardRoute =
    user?.role === 'super_admin'
      ? [...commonRoutes, ...superAdminRoutes]
      : user?.role === 'org_admin'
      ? [...commonRoutes, ...orgAdminRoutes]
      : user?.role === 'school_admin'
      ? [...commonRoutes, ...schoolAdminRoutes]
      : user?.role === 'teacher'
      ? [...commonRoutes, ...teacherRoutes]
      : user?.role === 'student'
      ? [...commonRoutes, ...studentRoutes]
      : user?.role === 'parent'
      ? [...commonRoutes, ...parentRoutes]
      : // If user is authenticated but role is null, default to teacher routes
      // This handles cases where backend returns roles: null
      user?.token
      ? [...commonRoutes, ...teacherRoutes]
      : commonRoutes;

  // Debug: Log routes for content packs
  if (process.env.NODE_ENV === 'development') {
    const contentPackRoutes = dynamicDashboardRoute.filter(r => 
      r.path === '/admin/content-packs' || r.child?.some(c => c.path?.includes('/admin/content-packs'))
    );
    console.log('[Router] Content pack routes:', contentPackRoutes);
    console.log('[Router] User role:', user?.role);
    console.log('[Router] All routes being registered:', dynamicDashboardRoute.map(r => ({
      path: r.path,
      hasChildren: !!r.child,
      children: r.child?.map(c => c.path)
    })));
  }

  return (
    <Routes>
      {/* Public routes first (login, signup, etc.) - these should be accessible without auth */}
      <Route element={<PublicRoutes />}>
        {authRoutes?.map((route, index) => {
          // Skip wildcard route - handle it at the end
          if (route.path === '*') return null;
          return (
            <Route path={route?.path} element={route?.element} key={`auth-${index}`} />
          );
        })}
      </Route>
      
      {/* Private routes (dashboard, features, etc.) - require authentication */}
      <Route element={<PrivateRoutes />}>
        {/* CRITICAL: Register these routes FIRST as direct routes to ensure they match */}
        {/* These routes MUST come before the wildcard route to be matched */}
        {process.env.NODE_ENV === 'development' && console.log('[Router] Registering direct routes: /admin/content-packs/:id and /admin/documents/upload')}
        
        {/* Content Pack Detail Route */}
        <Route 
          path="/admin/content-packs/:id" 
          element={
            <DashboardLayout>
              <ContentPackDetail />
            </DashboardLayout>
          } 
          key="content-pack-detail-direct"
        />
        
        {/* Document Upload Route */}
        <Route 
          path="/admin/documents/upload" 
          element={
            <DashboardLayout>
              <DocumentUpload />
            </DashboardLayout>
          } 
          key="document-upload-direct"
        />
        
        {/* Document Detail Route */}
        <Route 
          path="/admin/documents/:id" 
          element={
            <DashboardLayout>
              <DocumentDetails />
            </DashboardLayout>
          } 
          key="document-detail-direct"
        />
        
        {dynamicDashboardRoute?.flatMap((route, index) => {
          // Routes with children: return child routes FIRST (more specific), then parent route
          // This ensures React Router matches the most specific route first
          if (route.child && route.child.length > 0) {
            const childRoutes = route.child.map((childRoute, childIndex) => {
              // Skip routes that are already registered directly above
              if (childRoute.path === '/admin/content-packs/:id' || 
                  childRoute.path === '/admin/documents/upload' ||
                  childRoute.path === '/admin/documents/:id') {
                if (process.env.NODE_ENV === 'development') {
                  console.log(`[Router] Skipping duplicate child route: ${childRoute.path} (already registered directly)`);
                }
                return null;
              }
              if (process.env.NODE_ENV === 'development') {
                console.log(`[Router] Registering child route: ${childRoute.path} for parent: ${route.path}`);
              }
              return (
                <Route 
                  key={`child-${index}-${childIndex}`}
                  path={childRoute.path} 
                  element={childRoute.element} 
                />
              );
            }).filter(Boolean); // Remove null entries
            const parentRoute = (
              <Route 
                key={`parent-${index}`}
                path={route.path} 
                element={route.element} 
              />
            );
            if (process.env.NODE_ENV === 'development') {
              console.log(`[Router] Registering parent route: ${route.path} with ${route.child.length} children`);
            }
            // IMPORTANT: Return child routes FIRST, then parent route
            // React Router v6 matches routes in order, so more specific routes must come first
            return [...childRoutes, parentRoute];
          }
          // Routes without children: return single route
          if (process.env.NODE_ENV === 'development' && route.path?.includes('content-packs')) {
            console.log(`[Router] Registering route: ${route.path}`);
          }
          return (
            <Route path={route.path} element={route.element} key={`private-${index}`} />
          );
        })}
      </Route>
      
      {/* Final fallback - role-aware redirect (avoids /dashboard loop for non-teacher roles) */}
      <Route path="*" element={<UnknownRouteRedirect />} />
    </Routes>
  );
};
