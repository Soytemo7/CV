import api from "../api.js";


export const getPublishedCourses =
  async () => {

    return await api(
      "/api/academic/courses",
      {
        method: "GET"
      }
    );

  };


export const enrollInCourse =
  async (
    courseId
  ) => {

    if (!courseId) {

      throw new Error(
        "El identificador del curso es obligatorio."
      );

    }


    return await api(
      `/api/academic/enrollments/${courseId}`,
      {
        method: "POST",
        body: JSON.stringify({})
      }
    );

  };