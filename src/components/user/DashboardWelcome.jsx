function DashboardWelcome({ user }) {
  const name =
    user?.name ||
    user?.displayName ||
    "Usuario";

  return (
    <header className="user-dashboard-header">
      <span className="user-dashboard-eyebrow">
        Área académica
      </span>

      <h1>
        Bienvenido, {name}
      </h1>

      <p>
        Consulta tu actividad académica y continúa con tus cursos.
      </p>
    </header>
  );
}

export default DashboardWelcome;