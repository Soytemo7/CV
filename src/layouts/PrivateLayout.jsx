import { Navigate } from "react-router-dom";
import { useContext } from "react";
import {
  AuthContext,
  AuthProvider
} from "../context/AuthContext.jsx";


function PrivateContent({ children }) {

  const { user, loading } = useContext(AuthContext);


  if (loading) {
    return null;
  }


  if (!user) {
    return <Navigate to="/login" replace />;
  }


  return (
    <main>
      {children}
    </main>
  );

}


function PrivateLayout({ children }) {

  return (
    <AuthProvider checkOnMount={true}>
      <PrivateContent>
        {children}
      </PrivateContent>
    </AuthProvider>
  );

}


export default PrivateLayout;