import {
  useNavigate,
  useParams
} from "react-router-dom";

import AdminCourseContent
  from "../../components/admin/courses/AdminCourseContent.jsx";
  


const AdminCourseContentPage = () => {

  const {
    courseId
  } = useParams();

  const navigate = useNavigate();


  return (
    <AdminCourseContent
      courseId={courseId}
      onBack={() =>
        navigate("/admin/courses")
      }
    />
  );

};


export default AdminCourseContentPage;