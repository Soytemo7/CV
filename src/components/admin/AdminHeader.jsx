import ThemeToggle
  from "../common/ThemeToggle.jsx";

import ProfileDropdown
  from "../private/ProfileDropdown.jsx";


function AdminHeader({
  isDark,
  setIsDark,
}) {

  return (

    <header className="private-header admin-header">

      <div className="admin-header-right">

        {/* ==================================================
            TEMA
            ================================================== */}

        <div className="private-theme-container">

          <ThemeToggle
            isDark={isDark}
            setIsDark={setIsDark}
          />

        </div>


        {/* ==================================================
            USUARIO
            ================================================== */}

        <div className="private-profile-container">

          <ProfileDropdown />

        </div>

      </div>

    </header>

  );

}


export default AdminHeader;